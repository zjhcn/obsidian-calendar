import { Options } from "@toast-ui/calendar";
import { t } from "./lang/helpers";

export const dayNames: [
  string,
  string,
  string,
  string,
  string,
  string,
  string
] = [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")];

export const DEFAULT_EVENT_FILTER = "!!event.isVisible";

export const DEFAULT_OPTIONS: Required<Options> = {
  // Disable GA
  usageStatistics: false,
  useFormPopup: false,
  useDetailPopup: false,

  defaultView: "week",
  isReadOnly: false,

  week: {
    startDayOfWeek: 1,
    dayNames,
    narrowWeekend: false,
    workweek: false,
    showNowIndicator: true,
    showTimezoneCollapseButton: false,
    timezonesCollapsed: false,
    hourStart: 0,
    hourEnd: 24,
    eventView: true,
    taskView: true,
    collapseDuplicateEvents: false,
  },
  month: {
    dayNames,
    visibleWeeksCount: 0,
    workweek: false,
    narrowWeekend: false,
    startDayOfWeek: 0,
    isAlways6Weeks: true,
    visibleEventCount: 6,
  },

  gridSelection: false,
  timezone: {
    zones: [
      {
        timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    ],
  },
} as any;

export const DEFAULT_TEMPLATE = {
  taskTitle: t("Task"),
  milestoneTitle: t("Milestone"),
  alldayTitle: t("All Day"),
  // 时间轴时间
  timegridDisplayPrimaryTime: t("HH:ss"),
  timegridDisplayTime: t("HH:ss"),
  timegridNowIndicatorLabel: t("HH:ss"),
}; // end of template

export const weekTheme = {
  dayName: {
    borderLeft: "var(--week-day-name-border-left)",
    borderTop: "var(--week-day-name-border-top)",
    borderBottom: "var(--week-day-name-border-bottom)",
    backgroundColor: "var(--week-day-name-background-color)",
  },
  dayGrid: {
    borderRight: "var(--week-day-grid-border-right)",
    backgroundColor: "inherit",
  },
  dayGridLeft: {
    borderRight: "var(--week-day-grid-left-border-right)",
    backgroundColor: "var(--week-day-grid-left-background-color)",
    width: "var(--week-day-grid-left-width)",
  },
  timeGrid: { borderRight: "var(--week-time-grid-border-right)" },
  timeGridLeft: {
    backgroundColor: "var(--week-time-grid-left-background-color)",
    borderRight: "var(--week-time-grid-left-border-right)",
    width: "var(--week-time-grid-left-width)",
  },
  timeGridLeftAdditionalTimezone: {
    backgroundColor:
      "var(--week-time-grid-left-additional-time-zone-background-color)",
  },
  timeGridHalfHourLine: {
    borderBottom: "var(--week-time-grid-hour-line-border-bottom)",
  },
  timeGridHourLine: {
    borderBottom: "var(--week-time-grid-half-hour-line-border-bottom)",
  },
  nowIndicatorLabel: { color: "var(--week-now-indicator-label-color)" },
  nowIndicatorPast: { border: "var(--week-now-indicator-past-border)" },
  nowIndicatorBullet: {
    backgroundColor: "var(--week-now-indicator-bullet-background-color)",
  },
  nowIndicatorToday: { border: "var(--week-now-indicator-today-border)" },
  nowIndicatorFuture: { border: "var(--week-now-indicator-future-border)" },
  pastTime: { color: "var(--week-past-time-color)" },
  futureTime: { color: "var(--week-future-time-color)" },
  weekend: { backgroundColor: "var(--week-weekend-background-color)" },
  today: {
    color: "var(--week-today-color)",
    backgroundColor: "var(--week-today-background-color)",
  },
  pastDay: { color: "var(--week-past-day-color)" },
  panelResizer: { border: "var(--week-panel-resizer-border)" },
  gridSelection: {
    backgroundColor: "var(--week-grid-selection-background-color)",
    border: "var(--week-grid-selection-border)",
  } as any,
}; // end of week

export const monthTheme = {
  dayExceptThisMonth: { color: "var(--month-day-except-this-month-color)" },
  dayName: {
    borderLeft: "var(--month-day-name-border-left)",
    backgroundColor: "var(--month-day-name-background-color)",
  },
  holidayExceptThisMonth: {
    color: "var(--month-holiday-except-this-month-color)",
  },
  moreView: {
    border: "var(--month-more-view-border)",
    boxShadow: "var(--month-more-view-box-shadow)",
    backgroundColor: "var(--month-more-view-background-color)",
    width: "var(--month-more-view-width)",
    height: "var(--month-more-view-height)",
  },
  moreViewTitle: {
    backgroundColor: "var(--month-more-view-title-background-color)",
  },
  gridCell: {
    // headerHeight: "var(--month-grid-cell-header-height)",
    // footerHeight: "var(--month-grid-cell-height-height)",
  },
  weekend: { backgroundColor: "var(--month-weekend-background-color)" },
}; // end of month

export const commonTheme = {
  backgroundColor: "var(--common-background-color)",
  border: "var(--common-border)",
  gridSelection: {
    backgroundColor: "var(--common-grid-selection-background-color)",
    border: "var(--common-grid-selection-border)",
  },
  dayName: {
    color: "var(--common-day-name-color)",
  },
  holiday: {
    color: "var(--common-holiday-color)",
  },
  saturday: {
    color: "var(--common-saturday-color)",
  },
  today: {
    color: "var(--common-today-color)",
  },
}; // end of common

export type WeekTheme = Partial<typeof weekTheme>;
export type MonthTheme = Partial<typeof monthTheme>;
export type CommonTheme = Partial<typeof commonTheme>;
export type Theme = {
  week?: WeekTheme;
  month?: MonthTheme;
  common?: CommonTheme;
};

export const DEFAULT_THEME = {
  week: weekTheme,
  month: monthTheme,
  common: commonTheme,
}; // end of theme

export type CalendarInfo = {
  id: string;
  name: string;
  color?: string;
  backgroundColor?: string;
  dragBackgroundColor?: string;
  borderColor?: string;
};

export const getCalendarName = (i: number) => `${t("Calendar")}${i}`;
export const DEFAULT_CALENDARS_COLOR: string[] = [
  "#00a9ff",
  "#03bd9e",
  "#bbdc00",
  "#db473f",
  "#9e5fff",
];
