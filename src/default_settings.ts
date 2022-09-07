import {
  DEFAULT_EVENT_FILTER,
  DEFAULT_OPTIONS,
  DEFAULT_TEMPLATE,
  DEFAULT_THEME,
} from "./default_options";
import { t } from "./lang/helpers";
import { ObVueSettings } from "./obsidian_vue.type";

export const APP_NAME = "Calendar";

/** prefix */
const p = (str: string) => `${APP_NAME}:${str}`;

export const commands = {
  optionsModal: {
    id: p("open-options-modal"),
    name: t("Open options modal"),
  },
};

export const DEFAULT_SETTINGS: ObVueSettings = {
  extensions: ["calendar"],
  options: DEFAULT_OPTIONS as any,
  template: DEFAULT_TEMPLATE,
  eventFilter: DEFAULT_EVENT_FILTER,
};
