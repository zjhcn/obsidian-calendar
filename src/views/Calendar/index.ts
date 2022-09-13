import { Menu, TextFileView, WorkspaceLeaf, View, TFile } from "obsidian";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import { createApp, App } from "vue";
import CalendarComp from "../../vue/components/Calendar/index.vue";
import { registerDirectives } from "src/vue/directives";
import { pinia, useSettingStore } from "src/vue/store";
import { formatEvents } from "src/utils";
import { data } from "src/vue/components/Calendar/data";
import { CalendarInfo } from "src/default_options";
import { CalendarOptions } from "src/obsidian_vue.type";
import { extensions } from "src/default_settings";
import { t } from "src/lang/helpers";
import CalendarPlugin from "src/main";
import { CalendarData } from "./data";

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
  setViewData(data: string, clear: boolean) {
    app.workspace.onLayoutReady(async () => {
      this.compatibilityMode = extensions.includes(this.file.extension);
    });
    let parseData = {} as CalendarOptions;
    try {
    } catch (error) {
      console.error(error);
    }
    this.calendarData.loadData(data, this.file);
    this.init();
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
      leaf: this.leaf,
      save: (payload: any) => {
        this.data = JSON.stringify(payload);
        this.requestSave();
      },
      mounted: (calendar: Calendar) => {
        this.calendar = calendar;
        this.renderCalendar();
      },
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

  renderCalendar() {
    if (!this.calendar) {
      return;
    }
    const settingStore = useSettingStore();
    const options = settingStore.getOptions({});
    settingStore.setCalendarInstance(this.leaf.view, this.calendar, {});

    this.calendar.clear();
    this.calendar.setOptions(options);
    this.calendar.setTheme(options.theme);
    this.calendar.setCalendars(options.calendars as CalendarInfo[]);
    this.calendar.createEvents(formatEvents(data));
    console.log(this.calendar);
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
