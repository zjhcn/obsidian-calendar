import { App, Modal } from "obsidian";
import { useObsidianStore, useSettingStore } from "src/vue/store";
import { t } from "src/lang/helpers";
import { deepClone, getEventFilterFn, set } from "src/utils";
import diff from "microdiff";
import { CalendarOptions } from "src/obsidian_vue.type";
import {
  uiOptionsCommon,
  uiOptionsMonth,
  uiOptionsTemplate,
  uiOptionsWeek,
} from "src/setting/Options";

export class OptionsModal extends Modal {
  openOptions: any = null;

  constructor(app: App) {
    super(app);
  }

  onOpen() {
    this.modalEl.addClass("calendar-options-modal");
    const { titleEl, contentEl } = this;
    titleEl.setText(t("Options"));
    const { settings, save } = useSettingStore();
    this.openOptions = deepClone(settings);
    uiOptionsCommon(contentEl, settings, save);
    uiOptionsWeek(contentEl, settings, save);
    uiOptionsMonth(contentEl, settings, save);
    uiOptionsTemplate(contentEl, settings, save);
  }

  onClose() {
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
      calendars: null as any,
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
}
