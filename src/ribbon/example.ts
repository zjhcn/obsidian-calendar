import { Menu, Notice, Plugin } from "obsidian";
import { APP_NAME } from "src/default_settings";

// This creates an icon in the left ribbon.
export function exampleRibbon(plugin: Plugin) {
  plugin.addRibbonIcon("dice", APP_NAME, (event) => {
    const menu = new Menu();

    menu.addItem((item) =>
      item
        .setTitle("Copy")
        .setIcon("documents")
        .onClick(() => {
          new Notice("Copied");
        })
    );

    menu.addItem((item) =>
      item
        .setTitle("Paste")
        .setIcon("paste")
        .onClick(() => {
          new Notice("Pasted");
        })
    );

    menu.showAtMouseEvent(event);
  });
}
