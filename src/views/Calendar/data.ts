import { EventObject } from "@toast-ui/calendar";
import { App, TFile } from "obsidian";
import CalendarPlugin from "src/main";

export class CalendarData {
  events: EventObject[] = [];
  constructor(public plugin: CalendarPlugin, public app: App = plugin.app) {}

  async loadData(data: string, file: TFile) {
    const cache = this.app.metadataCache.getFileCache(file);
    const sections = cache?.sections?.map((s) => {
      return {
        ...s,
        content: data.slice(s.position.start.offset, s.position.end.offset),
      };
    });
    console.log({
      content: data,
      file,
      cache,
      sections,
    });

    let activeCalendar = new Map<string, any>();
  }
}
