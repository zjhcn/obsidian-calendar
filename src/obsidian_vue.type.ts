import { Options } from "@toast-ui/calendar";
import { Plugin, Pos, ReferenceCache, SectionCache, TFile } from "obsidian";
import { CalendarInfo } from "./default_options";

export type CalendarOptions = {
  view?: "week" | "month" | "day";
  options: Options;
  eventFilter: string;
  template: Record<string, string>;
  calendars: (string | CalendarInfo)[];
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

export type SectionCacheType =
  | "yaml"
  | "heading"
  | "list"
  | "paragraph"
  | "code"
  | "comment";

export interface CalendarReferenceCache extends ReferenceCache {
  file: TFile;
  isEmbed?: boolean;
}

export interface SectionCode {
  raw: string;
  lang?: string;
  data?: any;
}

export interface SectionComment extends SectionCode {
  subject?: string;
}

export interface CalendarSection extends SectionCache {
  content: string;
  /** defined in (yaml, code, comment) */
  data?: any;
  links?: Set<CalendarReferenceCache>;
  embeds?: Set<CalendarReferenceCache>;
}
