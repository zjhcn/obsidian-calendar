import { Plugin, WorkspaceLeaf } from "obsidian";
import { App } from "vue";

import { createPiniaApp } from "src/vue";

import { DEFAULT_SETTINGS } from "./default_settings";
import { ISetting, ObVueSettings } from "./obsidian_vue.type";
import { ObVueSettingsTab } from "./setting/Setting";

import { exampleStatusBar } from "./status-bar/example";
import { registerCommand } from "./command";
import { exampleRibbon } from "./ribbon/example";
import { useSettingStore } from "./vue/store";
import { CalendarView, VIEW_TYPE_CALENDAR } from "./views/Calendar";

import "./style/styles.scss";
import { toRaw } from "vue";

export default class Calendar extends Plugin implements ISetting {
  settingsTab!: ObVueSettingsTab;
  settingsStore!: ReturnType<typeof useSettingStore>;
  dummyVueApp!: App;
  basePath!: string;

  get settings(): ObVueSettings {
    return toRaw(this.settingsStore.defaultSetting);
  }

  set settings(newSetting: ObVueSettings) {
    this.settingsStore.reset(newSetting);
  }

  async onload() {
    this.dummyVueApp = createPiniaApp(this);
    this.settingsStore = useSettingStore();

    await this.loadSettings();

    this.settingsTab = new ObVueSettingsTab(this, {
      onSettingsChange: async (newSettings) => {
        this.settings = newSettings;
        await this.saveSettings();
      },
    });

    this.registerView(
      VIEW_TYPE_CALENDAR,
      (leaf: WorkspaceLeaf) => new CalendarView(leaf)
    );

    this.registerExtensions(this.settings.extensions, VIEW_TYPE_CALENDAR);

    exampleRibbon(this);
    exampleStatusBar(this);

    registerCommand(this);
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
