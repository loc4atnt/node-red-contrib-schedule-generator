msg.payload example:
```json
[
  {
      "id": 9,
      "title": "Nhạc tháng 3",
      "source_type": "songs",
      "order": "shuffle",
      "stream_url": null,
      "weight": 5,
      "createdAt": "2023-02-24T16:12:21.030Z",
      "updatedAt": "2023-09-11T08:40:44.655Z",
      "songs": [
          {
              "id": 11,
              "title": "Lá cờ - Tạ Quang Thắng",
              "length": 319,
              "file": {
                  "id": 15,
                  "hash": "La_Co_Ta_Quang_Thang_Dieu_Nho_Xiu_Xiu_MV_Lyrics_e1f0d7000c",
                  "ext": ".mp3",
                  "mime": "audio/mpeg",
                  "size": 1250.337890625,
                  "url": "https://vnmap-backend.inut.vn/uploads/La_Co_Ta_Quang_Thang_Dieu_Nho_Xiu_Xiu_MV_Lyrics_e1f0d7000c.mp3"
              }
          },
          {
              "id": 16,
              "title": "[Clip] Dòng thời gian - Nguyễn Hải Phong",
              "length": 302,
              "file": {
                  "id": 20,
                  "hash": "Clip_Dong_thoi_gian_Nguyen_Hai_Phong_e32c3412f0",
                  "ext": ".mp3",
                  "mime": "audio/mpeg",
                  "size": 1180.1455078125,
                  "url": "https://vnmap-backend.inut.vn/uploads/Clip_Dong_thoi_gian_Nguyen_Hai_Phong_e32c3412f0.mp3"
              }
          }
      ],
      "schedule_items": [
          {
              "id": 15,
              "loop_once": false,
              "days": [
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7
              ],
              "end_date": null,
              "start_date": null,
              "end_time": "12:30:00.000",
              "start_time": "11:00:00.000"
          }
      ]
  },
  {
      "id": 11,
      "title": "Martin Garrix - Tomorrow Land",
      "source_type": "stream_url",
      "order": null,
      "stream_url": "https://soundcloud.com/edwardj_81/martin-garrix-tomorrowland-2022",
      "weight": 3,
      "createdAt": "2023-02-27T12:00:58.606Z",
      "updatedAt": "2023-03-31T08:46:52.293Z",
      "songs": [],
      "schedule_items": [
          {
              "id": 22,
              "loop_once": false,
              "days": [],
              "end_date": "2023-04-02",
              "start_date": "2023-03-28",
              "end_time": "17:35:00.288",
              "start_time": "16:30:00.475"
          }
      ]
  },
  {
      "id": 14,
      "title": "Tiếp sóng VOH",
      "source_type": "stream_url",
      "order": null,
      "stream_url": "https://inut.cast.mysystemservice.com/listen/admin/stream_in",
      "weight": 3,
      "createdAt": "2023-03-08T03:44:45.847Z",
      "updatedAt": "2023-03-08T03:44:45.847Z",
      "songs": [],
      "schedule_items": [
          {
              "id": 23,
              "loop_once": false,
              "days": [],
              "end_date": "2023-03-09",
              "start_date": "2023-03-07",
              "end_time": "11:00:00.838",
              "start_time": "10:48:00.959"
          }
      ]
  }
]
```