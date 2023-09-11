# Input:
msg.payload format:
```json
[
  {
    "id": 11,
    "weight": 3,
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
    ],
    ....data (key value pairs) for this task.....
  },
  {
    "id": 14,
    "weight": 3,
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
    ],
    ....data (key value pairs) for this task.....
  }
]
```

#Output:
```json
```