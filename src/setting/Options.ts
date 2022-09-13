import {
  createDetails,
  createDropdown,
  createLines,
  createLink,
  createSetting,
  createText,
  createToggle,
} from "src/setting/components";
import {
  dayNames,
  DEFAULT_EVENT_FILTER,
  DEFAULT_OPTIONS,
  DEFAULT_TEMPLATE,
} from "src/default_options";
import { t } from "src/lang/helpers";
import { set } from "src/utils";
import { CalendarOptions } from "src/obsidian_vue.type";

export function uiOptionsCommon(
  el: HTMLElement,
  settings: CalendarOptions,
  save: Function
) {
  const { content } = createDetails(el, t("Common"));

  createDropdown(
    content,
    {
      name: t("defaultView"),
      desc: t("Default view type"),
      options: {
        week: t("week"),
        month: t("month"),
        day: t("day"),
      },
    },
    settings.options.defaultView,
    (value) => {
      settings.options.defaultView = value as any;
      save();
    },
    DEFAULT_OPTIONS.defaultView
  );

  createToggle(
    content,
    {
      name: t("isReadOnly"),
      desc: t("Whether the entire calendar is read-only"),
    },
    settings.options.isReadOnly,
    (value) => {
      settings.options.isReadOnly = value;
      save();
    },
    DEFAULT_OPTIONS.isReadOnly
  );

  createText(
    content,
    {
      name: t("eventFilter"),
      tooltip: t("Type: expression"),
      desc: createFragment((frag) => {
        frag.appendText(t("Event filter function across calendars") + "  ");
        createLink(
          frag,
          t("Document"),
          "https://nhn.github.io/tui.calendar/latest/EventObject"
        );
      }),
    },
    settings.eventFilter,
    (value) => {
      settings.eventFilter = value;
      save();
    },
    DEFAULT_EVENT_FILTER
  );

  createToggle(
    content,
    {
      name: t("gridSelection"),
      tooltip: t("Type: boolean"),
      desc: t(
        "Whether clicks and double-clicks are possible for date/time selection"
      ),
    },
    settings.options.gridSelection as boolean,
    (value) => {
      settings.options.gridSelection = value;
      save();
    },
    DEFAULT_OPTIONS.gridSelection
  );
} // uiOptionsCommon

export function uiOptionsWeek(
  el: HTMLElement,
  settings: CalendarOptions,
  save: Function
) {
  const { content } = createDetails(el, "Week");

  createText(
    content,
    {
      name: t("startDayOfWeek"),
      tooltip: t("Type: number"),
      desc: createFragment((frag) => {
        frag.appendText(
          t(
            "Specifies the start day of the week in the daily/weekly view. The default is 0, starting from Sunday. You can specify a value from 0 (Sunday) to 6 (Saturday)."
          )
        );
        createLink(
          frag,
          t("Document"),
          "https://github.com/nhn/tui.calendar/blob/main/docs/en/apis/options.md#weekstartdayofweek"
        );
      }),
    },
    String(settings.options.week?.startDayOfWeek),
    (value) => {
      set(settings, "options.week.startDayOfWeek", Number(value));
      save();
    },
    String(DEFAULT_OPTIONS.week.startDayOfWeek)
  );

  createText(
    content,
    {
      name: t("dayNames"),
      tooltip: t(
        "Type: [string, string, string, string, string, string, string]"
      ),
      desc: createFragment((frag) => {
        frag.appendText(
          t('Separator ",". like: "sun, mon, tue, wed, thu, fri, sat"')
        );
        createLink(
          frag,
          t("Document"),
          "https://github.com/nhn/tui.calendar/blob/main/docs/en/apis/options.md#weekdaynames"
        );
      }),
    },
    settings.options.week?.dayNames?.join(", "),
    (value: string) => {
      set(
        settings,
        "options.week.dayNames",
        value.split(",").map((s) => s.trim())
      );
      save();
    },
    dayNames.join(", ")
  );

  createToggle(
    content,
    {
      name: t("narrowWeekend"),
      tooltip: t("Type: boolean"),
      desc: t(
        "In the daily/weekly view, the width of the weekend can be narrowed (1/2 of the existing width). The default value is false. In order to narrow the width of the weekend, set it to true."
      ),
    },
    settings.options.week?.narrowWeekend as boolean,
    (value) => {
      set(settings, "options.week.narrowWeekend", value);
      save();
    },
    DEFAULT_OPTIONS.week.narrowWeekend
  );
  createToggle(
    content,
    {
      name: t("workweek"),
      tooltip: t("Type: boolean"),
      desc: t(
        "Weekends can be excluded from the daily/weekly view. The default value is false, and to exclude weekends, set it to true."
      ),
    },
    settings.options.week?.workweek as boolean,
    (value) => {
      set(settings, "options.week.workweek", value);
      save();
    },
    DEFAULT_OPTIONS.week.workweek
  );

  createToggle(
    content,
    {
      name: t("showNowIndicator"),
      tooltip: t("Type: boolean"),
      desc: t(
        "You can specify whether to display the current time indicator in the weekly/daily view. The default value is true, and if you do not want to display the current time indicator, set it to false."
      ),
    },
    settings.options.week?.showNowIndicator as boolean,
    (value) => {
      set(settings, "options.week.showNowIndicator", value);
      save();
    },
    DEFAULT_OPTIONS.week.showNowIndicator
  );

  createToggle(
    content,
    {
      name: t("showTimezoneCollapseButton"),
      tooltip: t("Type: boolean"),
      desc: t(
        "You can specify whether to display the current time indicator in the weekly/daily view. The default value is true, and if you do not want to display the current time indicator, set it to false."
      ),
    },
    settings.options.week?.showTimezoneCollapseButton as boolean,
    (value) => {
      set(settings, "options.week.showTimezoneCollapseButton", value);
      save();
    },
    DEFAULT_OPTIONS.week.showTimezoneCollapseButton
  );
  createToggle(
    content,
    {
      name: t("timezonesCollapsed"),
      desc: t(
        "When using multiple time zones in the weekly/daily view, you can specify whether to display the sub time zones in a collapsed state. The default value is false, and set it to true to display in the collapsed state."
      ),
      tooltip: t("Type: boolean"),
    },
    settings.options.week?.timezonesCollapsed as boolean,
    (value) => {
      set(settings, "options.week.timezonesCollapsed", value);
      save();
    },
    DEFAULT_OPTIONS.week.timezonesCollapsed
  );
  createText(
    content,
    {
      name: t("hourStart"),
      desc: t(
        "Specifies the start time of each column in the weekly/daily view. The default value is 0, and you can specify any desired start time."
      ),
      tooltip: t("Type: number"),
    },
    String(settings.options.week?.hourStart),
    (value) => {
      set(settings, "options.week.hourStart", Number(value));
      save();
    },
    String(DEFAULT_OPTIONS.week.hourStart)
  );
  createText(
    content,
    {
      name: t("hourEnd"),
      desc: t(
        "Specifies the end time of each column in the weekly/daily view. The default value is 24, and you can specify any desired end time."
      ),
      tooltip: t("Type: number"),
    },
    String(settings.options.week?.hourEnd),
    (value) => {
      set(settings, "options.week.hourEnd", Number(value));
      save();
    },
    String(DEFAULT_OPTIONS.week.hourEnd)
  );

  createText(
    content,
    {
      name: t("eventView"),
      desc: t(
        "You can specify whether to display the allday panel and the time panel in the weekly/daily view. The default is true, and both the allday panel and the time panel are displayed. If false, both panels are not displayed, and in case of 'allday', only the allday panel is displayed. In case of 'time', only the time panel is displayed."
      ),
      tooltip: t("Type: boolean | ('allday' | 'time')[]"),
    },
    String(settings.options.week?.eventView),
    (value) => {
      let format: any = value === "false" ? false : true;
      if (value === "allday" || value === "time") {
        format = [value];
      }
      set(settings, "options.week.eventView", format);
      save();
    },
    String(
      Array.isArray(DEFAULT_OPTIONS.week.eventView)
        ? DEFAULT_OPTIONS.week.eventView.join(",")
        : DEFAULT_OPTIONS.week.eventView
    )
  );
} // uiOptionsWeek

export function uiOptionsMonth(
  el: HTMLElement,
  settings: CalendarOptions,
  save: Function
) {
  const { content } = createDetails(el, "Month");

  createText(
    content,
    {
      name: t("dayNames"),
      tooltip: t(
        "Type: [string, string, string, string, string, string, string]"
      ),
      desc: createFragment((frag) => {
        frag.appendText(
          t('Separator ",". like: "sun, mon, tue, wed, thu, fri, sat"')
        );
        createLink(
          frag,
          t("Document"),
          "https://github.com/nhn/tui.calendar/blob/main/docs/en/apis/options.md#monthdaynames"
        );
      }),
    },
    settings.options.month?.dayNames?.join(", "),
    (value: string) => {
      set(
        settings,
        "options.month.dayNames",
        value.split(",").map((s) => s.trim())
      );
      save();
    },
    dayNames.join(", ")
  ); // end dayNames

  createText(
    content,
    {
      name: t("startDayOfWeek"),
      tooltip: t("Type: number"),
      desc: createFragment((frag) => {
        frag.appendText(
          t(
            "Specifies the start day of the week in the monthly view. The default is 0, starting from Sunday. You can specify a value from 0 (Sunday) to 6 (Saturday)."
          )
        );
        createLink(
          frag,
          t("Document"),
          "https://github.com/nhn/tui.calendar/blob/main/docs/en/apis/options.md#monthstartdayofweek"
        );
      }),
    },
    String(settings.options.month?.startDayOfWeek),
    (value) => {
      set(settings, "options.week.startDayOfWeek", Number(value));
      save();
    },
    String(DEFAULT_OPTIONS.month.startDayOfWeek)
  ); // end startDayOfWeek

  createToggle(
    content,
    {
      name: t("narrowWeekend"),
      tooltip: t("Type: boolean"),
      desc: t(
        "You can narrow the width of weekends (1/2 of the existing width) in the monthly view. The default value is false, and to narrow the width of the weekend, set it to true."
      ),
    },
    settings.options.month?.narrowWeekend as boolean,
    (value) => {
      set(settings, "options.month.narrowWeekend", value);
      save();
    },
    DEFAULT_OPTIONS.month.narrowWeekend
  ); // end narrowWeekend

  createText(
    content,
    {
      name: t("visibleWeeksCount"),
      desc: t(
        "Specifies the number of weeks shown in the monthly view. The default value is 0, indicating 6 weeks. You can specify a value from 1 to 6 to specify a different number of weeks."
      ),
      tooltip:
        t("Type: number") +
        t(".") +
        t(
          "⚠️ If you set this option, the current date will always be in the first week."
        ),
    },
    String(settings.options.month?.visibleWeeksCount),
    (value) => {
      set(settings, "options.month.visibleWeeksCount", Number(value));
      save();
    },
    String(DEFAULT_OPTIONS.month.visibleWeeksCount)
  ); // visibleWeeksCount

  createToggle(
    content,
    {
      name: t("isAlways6Weeks"),
      tooltip: t("Type: boolean"),
      desc: createLines([
        t(
          "Determines whether to always display the calendar every six weeks in the monthly view. The default value is true, and 6 weeks are displayed regardless of the total number of weeks in the month being displayed."
        ),
        t(
          "If set to false, 4 to 6 weeks are displayed according to the number of displayable weeks in the month."
        ),
      ]),
    },
    settings.options.month?.isAlways6Weeks as boolean,
    (value) => {
      set(settings, "options.month.isAlways6Weeks", value);
      save();
    },
    DEFAULT_OPTIONS.month.isAlways6Weeks
  ); // end narrowWeekend

  createToggle(
    content,
    {
      name: t("workweek"),
      tooltip: t("Type: boolean"),
      desc: t(
        "Weekends can be excluded from the monthly view. The default value is false, and to exclude weekends, set it to true."
      ),
    },
    settings.options.month?.workweek as boolean,
    (value) => {
      set(settings, "options.week.workweek", value);
      save();
    },
    DEFAULT_OPTIONS.month.workweek
  ); // workweek

  createText(
    content,
    {
      name: t("visibleEventCount"),
      desc: createLines([
        t(
          "Specifies the maximum number of events displayed for each date in the monthly view. The default is 6."
        ),
        t(
          "Even though you set this option, if the height of the date is insufficient, the option is automatically ignored."
        ),
      ]),
      tooltip: t("Type: number"),
    },
    String(settings.options.month?.visibleEventCount),
    (value) => {
      set(settings, "options.month.visibleEventCount", Number(value));
      save();
    },
    String(DEFAULT_OPTIONS.month.visibleEventCount)
  ); // visibleEventCount
} // end uiOptionsMonth

export function uiOptionsTemplate(
  el: HTMLElement,
  settings: CalendarOptions,
  save: Function
) {
  const { content } = createDetails(el, t("Template"));

  createText(
    content,
    {
      name: t("taskTitle"),
      tooltip: t("Default") + t(":") + t("Task"),
      desc: t("The left area of the task panel in the weekly/daily view"),
    },
    settings.template?.taskTitle,
    (value: string) => {
      set(settings, "template.taskTitle", value);
      save();
    },
    DEFAULT_TEMPLATE.taskTitle
  ); // end taskTitle

  createText(
    content,
    {
      name: t("milestoneTitle"),
      tooltip: t("Default") + t(":") + t("Milestone"),
      desc: t("The left area of the milestone panel in the weekly/daily view"),
    },
    settings.template?.milestoneTitle,
    (value: string) => {
      set(settings, "template.milestoneTitle", value);
      save();
    },
    DEFAULT_TEMPLATE.milestoneTitle
  ); // end milestoneTitle

  createText(
    content,
    {
      name: t("alldayTitle"),
      tooltip: t("Default") + t(":") + t("All Day"),
      desc: t("The left area of the allday panel in the weekly/daily view"),
    },
    settings.template?.alldayTitle,
    (value: string) => {
      set(settings, "template.alldayTitle", value);
      save();
    },
    DEFAULT_TEMPLATE.alldayTitle
  ); // end milestoneTitle

  createText(
    content,
    {
      name: t("timegridDisplayPrimaryTime"),
      tooltip: t("Default") + t(":") + t("HH:mm"),
      desc: createFragment((frag) => {
        frag.appendText(
          t("Hours of primary time zone in weekly/daily view") + "  "
        );
        createLink(
          frag,
          t("Document"),
          "https://momentjs.com/docs/#/parsing/string-format/"
        );
      }),
    },
    settings.template?.timegridDisplayPrimaryTime,
    (value: string) => {
      set(settings, "template.timegridDisplayPrimaryTime", value);
      save();
    },
    DEFAULT_TEMPLATE.timegridDisplayPrimaryTime
  ); // end timegridDisplayPrimaryTime

  createText(
    content,
    {
      name: t("timegridDisplayTime"),
      tooltip: t("Default") + t(":") + t("HH:mm"),
      desc: createFragment((frag) => {
        frag.appendText(
          t(
            "Hours of time zones other than the primary time zone of the weekly/daily view"
          ) + "  "
        );
        createLink(
          frag,
          t("Document"),
          "https://momentjs.com/docs/#/parsing/string-format/"
        );
      }),
    },
    settings.template?.timegridDisplayTime,
    (value: string) => {
      set(settings, "template.timegridDisplayTime", value);
      save();
    },
    DEFAULT_TEMPLATE.timegridDisplayTime
  ); // end timegridDisplayTime

  createText(
    content,
    {
      name: t("timegridNowIndicatorLabel"),
      tooltip: t("Default") + t(":") + t("HH:mm"),
      desc: createFragment((frag) => {
        frag.appendText(t("Current time in weekly/daily view") + "  ");
        createLink(
          frag,
          t("Document"),
          "https://momentjs.com/docs/#/parsing/string-format/"
        );
      }),
    },
    settings.template?.timegridNowIndicatorLabel,
    (value: string) => {
      set(settings, "template.timegridNowIndicatorLabel", value);
      save();
    },
    DEFAULT_TEMPLATE.timegridNowIndicatorLabel
  ); // end timegridNowIndicatorLabel
} // end uiOptionsTemplate
