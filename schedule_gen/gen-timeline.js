const moment = require('moment');

const ITEM_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';
const SCHEDULE_RESULT_DATETIME_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";

function splitTimeString(str) {
  let splt = str.split('.');
  let splt2 = splt[0].split(':');
  return [Number(splt2[0]), Number(splt2[1]), Number(splt2[2]), Number(splt[1])];
}

async function generateDetailSchedule(scheduleItems, from, to) {
  let nowMoment = moment();
  let rawDetail = [];
  scheduleItems.forEach(item => {
    let checkingMoment = moment(from);
    while (checkingMoment.isSameOrBefore(to, 'day')) {
      if (item.start_date === null || item.end_date === null || checkingMoment.isBetween(item.start_date, item.end_date, 'day', '[]')) {
        // check days in week
        if (item.days.length === 0 || item.days.some((d) => (d%7 == checkingMoment.day()))) {
          let isOverDay = false;
          let detailStartMoment = moment(checkingMoment);
          let startTimeSpliting = splitTimeString(item.start_time);
          detailStartMoment.set({'hour': startTimeSpliting[0], 'minute': startTimeSpliting[1], 'second': startTimeSpliting[2], 'millisecond': 0});
          //
          let detailEndMoment = moment(checkingMoment);
          let endTimeSpliting = splitTimeString(item.end_time);
          detailEndMoment.set({'hour': endTimeSpliting[0], 'minute': endTimeSpliting[1], 'second': endTimeSpliting[2], 'millisecond': 0});
          if (detailEndMoment.isBefore(detailStartMoment)) {
            detailEndMoment.add(1, 'd');
            isOverDay = true;
          }
          //
          if (detailStartMoment.isBetween(from, to, undefined, "[]")
              || detailEndMoment.isBetween(from, to, undefined, "[]")) {
            let isNow = nowMoment.isBetween(detailStartMoment, detailEndMoment, undefined, "[]");
            rawDetail.push({
              detailStartMoment,
              detailEndMoment,
              playlist: item.playlist,
              weight: item.weight,
              loop_once: item.loop_once,
              is_now: isNow
            });
          }
          //
          if (isOverDay) {
            let detailStartMoment2 = moment(detailStartMoment);
            let detailEndMoment2 = moment(detailEndMoment);
            detailStartMoment2.subtract(1, 'd');
            detailEndMoment2.subtract(1, 'd');
            if (detailStartMoment2.isBetween(from, to, undefined, "[]")
                || detailEndMoment2.isBetween(from, to, undefined, "[]")) {
              let isNow = nowMoment.isBetween(detailStartMoment2, detailEndMoment2, undefined, "[]");
              rawDetail.push({
                detailStartMoment: detailStartMoment2,
                detailEndMoment: detailEndMoment2,
                playlist: item.playlist,
                weight: item.weight,
                loop_once: item.loop_once,
                is_now: isNow
              });
            }
          }
        }
      }
      checkingMoment.add(1, 'd');
    }
  });
  
  rawDetail.sort((a, b) => a.detailStartMoment.isBefore(b.detailStartMoment) ? -1 : 1);
  //
  let prevE = undefined;
  let fRawDetail = rawDetail.reduce((acc, e) => {
    let couldAdd = true;
    if (prevE) {
      if (prevE.playlist === e.playlist && prevE.detailStartMoment.isSame(e.detailStartMoment) && prevE.detailEndMoment.isSame(e.detailEndMoment)) {
        couldAdd = false;
      }
    }
    if (couldAdd) acc.push(e);
    prevE = e;
    return acc;
  }, []);
  
  return fRawDetail.map(d => ({
    "start_timestamp": d.detailStartMoment.unix(),
    "start": d.detailStartMoment.format(SCHEDULE_RESULT_DATETIME_FORMAT),
    "end_timestamp": d.detailEndMoment.unix(),
    "end": d.detailEndMoment.format(SCHEDULE_RESULT_DATETIME_FORMAT),
    "is_now": d.is_now,
    "loop_once": d.loop_once,
    "playlist": d.playlist.toString(),
    "weight": d.weight,
  }));
}

async function genTimelineFromSchedule(playlists, startMs, endMs, rangeMs) {
  let scheduleItems = [];
  const playlistMap = playlists.reduce((acc, playlist) => {
    let newPlaylist = {...playlist};
    delete newPlaylist.schedule_items;
    //
    if (newPlaylist?.source_type === 'songs') delete newPlaylist.stream_url;// for author's project
    //
    acc[playlist.id] = newPlaylist;
    //
    playlist.schedule_items.forEach(item => {
      let newItem = {...item};
      delete newItem.id;
      newItem.playlist = playlist.id;
      newItem.weight = playlist.weight;
      scheduleItems.push(newItem);
    });
    return acc;
  }, {});

  // Parse start/end date
  let startMoment = Boolean(startMs) ? moment(startMs) : moment();
  let endMoment = Boolean(endMs) ? moment(endMs) : moment(startMoment.valueOf() + rangeMs);// 24*60*60*1000 = 86400000
  if (!(startMoment.isValid() && endMoment.isValid())) {
    return {
      error: true,
      errorMsg: "Start time or end time is invalid",
      errorId: "invalid-time",
    }
  }
  if (endMoment <= startMoment) {
    return {
      error: true,
      errorMsg: "Start time must be before end time",
      errorId: "invalid-duration",
    }
  }

  let detailSchedule = await generateDetailSchedule(scheduleItems, startMoment, endMoment);
  //
  const usedPlaylists = {};
  detailSchedule.forEach((schedule)=>{
    if (!usedPlaylists.hasOwnProperty(schedule.playlist))
      usedPlaylists[schedule.playlist] = playlistMap[schedule.playlist];
  });

  return {
    playlists: usedPlaylists, schedules: detailSchedule
  }
}

module.exports = function (RED) {
  function genTimeline(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on('input', function (msg) {
      // config
      var scheduleConfig;
      try { scheduleConfig = JSON.parse(config.schedule); } catch(e) {}
      var startConfig;
      try { startConfig = Number.parseInt(config.start); } catch(e) {}
      var endConfig;
      try { endConfig = Number.parseInt(config.end); } catch(e) {}
      var rangeConfig;
      try { rangeConfig = Number.parseInt(config.range); } catch(e) {}

      //
      var schedule = (Array.isArray(msg.payload) && msg.payload) || (Array.isArray(scheduleConfig) && scheduleConfig) || [];
      var startMs = msg.start || (!isNaN(startConfig) && startConfig) || undefined;
      var endMs = msg.end || (!isNaN(endConfig) && endConfig) || undefined;
      var rangeMs = msg.range || (!isNaN(rangeConfig) && rangeConfig) || 86400000;
      genTimelineFromSchedule(schedule, startMs, endMs, rangeMs)
        .then((res) => {
          msg.payload = res;
          node.send(msg);
        });
    });
  }

  RED.nodes.registerType("gen-timeline", genTimeline);
}