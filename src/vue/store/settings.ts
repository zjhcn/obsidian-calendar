import { Options } from "@toast-ui/calendar";
import { defineStore } from "pinia";
import Calendar from "@toast-ui/calendar";
import { DEFAULT_THEME } from "src/default_options";
import { OptionsModal } from "../../modal/OptionsModal";
import { toRaw } from "vue";
import { CalendarOptions, ObVueSettings } from "../../obsidian_vue.type";
import { useObsidianStore } from ".";
import { View } from "obsidian";
import { TitleNode } from "./toastui";
import { callExpression, getEventFilterFn } from "src/utils";

export interface FileItem {
  options: Partial<CalendarOptions>;
  calendar: Calendar;
}

export type SettingState = {
  defaultSetting: ObVueSettings;
  viewMap: Map<View, FileItem>;
};

export const useSettingStore = defineStore("settings", {
  state: () =>
    ({
      defaultSetting: null as any,
      viewMap: new Map<View, FileItem>(),
    } as SettingState),

  getters: {
    settings(): CalendarOptions {
      return {
        view: this.defaultSetting.options.defaultView,
        ...this.defaultSetting,
      };
    },
  },

  actions: {
    reset(settings: Partial<ObVueSettings>) {
      this.defaultSetting = settings as any;
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
      ret.calendars = toRaw(
        options.calendars ? options.calendars : this.settings.calendars
      );
      ret.template = templateFn;
      ret.theme = DEFAULT_THEME;
      ret.eventFilter = getEventFilterFn(this.settings.eventFilter);

      return ret;
    },
    setCalendarInstance(
      view: View,
      calendar: Calendar,
      options: Partial<CalendarOptions>
    ) {
      this.viewMap.set(view, {
        calendar,
        options,
      });
    }, // end setCalendarInstance

    rerender({ options, view }: CalendarOptions) {
      console.log("options", options, this.viewMap);
      this.viewMap.forEach((item) => {
        if (options) {
          item.calendar.setOptions(options);
        }

        if (view) {
          item.calendar.changeView(view);
        }
      });
    },

    save() {
      const { plugin } = useObsidianStore();
      plugin.saveSettings();
    },
  },
});
