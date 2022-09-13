import { Options } from "@toast-ui/calendar";
import { duration, Moment, unitOfTime } from "moment";
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

export type SectionCommentDataDuration = `${number}${" " | ""}${
  | unitOfTime.Base
  | ""}`;

export interface SectionCommentData {
  end: string;
  start: string;
  /**
   * Moment add
   * @see {@link https://momentjs.com/docs/#/manipulating/add/}
   * @example
   *    - 1 d
   *    - 1d
   *    - 30 m
   *    - 30m
   *    - 30 minutes
   *    - 30minutes
   */
  duration: SectionCommentDataDuration;
}

export interface SectionCode {
  raw: string;
  lang?: string;
  data?: any;
}

export type SectionCommentType = "Event" | "Calendar" | "Options";

export interface SectionComment extends SectionCode {
  subject?: SectionCommentType;
}

export interface CalendarSection extends SectionCache {
  content: string;
  /** defined in (yaml, code, comment) */
  data?: any;
  links?: Set<CalendarReferenceCache>;
  embeds?: Set<CalendarReferenceCache>;
}
