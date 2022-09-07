import { Plugin } from "obsidian";
import { commands } from "../default_settings";
import { OptionsModal } from "../modal/OptionsModal";

// This adds a simple command that can be triggered anywhere
export function registerCommand(plugin: Plugin) {
  optionsModalCommand(plugin);
}

function optionsModalCommand(plugin: Plugin) {
  const { id, name } = commands.optionsModal;
  plugin.addCommand({
    id,
    name,
    callback: () => {
      new OptionsModal(plugin.app).open();
    },
  });
}
