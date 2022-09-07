import { App, Modal, Setting } from "obsidian";
import { Options } from "@toast-ui/calendar";
import { useObsidianStore, useSettingStore } from "src/vue/store";
import {
  createDetails,
  createDropdown,
  createSetting,
  createText,
  createToggle,
} from "src/setting/components";
import { t } from "src/lang/helpers";
import { deepClone, getEventFilterFn, set } from "src/utils";
import diff from "microdiff";
import { CalendarOptions } from "src/vue/store/settings";

export class OptionsModal extends Modal {
  openOptions: any = null;

  constructor(app: App) {
    super(app);
  }

  onOpen() {
    this.modalEl.addClass("calendar-options-modal");
    const { titleEl } = this;
    titleEl.setText(t("Options"));
    const { settings } = useSettingStore();
    this.openOptions = deepClone(settings);
    this.uiOptions();
  }

  onClose() {
    console.log("onClose");
    const { contentEl } = this;
    contentEl.empty();
    const { settings } = useSettingStore();
    if (!this.openOptions) {
      return;
    }
    this.rerender(this.openOptions, settings);
    this.openOptions = null;
  }

  rerender(obj: any, newObj: any) {
    const changes = diff(obj, newObj);
    if (changes.length === 0) {
      return;
    }
    const settings: CalendarOptions = {
      view: null as any,
      options: null as any,
      template: null as any,
      eventFilter: null as any,
    };

    changes.forEach((change) => {
      switch (change.type) {
        case "CHANGE":
          set(settings, change.path.join("."), change.value);
          break;

        default:
          break;
      }
    });

    const { rerender } = useSettingStore();
    if (settings.eventFilter) {
      set(
        settings,
        "options.eventFilter",
        getEventFilterFn(settings.eventFilter)
      );
    }
    rerender(settings);
  }

  uiOptions() {
    const { contentEl } = this;
    const { settings, save } = useSettingStore();
    const { content: container } = createDetails(contentEl, "Options");

    createDropdown(
      container,
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
      }
    );

    createToggle(
      container,
      {
        name: t("isReadOnly"),
        desc: t("Whether the entire calendar is read-only"),
      },
      settings.options.isReadOnly,
      (value) => {
        settings.options.isReadOnly = value;
        save();
      }
    );

    createText(
      container,
      {
        name: t("eventFilter"),
        // desc: t("Event filter function across calendars"),
        desc: createFragment((frag) => {
          frag.appendText(t("Event filter function across calendars") + "  ");
          frag.createEl(
            "a",
            {
              text: "event",
              href: "https://nhn.github.io/tui.calendar/latest/EventObject",
            },
            (a) => {
              a.setAttr("target", "_blank");
            }
          );
        }),
      },
      settings.eventFilter,
      (value) => {
        settings.eventFilter = value;
        save();
      }
    );
  }
}
