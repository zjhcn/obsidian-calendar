import { TextFileView } from "obsidian";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import { createApp, App } from "vue";
import CalendarComp from "../../vue/components/Calendar/index.vue";
import { registerDirectives } from "src/vue/directives";
import { pinia } from "src/vue/store";

export const VIEW_TYPE_CALENDAR = "calendar-view";

export class CalendarView extends TextFileView {
  calendarData!: string[][];
  vCalendar!: App;
  calendar!: Calendar;

  getViewData() {
    return this.calendarData.map((row) => row.join(",")).join("\n");
  }

  // If clear is set, then it means we're opening a completely different file.
  setViewData(data: string, clear: boolean) {
    this.calendarData = data.split("\n").map((line) => line.split(","));

    this.init();
  }

  init() {
    this.vCalendar = createApp(CalendarComp, {
      leaf: this.leaf,
      mounted: (calendar: Calendar) => {
        this.calendar = calendar;
      },
    });
    registerDirectives(this.vCalendar);
    this.vCalendar.use(pinia);
    this.vCalendar.mount(this.contentEl);
  }

  clear() {
    this.calendarData = [];
  }

  getViewType() {
    return VIEW_TYPE_CALENDAR;
  }

  async onOpen() {}

  onResize() {
    this.calendar.render();
  }

  async onClose() {
    this.contentEl.empty();
    console.log("onClose");
  }

  onunload() {
    console.log("onunload");
  }
}
