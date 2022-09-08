import { Options } from "@toast-ui/calendar";
import { Plugin } from "obsidian";
import { CalendarInfo } from "./default_options";

export type CalendarOptions = {
  view?: "week" | "month" | "day";
  options: Options;
  eventFilter: string;
  template: Record<string, string>;
  calendars: CalendarInfo[];
};

export interface ObVueSettings extends CalendarOptions {
  extensions: string[];
  options: Required<Options>;
}

export interface ISetting {
  settings: ObVueSettings;

  loadSettings: () => any;
  saveSettings: () => any;
}

export type ObVuePlugin = Plugin & ISetting;
