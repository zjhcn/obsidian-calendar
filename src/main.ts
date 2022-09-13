import {
  MarkdownView,
  Plugin,
  TFile,
  ViewState,
  WorkspaceLeaf,
} from "obsidian";
import { App } from "vue";

import { createPiniaApp } from "src/vue";
import { around } from "monkey-around";

import {
  DEFAULT_SETTINGS,
  extensions,
  FRONTMATTER_KEY,
  ICON_NAME,
} from "./default_settings";
import { ISetting, ObVueSettings } from "./obsidian_vue.type";
import { ObVueSettingsTab } from "./setting/Setting";

import { exampleStatusBar } from "./status-bar/example";
import { registerCommand } from "./command";
import { exampleRibbon } from "./ribbon/example";
import { useSettingStore } from "./vue/store";
import { CalendarView, VIEW_TYPE_CALENDAR } from "./views/Calendar";

import "./style/styles.scss";
import { toRaw } from "vue";
import { t } from "./lang/helpers";
import {
  hoverEvent,
  initializeMarkdownPostProcessor,
  markdownPostProcessor,
} from "./MarkdownPostProcessor";

export default class Calendar extends Plugin implements ISetting {
  settingsTab!: ObVueSettingsTab;
  hover: any = {};
  settingsStore!: ReturnType<typeof useSettingStore>;
  public calendarFileModes: { [file: string]: string } = {};
  dummyVueApp!: App;
  basePath!: string;
  private _loaded: boolean = false;

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
      (leaf: WorkspaceLeaf) => new CalendarView(leaf, this)
    );

    this.registerExtensions(this.settings.extensions, VIEW_TYPE_CALENDAR);

    exampleRibbon(this);
    exampleStatusBar(this);

    registerCommand(this);
    this.switchToCalendarAfterLoad();
    this.registerMonkeyPatches();
    this.addMarkdownPostProcessor();

    this.addSettingTab(this.settingsTab);
  }

  onunload() {}

  private addMarkdownPostProcessor() {
    initializeMarkdownPostProcessor(this);
    this.registerMarkdownPostProcessor(markdownPostProcessor);

    // internal-link quick preview
    this.registerEvent(
      this.app.workspace.on("quick-preview", (file: TFile, data: string) => {
        console.log(file);
        console.log("data", data);
      })
    );

    //monitoring for div.popover.hover-popover.file-embed.is-loaded to be added to the DOM tree
    // this.observer = observer;
    // this.observer.observe(document, { childList: true, subtree: true });
  }

  private switchToCalendarAfterLoad() {
    this.app.workspace.onLayoutReady(() => {
      let leaf: WorkspaceLeaf;
      for (leaf of app.workspace.getLeavesOfType("markdown")) {
        if (
          leaf.view instanceof MarkdownView &&
          this.isCalendarFile(leaf.view.file)
        ) {
          this.calendarFileModes[(leaf as any).id || leaf.view.file.path] =
            VIEW_TYPE_CALENDAR;
          this.setCalendarView(leaf);
        }
      }
    });
  }

  private registerMonkeyPatches() {
    this.registerEvent(
      app.workspace.on("editor-menu", (menu, editor, view) => {
        if (!view || !(view instanceof MarkdownView)) return;
        const file = view.file;
        const leaf = view.leaf;
        if (!view.file) return;
        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache?.frontmatter || !cache.frontmatter[FRONTMATTER_KEY]) return;

        menu.addItem((item) =>
          item
            .setTitle(t("Open as Calendar"))
            .setIcon(ICON_NAME)
            .setSection("calendar")
            .onClick(() => {
              //@ts-ignore
              this.calendarFileModes[leaf.id || file.path] = VIEW_TYPE_CALENDAR;
              this.setCalendarView(leaf);
            })
        );
      })
    );

    this.registerEvent(
      app.workspace.on("file-menu", (menu, file, source, leaf) => {
        if (!leaf || !(leaf.view instanceof MarkdownView)) return;
        if (!(file instanceof TFile)) return;
        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache?.frontmatter || !cache.frontmatter[FRONTMATTER_KEY]) return;

        menu.addItem((item) => {
          item
            .setTitle(t("Open as Calendar"))
            .setIcon(ICON_NAME)
            .setSection("pane")
            .onClick(() => {
              //@ts-ignore
              this.calendarFileModes[leaf.id || file.path] = VIEW_TYPE_CALENDAR;
              this.setCalendarView(leaf);
            });
        });
        //@ts-ignore
        menu.items.unshift(menu.items.pop());
      })
    );

    const self = this;
    // I try app.workspace.on("active-leaf-change"), but is not
    // Monkey patch WorkspaceLeaf to open calendar drawings with calendarView by default
    this.register(
      around(WorkspaceLeaf.prototype, {
        // Calendar can be viewed as markdown or calendar, and we keep track of the mode
        // while the file is open. When the file closes, we no longer need to keep track of it.
        detach(next) {
          return function (this: any) {
            const state = this.view?.getState();

            if (state?.file && self.calendarFileModes[this.id || state.file]) {
              delete self.calendarFileModes[this.id || state.file];
            }

            return next.apply(this);
          };
        },

        setViewState(next) {
          return function (this: any, state: ViewState, eState?: any) {
            if (
              // Don't force calendar mode during shutdown
              self._loaded &&
              // If we have a markdown file
              state.type === "markdown" &&
              state.state?.file &&
              // And the current mode of the file is not set to markdown
              self.calendarFileModes[this.id || state.state.file] !== "markdown"
            ) {
              // Then check for the calendar frontMatterKey
              const cache = app.metadataCache.getCache(state.state.file);

              if (cache?.frontmatter && cache.frontmatter[FRONTMATTER_KEY]) {
                // If we have it, force the view type to calendar
                const newState = {
                  ...state,
                  type: VIEW_TYPE_CALENDAR,
                };

                self.calendarFileModes[state.state.file] = VIEW_TYPE_CALENDAR;

                return next.apply(this, [newState, eState]);
              }
            }

            return next.apply(this, [state, eState]);
          };
        },
      })
    );
  }

  private async setCalendarView(leaf: WorkspaceLeaf) {
    await leaf.setViewState({
      type: VIEW_TYPE_CALENDAR,
      state: leaf.view.getState(),
      popstate: true,
    } as ViewState);
  }

  public async setMarkdownView(leaf: WorkspaceLeaf) {
    const state = leaf.view.getState();

    await leaf.setViewState({
      type: VIEW_TYPE_CALENDAR,
      state: { file: null },
    });

    await leaf.setViewState(
      {
        type: "markdown",
        state,
        popstate: true,
      } as ViewState,
      { focus: true }
    );
  }

  public isCalendarFile(f: TFile) {
    if (extensions.includes(f.extension)) {
      return true;
    }
    const fileCache = f ? this.app.metadataCache.getFileCache(f) : null;
    return !!fileCache?.frontmatter && !!fileCache.frontmatter[FRONTMATTER_KEY];
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
