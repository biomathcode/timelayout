## Build Your Own Calendar
 I tried to build a google Calendar keeping in mind the what, how and why. This Readme would give you a refresher on how apps like amie, rise, cron(notion calendar now), or google calendar works. I have tried to show the RADIO(requirement, high level Architecture, Data Model, API Design(model), Optimization/performace) process of any design system interview. Feedback or issue are welcome, if you find any mistakes in the technical context of writing or grammatical mistakes that i would have made on my side. 

I also tried to write the code for the requirements and build a pretty good clone. In the beginning i was just prototyping in javascript thinking if i will be able to build something  complex or with the time limitation. Turn out i did. I rewrote the whole codebase in Typescript. Because why not. Rewriting or refactoring is the best way to learn something and also helps to correct my mistakes that i was not aware of in the beginning. I also didn't do much research while prototyping with javascript. I tried a some libraries that didn't solve my requirements. I faced a lot of issue with date type. 

In the begining of january 2024 there were a lot of calendar apps that where getting traction. Getting a good UX of a calendar is very hard. Different Calendars try to solve the UI/UX problems differently. eg:

1. Create an event
   * Rise and cron has a sidebar, whereas google calendar uses a popover
2. Event Display
   * Google Calendar - show start and end time of an event, Background is fully colour, 
   * Rise - shows start time only, background has a alpha opacity to it
3. Weekly Display
   * Google calendar - Uses Pagination
   * Rise & cron - uses infinite horizontal scroll (with virtualization)
4. Long Event - Event longer than two days
   * usually are added on the top of timelines, 
5. Drag and drop events its usually the same
   * You can drag an events on timeslots, starttime, endtime, and date will change based on the time slot you add in.
6. Drag to create a new events
   * You can drag on timeline to create a new event, it will show a preview of the event with time display
7. Event Types
   * Google Calendar and Amie  have tasks and events
   * Rise has events only
8. Sharing Time Slots
   * You can share timeslots for meeting, or anyone can add an event on your calendar. 
   * Rise has this auto meeting conflict resolution, which will just schedule a meeting later based on your preferences. 
9. Timezones
   * You can change the timezones


---

### Understanding dates

There are two way to save dates, 

- one save in the ISO string formate 

"2024-01-17T09:30:00.000Z" => We will store the user participants timeZone as well. 
Used by Cal.com



```js

// Assume this timestamp is retrieved from the database
const timestampFromDatabase = "2024-01-16T20:45:00.000Z";

// Get the user's timezone (you might obtain this from user preferences or browser settings)
const userTimezone = "Asia/Kolkata"; // Example timezone

// Create a Date object from the timestamp (in UTC)
const date = new Date(timestampFromDatabase);

// Adjust the date to the user's timezone
date.toLocaleString("en-US", { timeZone: userTimezone });

// Display or use the adjusted date as needed
console.log(date.toLocaleString()); // Adjusted timestamp for the user's timezone
```



- Storing Date By Amie


other is to save ISO String + the offset => the offset is based on the user locations


```js

const timestamp = "2024-01-16T20:45:00.000+05:30";
const date = new Date(timestamp);

// Format the date with time zone offset
const formattedDate = date.toLocaleString("en-US", {
  timeZoneName: "short",
});

console.log(formattedDate); 

```




TimeStamp to ISOString;

```js
const timestamp = 1704306028000;
const date = new Date(timestamp);

console.log(date.toISOString());

```

ISOString to TimeStamp;
```js
const today = new Date(); // Current date and time
const todayTimestamp = today.getTime(); // Timestamp in milliseconds

console.log(todayTimestamp);

```

> [!IMPORTANT]
> Google Calendar uses TimeStamps 1704306028000
> The value 1704306028000 represents the number of milliseconds since the Unix Epoch (January 1, 1970, UTC). You can convert this timestamp to a human-readable date using JavaScript.



### Difference between Locale and Timezone

A locale is a set of parameters that defines the user's language, region, and cultural preferences. It includes information such as language, country, currency, date and time formats, and other regional settings.

A timezone is a region of the Earth that has the same standard time. It is determined by the longitudinal position of the location and can be expressed as an offset from Coordinated Universal Time (UTC).

the locale is more about language and cultural preferences affecting the presentation of information, the timezone is critical for handling time-related calculations





### Requirements

Here is a Google Calendar Video from frontend Enginner

- [Video](https://www.youtube.com/watch?v=leo1FZ6vu1I)
- [Diagram](https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Calendar.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D19n3i6lMGn0HjDy8MRIAn4BTJNjBcd9vd%26export%3Ddownload)




### Networking 
 
- HTTP1 
- HTTP2
- GraphQL
- Pulling/Long, Polling/REST API
- Web Sockets
- SSE - Server Side Events


<details>
  <summary>Here is how Rise Events looks Like</summary>

  ```json 
  {
    "starts_at": "2024-01-20T08:30:00Z",
    "ends_at": "2024-01-20T09:00:00Z",
    "date_starts_at": null,
    "date_ends_at": null,
    "uuid": "3d6d87b8-1fb7-433d-b9db-3ff0e4237fe3",
    "event_type": "default",
    "title": "lkadsf",
    "description": null,
    "location": null,
    "all_day": false,
    "influences_availability": null,
    "attendees": [],
    "calendar_uuid": "1346d25a-1add-4b12-b194-5ca1017aa57f",
    "conference_solution_uuid": null,
    "recurrence": null,
    "autopilot_enabled": false,
    "autopilot_flex_window": null,
    "remote_color_id": null,
    "visibility": null,
    "timezone_start": null,
    "timezone_end": null
    }
  ```
</details>

<details>
    <summary>get all events preview </summary>

    ```json
    [
        {
            "uuid": "7523fed7-629e-4141-91fc-375a8e1152f6",
            "title": "Full moon 11:24pm",
            "description": null,
            "starts_at": null,
            "ends_at": null,
            "date_starts_at": "2024-01-25",
            "date_ends_at": "2024-01-26",
            "location": null,
            "status": "confirmed",
            "all_day": true,
            "is_follower": false,
            "out_of_office": false,
            "organizer_email": "ht3jlfaac5lfd6263ulfh4tql8@group.calendar.google.com",
            "organizer_name": "Phases of the Moon",
            "read_only": true,
            "can_invite_others": true,
            "influences_availability": true,
            "autopilot_enabled": false,
            "autopilot_skip_suggestion": false,
            "created_at": "2024-01-19T08:47:20.403Z",
            "updated_at": "2024-01-19T08:47:20.403Z",
            "is_focus_block": false,
            "visibility": "public",
            "eligibilities": {
                "autopilot": false
            },
            "calendar_uuid": "93159597-5428-491f-98d4-ea1b3b201a3b",
            "is_organizer": false,
            "is_creator": true,
            "attendees": [],
            "conference_solution_uuid": null,
            "conference_data": {},
            "remote_color_id": null,
            "fingerprint": "852abf6c5aa0822bbc99593141e205887867ccc1",
            "flexible_move": null,
            "flexible_move_indicator": null,
            "html_link": "https://www.google.com/calendar/event?eid=bW9vbnBoYXNlKzE3MDYyMDUyNDAwMDAgaHQzamxmYWFjNWxmZDYyNjN1bGZoNHRxbDhAZw&ctz=Etc/UTC",
            "event_type": "default"
        },
        {
            "uuid": "0d47ba9a-5caa-4083-a34a-1b3963fdf0e1",
            "title": "Last quarter 4:48am",
            "description": null,
            "starts_at": null,
            "ends_at": null,
            "date_starts_at": "2024-02-03",
            "date_ends_at": "2024-02-04",
            "location": null,
            "status": "confirmed",
            "all_day": true,
            "is_follower": false,
            "out_of_office": false,
            "organizer_email": "ht3jlfaac5lfd6263ulfh4tql8@group.calendar.google.com",
            "organizer_name": "Phases of the Moon",
            "read_only": true,
            "can_invite_others": true,
            "influences_availability": true,
            "autopilot_enabled": false,
            "autopilot_skip_suggestion": false,
            "created_at": "2024-01-19T08:47:20.599Z",
            "updated_at": "2024-01-19T08:47:20.599Z",
            "is_focus_block": false,
            "visibility": "public",
            "eligibilities": {
                "autopilot": false
            },
            "calendar_uuid": "93159597-5428-491f-98d4-ea1b3b201a3b",
            "is_organizer": false,
            "is_creator": true,
            "attendees": [],
            "conference_solution_uuid": null,
            "conference_data": {},
            "remote_color_id": null,
            "fingerprint": "bed0a84fbc8f8ae13ad53b29f7a01df10a8ba763",
            "flexible_move": null,
            "flexible_move_indicator": null,
            "html_link": "https://www.google.com/calendar/event?eid=bW9vbnBoYXNlKzE3MDY5MTU4ODAwMDAgaHQzamxmYWFjNWxmZDYyNjN1bGZoNHRxbDhAZw&ctz=Etc/UTC",
            "event_type": "default"
        },
        {
            "uuid": "6ed27058-473f-4d9d-b33b-a89bdbc6ecbb",
            "title": "Hazarat Ali's Birthday",
            "description": "Observance\nTo hide observances, go to Google Calendar Settings > Holidays in India",
            "starts_at": null,
            "ends_at": null,
            "date_starts_at": "2024-01-25",
            "date_ends_at": "2024-01-26",
            "location": null,
            "status": "confirmed",
            "all_day": true,
            "is_follower": false,
            "out_of_office": false,
            "organizer_email": "en.indian#holiday@group.v.calendar.google.com",
            "organizer_name": "Holidays in India",
            "read_only": true,
            "can_invite_others": true,
            "influences_availability": false,
            "autopilot_enabled": false,
            "autopilot_skip_suggestion": false,
            "created_at": "2024-01-19T08:47:20.607Z",
            "updated_at": "2024-01-19T08:47:20.607Z",
            "is_focus_block": false,
            "visibility": "public",
            "eligibilities": {
                "autopilot": false
            },
            "calendar_uuid": "86d10419-3c07-4ba9-9ae3-80d4f47be328",
            "is_organizer": false,
            "is_creator": true,
            "attendees": [],
            "conference_solution_uuid": null,
            "conference_data": {},
            "remote_color_id": null,
            "fingerprint": "4c8c031ecf24a4eac57413ff673e806d978deda4",
            "flexible_move": null,
            "flexible_move_indicator": null,
            "html_link": "https://www.google.com/calendar/event?eid=MjAyNDAxMjVfZ3EzdXRiZWk2NzZvZ2ExdWQ4M3AyMzBhZ2sgZW4uaW5kaWFuI2hvbGlkYXlAdg&ctz=Etc/UTC",
            "event_type": "default"
        },
        {
            "uuid": "42a49832-6fab-4c42-a9af-08ed43eea41d",
            "title": "Republic Day",
            "description": "Public holiday",
            "starts_at": null,
            "ends_at": null,
            "date_starts_at": "2024-01-26",
            "date_ends_at": "2024-01-27",
            "location": null,
            "status": "confirmed",
            "all_day": true,
            "is_follower": false,
            "out_of_office": false,
            "organizer_email": "en.indian#holiday@group.v.calendar.google.com",
            "organizer_name": "Holidays in India",
            "read_only": true,
            "can_invite_others": true,
            "influences_availability": false,
            "autopilot_enabled": false,
            "autopilot_skip_suggestion": false,
            "created_at": "2024-01-19T08:47:20.640Z",
            "updated_at": "2024-01-19T08:47:20.640Z",
            "is_focus_block": false,
            "visibility": "public",
            "eligibilities": {
                "autopilot": false
            },
            "calendar_uuid": "86d10419-3c07-4ba9-9ae3-80d4f47be328",
            "is_organizer": false,
            "is_creator": true,
            "attendees": [],
            "conference_solution_uuid": null,
            "conference_data": {},
            "remote_color_id": null,
            "fingerprint": "49955ad9cbd6868ee715288d1cb237543e4158b8",
            "flexible_move": null,
            "flexible_move_indicator": null,
            "html_link": "https://www.google.com/calendar/event?eid=MjAyNDAxMjZfYjRoMG8xdW12Z25nY2diOHM5cjkxZmdmanMgZW4uaW5kaWFuI2hvbGlkYXlAdg&ctz=Etc/UTC",
            "event_type": "default"
        }
    ]

    ```
</details>


- Amie uses Graphql

<details>
    <summary>Graphql get request to get all Events</summary>

    ```json
{
    "query": "query EventsList($startAt: String!, $endAt: String!, $accountCalendars: [AccountCalendar!]!, $includeRecurrentParents: Boolean = false) {\n  eventsList(\n    where: {startAt: $startAt, endAt: $endAt, accountCalendars: $accountCalendars, includeRecurrentParents: $includeRecurrentParents}\n  ) {\n    calendars {\n      id\n      accessRole\n      __typename\n    }\n    events {\n      ...EventV2Fragment\n      __typename\n    }\n    __typename\n  }\n}\nfragment EventV2Fragment on CalendarEvent {\n  attendees {\n    avatar\n    displayName\n    firstName\n    id\n    lastName\n    RSVP: RSVPV2\n    email\n    organizer\n    responseStatus\n    __typename\n  }\n  associatedTodoId\n  calendarId\n  accountEmail\n  description\n  title\n  id\n  compoundId\n  createdAt\n  creator {\n    id\n    email\n    self\n    __typename\n  }\n  doneAt\n  doneBy\n  location\n  videoConferences {\n    link\n    provider\n    __typename\n  }\n  colorFamily\n  rsvp: rsvpV2\n  canEdit\n  isSelfAsAttendee\n  guestsCanModify\n  guestsCanInviteOthers\n  eventType\n  recurringEventId\n  recurrenceRules\n  startAt\n  endAt\n  startDate\n  endDate\n  linkedTodoIds\n  updatedAt: updated\n  status\n  reminderOverrides {\n    minutes\n    type\n    __typename\n  }\n  visibility\n  transparency\n  meetingResources {\n    id\n    type\n    status\n    details {\n      name\n      email\n      floor\n      building\n      capacity\n      __typename\n    }\n    __typename\n  }\n}",
    "operationName": "EventsList",
    "variables": {
        "startAt": "2024-01-17T00:00:00.000+05:30",
        "endAt": "2024-01-24T00:00:00.000+05:30",
        "accountCalendars": [
            {
                "calendarId": "sharma.pratik2016@gmail.com",
                "accountEmail": "sharma.pratik2016@gmail.com"
            }
        ],
        "includeRecurrentParents": true
    }
}
```

</details>

<details>
    <summary>Payload Preview</summary>

    ```json
    {
        "data": {
            "eventsList": {
                "calendars": [
                    {
                        "id": "sharma.pratik2016@gmail.com",
                        "accessRole": "owner",
                        "__typename": "CalendarRole"
                    }
                ],
                "events": [
                    {
                        "attendees": [
                            {
                                "avatar": null,
                                "displayName": null,
                                "firstName": null,
                                "id": "7vu0g0t9s660p717g1b1vs4mdf-attendee-karaleswapnil019@gmail.com",
                                "lastName": null,
                                "RSVP": "YES",
                                "email": "",
                                "organizer": true,
                                "responseStatus": "accepted",
                                "__typename": "CalendarEventAttendee"
                            },
                            {
                                "avatar": null,
                                "displayName": null,
                                "firstName": null,
                                "id": "7vu0g0t9s660p717g1b1vs4mdf-attendee-abhinavchoudhury.0490@gmail.com",
                                "lastName": null,
                                "RSVP": "UNKNOWN",
                                "email": "",
                                "organizer": false,
                                "responseStatus": "needsAction",
                                "__typename": "CalendarEventAttendee"
                            },
                            {
                                "avatar": "https://lh3.googleusercontent.com/a/ACg8ocKPx3-8HuctJPyEb6sPg-X1q7TleiblS0UjkCRndAcpQ-A=s256",
                                "displayName": "Pratik Sharma",
                                "firstName": "Pratik",
                                "id": "7vu0g0t9s660p717g1b1vs4mdf-attendee-sharma.pratik2016@gmail.com",
                                "lastName": "Sharma",
                                "RSVP": "YES",
                                "email": "",
                                "organizer": false,
                                "responseStatus": "accepted",
                                "__typename": "CalendarEventAttendee"
                            }
                        ],
                        "associatedTodoId": null,
                        "calendarId": "sharma.pratik2016@gmail.com",
                        "accountEmail": "sharma.pratik2016@gmail.com",
                        "description": null,
                        "title": "Drooid: Pratik Interview Fullstack Devloper",
                        "id": "7vu0g0t9s660p717g1b1vs4mdf",
                        "compoundId": "7vu0g0t9s660p717g1b1vs4mdf:sharma.pratik2016@gmail.com",
                        "createdAt": "2024-01-17T14:56:39.000Z",
                        "creator": {
                            "id": null,
                            "email": "karaleswapnil019@gmail.com",
                            "self": null,
                            "__typename": "EventCreator"
                        },
                        "doneAt": null,
                        "doneBy": null,
                        "location": null,
                        "videoConferences": [
                            {
                                "link": "https://meet.google.com/emq-pywq-mag",
                                "provider": "GOOGLE_MEET",
                                "__typename": "CalendarEventVideoConference"
                            }
                        ],
                        "colorFamily": null,
                        "rsvp": "YES",
                        "canEdit": false,
                        "isSelfAsAttendee": true,
                        "guestsCanModify": true,
                        "guestsCanInviteOthers": true,
                        "eventType": "default",
                        "recurringEventId": null,
                        "recurrenceRules": null,
                        "startAt": "2024-01-18T08:30:00.000Z",
                        "endAt": "2024-01-18T09:30:00.000Z",
                        "startDate": null,
                        "endDate": null,
                        "linkedTodoIds": [],
                        "updatedAt": "2024-01-17T15:07:42.229Z",
                        "status": "confirmed",
                        "reminderOverrides": null,
                        "visibility": "DEFAULT",
                        "transparency": "opaque",
                        "meetingResources": [],
                        "__typename": "CalendarEvent"
                    },
                    {
                        "attendees": [],
                        "associatedTodoId": null,
                        "calendarId": "sharma.pratik2016@gmail.com",
                        "accountEmail": "sharma.pratik2016@gmail.com",
                        "description": null,
                        "title": "Lunch",
                        "id": "f3a168e56497d379079c0b8b86910c3f8364ce5b5bec0ba403d021647036eba5",
                        "compoundId": "f3a168e56497d379079c0b8b86910c3f8364ce5b5bec0ba403d021647036eba5:sharma.pratik2016@gmail.com",
                        "createdAt": "2024-01-19T15:04:09.000Z",
                        "creator": {
                            "id": null,
                            "email": "sharma.pratik2016@gmail.com",
                            "self": true,
                            "__typename": "EventCreator"
                        },
                        "doneAt": null,
                        "doneBy": null,
                        "location": null,
                        "videoConferences": [],
                        "colorFamily": null,
                        "rsvp": "NOT_INVITED",
                        "canEdit": true,
                        "isSelfAsAttendee": false,
                        "guestsCanModify": true,
                        "guestsCanInviteOthers": true,
                        "eventType": "default",
                        "recurringEventId": null,
                        "recurrenceRules": null,
                        "startAt": "2024-01-19T13:45:00.000Z",
                        "endAt": "2024-01-19T16:30:00.000Z",
                        "startDate": null,
                        "endDate": null,
                        "linkedTodoIds": [],
                        "updatedAt": "2024-01-19T18:07:59.865Z",
                        "status": "confirmed",
                        "reminderOverrides": null,
                        "visibility": "DEFAULT",
                        "transparency": "opaque",
                        "meetingResources": [],
                        "__typename": "CalendarEvent"
                    },
        
                    {
                        "attendees": [],
                        "associatedTodoId": null,
                        "calendarId": "sharma.pratik2016@gmail.com",
                        "accountEmail": "sharma.pratik2016@gmail.com",
                        "description": null,
                        "title": "Work on Calendar",
                        "id": "972c225e6d384a7e9e9e8310514bac08",
                        "compoundId": "972c225e6d384a7e9e9e8310514bac08:sharma.pratik2016@gmail.com",
                        "createdAt": "2024-01-19T22:45:16.000Z",
                        "creator": {
                            "id": null,
                            "email": "sharma.pratik2016@gmail.com",
                            "self": true,
                            "__typename": "EventCreator"
                        },
                        "doneAt": null,
                        "doneBy": null,
                        "location": null,
                        "videoConferences": [],
                        "colorFamily": null,
                        "rsvp": "NOT_INVITED",
                        "canEdit": true,
                        "isSelfAsAttendee": false,
                        "guestsCanModify": true,
                        "guestsCanInviteOthers": true,
                        "eventType": "default",
                        "recurringEventId": null,
                        "recurrenceRules": null,
                        "startAt": "2024-01-20T10:00:00.000Z",
                        "endAt": "2024-01-20T13:30:00.000Z",
                        "startDate": null,
                        "endDate": null,
                        "linkedTodoIds": [],
                        "updatedAt": "2024-01-20T13:11:38.247Z",
                        "status": "confirmed",
                        "reminderOverrides": null,
                        "visibility": "DEFAULT",
                        "transparency": "opaque",
                        "meetingResources": [],
                        "__typename": "CalendarEvent"
                    },
                
                ],
                "__typename": "EventsListResponse"
            }
        }
    }
    ```

</details>

- Cron or Notion Calendar
  

<details>
    <summary> create Event Payload </summary>

    ```json
    {
    "mutation": {
        "provider": "google",
        "accountId": "63f2654a-a8f7-47cb-a090-0661a8027169",
        "calendarId": "sharma.pratik2016@gmail.com",
        "eventData": {
            "id": "ec6cf855d5c04153aec17b468a8fe81e",
            "provider": "google",
            "creator": {
                "email": "sharma.pratik2016@gmail.com",
                "displayName": "sharma.pratik2016@gmail.com",
                "self": true
            },
            "end": {
                "dateTime": "2024-01-23T21:30:00+05:30",
                "timeZone": "Asia/Kolkata"
            },
            "etag": "",
            "extendedProperties": {},
            "guestsCanInviteOthers": true,
            "guestsCanModify": true,
            "guestsCanSeeOtherGuests": true,
            "iCalUID": "",
            "organizer": {
                "email": "sharma.pratik2016@gmail.com",
                "displayName": "Pratik Sharma",
                "self": true
            },
            "reminders": {
                "useDefault": true
            },
            "start": {
                "dateTime": "2024-01-23T19:30:00+05:30",
                "timeZone": "Asia/Kolkata"
            },
            "summary": "new event",
            "transparency": "opaque",
            "visibility": "default",
            "accountId": "63f2654a-a8f7-47cb-a090-0661a8027169",
            "calendarId": "sharma.pratik2016@gmail.com",
            "responseStatus": "accepted"
            }
        }
    }
    ```
</details>


### Performace/Optimization







### References:
Create Event - https://rauno.me/craft/adaptive-precision