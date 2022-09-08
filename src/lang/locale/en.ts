// English

export default {
  ".": ".",
  ":": ":",
  Default: "Default",
  // SettingManager.ts
  "Settings for Calendar plugin.": "Settings for Calendar plugin.",
  // Options.ts
  "Type: boolean": "Type: boolean",
  "Type: expression": "Type: expression",
  "Type: number": "Type: number",
  "Type: boolean | ('allday' | 'time')[]":
    "Type: boolean | ('allday' | 'time')[]",
  "Type: [string, string, string, string, string, string, string]":
    "Type: [string, string, string, string, string, string, string]",

  Options: "Options",
  Common: "Common",
  defaultView: "defaultView",
  "Default view type": "Default view type.",
  week: "week",
  month: "month",
  day: "day",
  isReadOnly: "isReadOnly",
  "Whether the entire calendar is read-only":
    "Whether the entire calendar is read-only.",
  Document: "Document",
  eventFilter: "eventFilter",
  "About event": "About event",
  "Event filter function across calendars":
    "Event filter function across calendars.",
  gridSelection: "gridSelection",
  "Whether clicks and double-clicks are possible for date/time selection":
    "Whether clicks and double-clicks are possible for date/time selection.",

  startDayOfWeek: "startDayOfWeek",
  "Specifies the start day of the week in the monthly view. The default is 0, starting from Sunday. You can specify a value from 0 (Sunday) to 6 (Saturday).":
    "Specifies the start day of the week in the monthly view. The default is 0, starting from Sunday. You can specify a value from 0 (Sunday) to 6 (Saturday).",
  "Specifies the start day of the week in the daily/weekly view. The default is 0, starting from Sunday. You can specify a value from 0 (Sunday) to 6 (Saturday).":
    "Specifies the start day of the week in the daily/weekly view. The default is 0, starting from Sunday. You can specify a value from 0 (Sunday) to 6 (Saturday).",
  dayNames: "dayNames",
  'Separator ",". like: "sun, mon, tue, wed, thu, fri, sat"':
    'Separator ",". like: "sun, mon, tue, wed, thu, fri, sat"',
  narrowWeekend: "narrowWeekend",
  "In the daily/weekly view, the width of the weekend can be narrowed (1/2 of the existing width). The default value is false. In order to narrow the width of the weekend, set it to true.":
    "In the daily/weekly view, the width of the weekend can be narrowed (1/2 of the existing width). The default value is false. In order to narrow the width of the weekend, set it to true.",
  "You can narrow the width of weekends (1/2 of the existing width) in the monthly view. The default value is false, and to narrow the width of the weekend, set it to true.":
    "You can narrow the width of weekends (1/2 of the existing width) in the monthly view. The default value is false, and to narrow the width of the weekend, set it to true.",
  workweek: "workweek",
  "Weekends can be excluded from the daily/weekly view. The default value is false, and to exclude weekends, set it to true.":
    "Weekends can be excluded from the daily/weekly view. The default value is false, and to exclude weekends, set it to true.",
  showNowIndicator: "showNowIndicator",
  "You can specify whether to display the current time indicator in the weekly/daily view. The default value is true, and if you do not want to display the current time indicator, set it to false.":
    "You can specify whether to display the current time indicator in the weekly/daily view. The default value is true, and if you do not want to display the current time indicator, set it to false.",
  showTimezoneCollapseButton: "showTimezoneCollapseButton",
  "When using multiple time zones in the weekly/daily view, you can specify whether to display the button to collapse the sub time zones. The default value is false, and set it to true to display the collapse button.":
    "When using multiple time zones in the weekly/daily view, you can specify whether to display the button to collapse the sub time zones. The default value is false, and set it to true to display the collapse button.",
  timezonesCollapsed: "timezonesCollapsed",
  "When using multiple time zones in the weekly/daily view, you can specify whether to display the sub time zones in a collapsed state. The default value is false, and set it to true to display in the collapsed state.":
    "When using multiple time zones in the weekly/daily view, you can specify whether to display the sub time zones in a collapsed state. The default value is false, and set it to true to display in the collapsed state.",
  hourStart: "hourStart",
  "Specifies the start time of each column in the weekly/daily view. The default value is 0, and you can specify any desired start time.":
    "Specifies the start time of each column in the weekly/daily view. The default value is 0, and you can specify any desired start time.",
  hourEnd: "hourEnd",
  "Specifies the end time of each column in the weekly/daily view. The default value is 24, and you can specify any desired end time.":
    "Specifies the end time of each column in the weekly/daily view. The default value is 24, and you can specify any desired end time.",
  eventView: "eventView",
  "You can specify whether to display the allday panel and the time panel in the weekly/daily view. The default is true, and both the allday panel and the time panel are displayed. If false, both panels are not displayed, and in case of 'allday', only the allday panel is displayed. In case of 'time', only the time panel is displayed.":
    "You can specify whether to display the allday panel and the time panel in the weekly/daily view. The default is true, and both the allday panel and the time panel are displayed. If false, both panels are not displayed, and in case of 'allday', only the allday panel is displayed. In case of 'time', only the time panel is displayed.",

  Month: "Month",
  visibleWeeksCount: "visibleWeeksCount",
  "Specifies the number of weeks shown in the monthly view. The default value is 0, indicating 6 weeks. You can specify a value from 1 to 6 to specify a different number of weeks.":
    "Specifies the number of weeks shown in the monthly view. The default value is 0, indicating 6 weeks. You can specify a value from 1 to 6 to specify a different number of weeks.",
  "⚠️ If you set this option, the current date will always be in the first week.":
    "⚠️ If you set this option, the current date will always be in the first week.",
  isAlways6Weeks: "isAlways6Weeks",
  "Determines whether to always display the calendar every six weeks in the monthly view. The default value is true, and 6 weeks are displayed regardless of the total number of weeks in the month being displayed.":
    "Determines whether to always display the calendar every six weeks in the monthly view. The default value is true, and 6 weeks are displayed regardless of the total number of weeks in the month being displayed.",
  "If set to false, 4 to 6 weeks are displayed according to the number of displayable weeks in the month.":
    "If set to false, 4 to 6 weeks are displayed according to the number of displayable weeks in the month.",
  "Weekends can be excluded from the monthly view. The default value is false, and to exclude weekends, set it to true.":
    "Weekends can be excluded from the monthly view. The default value is false, and to exclude weekends, set it to true.",
  visibleEventCount: "visibleEventCount",
  "Specifies the maximum number of events displayed for each date in the monthly view. The default is 6.":
    "Specifies the maximum number of events displayed for each date in the monthly view. The default is 6.",
  "Even though you set this option, if the height of the date is insufficient, the option is automatically ignored.":
    "Even though you set this option, if the height of the date is insufficient, the option is automatically ignored.",

  Template: "Template",
  taskTitle: "taskTitle",
  "The left area of the task panel in the weekly/daily view":
    "The left area of the task panel in the weekly/daily view",
  milestoneTitle: "milestoneTitle",
  "The left area of the milestone panel in the weekly/daily view":
    "The left area of the milestone panel in the weekly/daily view",
  alldayTitle: "alldayTitle",
  "The left area of the allday panel in the weekly/daily view":
    "The left area of the allday panel in the weekly/daily view",
  timegridDisplayPrimaryTime: "timegridDisplayPrimaryTime",
  "Hours of primary time zone in weekly/daily view":
    "Hours of primary time zone in weekly/daily view",
  timegridDisplayTime: "timegridDisplayTime",
  "Hours of time zones other than the primary time zone of the weekly/daily view":
    "Hours of time zones other than the primary time zone of the weekly/daily view",
  timegridNowIndicatorLabel: "timegridNowIndicatorLabel",
  "Current time in weekly/daily view": "Current time in weekly/daily view",
  // default_setting.ts
  "Open options modal": "Open options modal",

  // default_options.ts
  sun: "sun",
  mon: "mon",
  tue: "tue",
  wed: "wed",
  thu: "thu",
  fri: "fri",
  sat: "sat",
  Milestone: "Milestone",
  Task: "Task",
  "All Day": "All Day",
  "HH:ss": "HH:ss",
};
