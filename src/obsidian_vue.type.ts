import { Options } from "@toast-ui/calendar";
import { duration, Moment, unitOfTime } from "moment";
import { Plugin, Pos, ReferenceCache, SectionCache, TFile } from "obsidian";
import { CalendarInfo } from "./default_options";
import { EventCategory } from "./views/Calendar/Event.class";
import { ThemeProps } from "./views/Calendar/Theme.class";

export type CalendarViewType = "week" | "month" | "day";

export interface CalendarOptions {
  repeatTimes?: number;
  options?: Options;
  eventFilter?: string;
  template?: Record<string, string>;
  calendars?: (string | CalendarInfo)[];
}

export interface ObVueSettings extends Required<Omit<CalendarOptions, "view">> {
  extensions: string[];
  repeatTimes: number;
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

export interface SectionCommentData extends ThemeProps {
  end?: string;
  start?: string;
  /**
   * Repeat Event
   */
  repeat?: boolean | number;
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
  duration?: SectionCommentDataDuration;

  category?: EventCategory;
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

export interface DropdownOption {
  value: string;
  display: string;
}
