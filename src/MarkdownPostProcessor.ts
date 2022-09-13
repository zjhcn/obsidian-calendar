import {
  MarkdownPostProcessorContext,
  MetadataCache,
  TFile,
  Vault,
} from "obsidian";
import CalendarPlugin from "./main";

let plugin: CalendarPlugin;
let vault: Vault;
let metadataCache: MetadataCache;

export const initializeMarkdownPostProcessor = (p: CalendarPlugin) => {
  plugin = p;
  vault = p.app.vault;
  metadataCache = p.app.metadataCache;
};

/**
 *
 * @param el
 * @param ctx
 */
export const markdownPostProcessor = async (
  el: HTMLElement,
  ctx: MarkdownPostProcessorContext
) => {
  //If the file being processed is an excalidraw file,
  //then I want to hide all embedded items as these will be
  //transcluded text element or some other transcluded content inside the Excalidraw file
  //in reading mode these elements should be hidden
  const excalidrawFile = Boolean(
    ctx.frontmatter?.hasOwnProperty("excalidraw-plugin")
  );
  if (excalidrawFile) {
    el.style.display = "none";
    return;
  }

  //   await processReadingMode(embeddedItems, ctx);
};

/**
 * internal-link quick preview
 * @param e
 * @returns
 */
export const hoverEvent = (e: any) => {
  if (!e.linktext) {
    plugin.hover.linkText = null;
    return;
  }
  plugin.hover.linkText = e.linktext;
  plugin.hover.sourcePath = e.sourcePath;
};

//monitoring for div.popover.hover-popover.file-embed.is-loaded to be added to the DOM tree
export const observer = new MutationObserver(async (m) => {
  if (m.length == 0) {
    return;
  }
  if (!plugin.hover.linkText) {
    return;
  }
  const file = metadataCache.getFirstLinkpathDest(
    plugin.hover.linkText,
    plugin.hover.sourcePath ? plugin.hover.sourcePath : ""
  );
  if (!file) {
    return;
  }
  if (!(file instanceof TFile)) {
    return;
  }
  if (file.extension !== "excalidraw") {
    return;
  }
  if (!plugin.hover.linkText) {
    return;
  }
  if (m.length != 1) {
    return;
  }
  if (m[0].addedNodes.length != 1) {
    return;
  }
  if (
    //@ts-ignore
    !m[0].addedNodes[0].classNames !=
    "popover hover-popover file-embed is-loaded"
  ) {
    return;
  }
  const node = m[0].addedNodes[0];
  node.empty();
});
