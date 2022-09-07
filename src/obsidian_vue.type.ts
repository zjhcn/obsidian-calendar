import { Options } from "@toast-ui/calendar";
import { Plugin } from "obsidian";

export interface ObVueSettings {
  extensions: string[];
  options: Required<Options>;
  eventFilter: string;
  template: Record<string, string>;
}

export interface ISetting {
  settings: ObVueSettings;

  loadSettings: () => any;
  saveSettings: () => any;
}

export type ObVuePlugin = Plugin & ISetting;
