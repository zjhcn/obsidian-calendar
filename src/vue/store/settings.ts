import { Options } from "@toast-ui/calendar";
import { defineStore } from "pinia";
import Calendar from "@toast-ui/calendar";
import {
  CalendarInfo,
  DEFAULT_THEME,
  DEFAULT_TIME_ZONE,
  getCalendarName,
} from "src/default_options";
import { toRaw } from "vue";
import { CalendarOptions, ObVueSettings } from "../../obsidian_vue.type";
import { useObsidianStore } from ".";
import { View } from "obsidian";
import { TitleNode } from "./toastui";
import { getEventFilterFn } from "src/utils";
import { getCalendars } from "src/views/Calendar/utils";

export interface FileItem {
  options: Partial<CalendarOptions>;
  calendar: Calendar;
}

export interface CalendarMapOptions extends Omit<CalendarOptions, "calendars"> {
  calendars?: CalendarInfo[] | null;
}

export type SettingState = {
  defaultSetting: ObVueSettings;
  calendarMap: Map<Calendar, CalendarMapOptions>;
};

export const useSettingStore = defineStore("settings", {
  state: () =>
    ({
      defaultSetting: null as any,
      calendarMap: new Map<Calendar, CalendarOptions>(),
    } as SettingState),

  getters: {
    settings(): Required<CalendarOptions> {
      return {
        ...this.defaultSetting,
        calendars: this.defaultSetting.calendars.map((s, i) =>
          getCalendarName(i)
        ),
      };
    },
  },

  actions: {
    reset(settings: Partial<ObVueSettings>) {
      this.defaultSetting = settings as any;
    },
    getTimezone(
      options: Partial<CalendarOptions> = {} as any
    ): typeof DEFAULT_TIME_ZONE {
      return DEFAULT_TIME_ZONE;
    },
    getOptionsByInstance(calendar: Calendar): Required<CalendarMapOptions> {
      if (!this.calendarMap.has(calendar)) {
        return {
          ...this.defaultSetting,
          calendars: null,
        };
      }
      return {
        ...this.defaultSetting,
        ...this.calendarMap.get(calendar),
      } as Required<CalendarMapOptions>;
    },
    getOptions(options: Partial<CalendarOptions> = {} as any) {
      const template = Object.assign(
        {},
        toRaw(this.settings.template),
        options.template
      );
      const templateFn: any = {};
      for (const key in template) {
        if (Object.prototype.hasOwnProperty.call(template, key)) {
          const str = template[key];
          switch (key) {
            case "taskTitle":
            case "milestoneTitle":
            case "alldayTitle":
              templateFn[key] = () => TitleNode(str);
              break;
            case "timegridDisplayPrimaryTime":
            case "timegridDisplayTime":
            case "timegridNowIndicatorLabel":
              templateFn[key] = (props: any) =>
                moment(props.time.toDate()).format(str);
              break;

            default:
              break;
          }
        }
      }
      const ret = Object.assign(
        {},
        toRaw(this.settings.options),
        options.options
      ) as Options;
      ret.calendars = getCalendars(
        options.calendars ? options.calendars : this.settings.calendars
      );
      ret.template = templateFn;
      ret.theme = DEFAULT_THEME;
      ret.timezone = this.getTimezone(options);
      ret.eventFilter = getEventFilterFn(this.settings.eventFilter);

      return ret;
    },
    setCalendarInstance(calendar: Calendar, options: CalendarMapOptions) {
      this.calendarMap.set(calendar, options);
    }, // end setCalendarInstance

    rerender({ options }: CalendarOptions) {
      this.calendarMap.forEach((item, calendar) => {
        if (options) {
          calendar.setOptions(options);
        }
      });
    },

    save() {
      const { plugin } = useObsidianStore();
      plugin.saveSettings();
    },
  },
});
