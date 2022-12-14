import {
  Menu,
  TextFileView,
  WorkspaceLeaf,
  View,
  TFile,
  getLinkpath,
  parseLinktext,
} from "obsidian";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import { createApp, App } from "vue";
import CalendarComp from "../../vue/components/Calendar/index.vue";
import { registerDirectives } from "src/vue/directives";
import { pinia, useSettingStore } from "src/vue/store";
import { CalendarInfo } from "src/default_options";
import { extensions } from "src/default_settings";
import { t } from "src/lang/helpers";
import CalendarPlugin from "src/main";
import { CalendarData } from "./Data.class";

export const VIEW_TYPE_CALENDAR = "calendar-view";

export class CalendarView extends TextFileView {
  calendarData: CalendarData;
  vCalendar: App | null = null;
  calendar: Calendar | null = null;
  _loaded: boolean = false;
  compatibilityMode: boolean = false;
  id: string = (this.leaf as any).id;
  plugin: CalendarPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: CalendarPlugin) {
    super(leaf);
    this.plugin = plugin;
    this.calendarData = new CalendarData(plugin);
  }

  getViewData() {
    return this.data;
  }

  // If clear is set, then it means we're opening a completely different file.
  async setViewData(data: string, clear: boolean) {
    app.workspace.onLayoutReady(async () => {
      this.compatibilityMode = extensions.includes(this.file.extension);
      this.init();
    });
  }

  async save(clear?: boolean) {
    super.save(clear);
  }

  init() {
    if (this.vCalendar) {
      this.renderCalendar();
      return;
    }
    this.vCalendar = createApp(CalendarComp, {
      plugin: this.plugin,
      file: this.file,
      leaf: this.leaf,
      save: (payload: any) => {
        // this.data = JSON.stringify(payload);
        // this.requestSave();
      },
      mounted: this.mounted.bind(this),
    });
    registerDirectives(this.vCalendar);
    this.vCalendar.use(pinia);
    this.vCalendar.mount(
      this.contentEl.createDiv({
        attr: {
          style: "height:100%",
        },
      })
    );
  }

  mounted(calendar: Calendar) {
    this.calendar = calendar;
    this.calendarData.loadData(calendar, this.data, this.file);
    this.renderCalendar();
  }

  renderCalendar() {
    if (!this.calendar) {
      return;
    }
    const settingStore = useSettingStore();
    const options = settingStore.getOptions({
      calendars: this.calendarData.calendars,
    });
    settingStore.setCalendarInstance(this.calendar, {
      options,
      calendars: this.calendarData.calendars,
      template: this.calendarData.template,
      eventFilter: this.calendarData.eventFilter,
    });

    this.calendar.clear();
    this.calendar.setOptions(options);
    this.calendar.setTheme(options.theme);
    this.calendar.setCalendars(options.calendars as CalendarInfo[]);
    this.calendar.createEvents(this.calendarData.events);
    setTimeout(() => {
      options.defaultView && this.calendar?.changeView(options.defaultView);
    }, 160);
  }

  clear() {}

  getViewType() {
    return VIEW_TYPE_CALENDAR;
  }

  async onOpen() {}

  onResize() {
    this.calendar?.render();
  }

  async onClose() {
    if (!this.vCalendar) {
      return;
    }
    this.vCalendar.unmount();
    this.vCalendar = null as any;
    this.contentEl.empty();
  }

  onPaneMenu(menu: Menu, source: "more-options" | "tab-header" | string): void {
    if (!this.compatibilityMode) {
      menu.addItem((item) => {
        item
          .setTitle(t("Open as Markdown"))
          .setIcon("document")
          .onClick(() => {
            this.openAsMarkdown();
          })
          .setSection("pane");
      });
    }
    super.onPaneMenu(menu, source);
  }

  public async openAsMarkdown() {
    this.setMarkdownView();
  }

  setMarkdownView() {
    this.plugin.calendarFileModes[this.id || this.file.path] = "markdown";
    this.plugin.setMarkdownView(this.leaf);
  }
}
