import Calendar, { EventObject } from "@toast-ui/calendar";
import {
  App,
  CachedMetadata,
  iterateCacheRefs,
  parseLinktext,
  parseYaml,
  ReferenceCache,
  TFile,
} from "obsidian";
import CalendarPlugin from "src/main";
import {
  CalendarReferenceCache,
  CalendarSection,
  SectionCacheType,
} from "src/obsidian_vue.type";
import { CalendarInfo } from "./calendarInfo";
import { parseCode, parseComment, parseMDToEvents } from "./utils";
import { get } from "./utils";

export class CalendarData {
  events: EventObject[] = [];
  calendars: string[] | CalendarInfo[] = [];
  constructor(public plugin: CalendarPlugin, public app: App = plugin.app) {}

  async loadData(calendar: Calendar, data: string, file: TFile) {
    const cache = this.app.metadataCache.getFileCache(file);
    if (!cache) {
      throw new Error("file cache not find?");
    }

    const parsed = parseMDToEvents(
      calendar,
      data,
      this.normalizationSections(data, cache, file)
    );
    this.events = parsed.events;
    this.calendars = parsed.calendars;
  }

  normalizationSections(
    data: string,
    cache: CachedMetadata,
    file: TFile
  ): CalendarSection[] {
    if (!cache.sections) {
      return [];
    }

    const links = new Map<number, Set<CalendarReferenceCache>>();
    cache.links?.forEach((cache) => this.processLink(cache, file, links));
    const embeds = new Map<number, Set<CalendarReferenceCache>>();
    cache.embeds?.forEach((cache) => this.processLink(cache, file, embeds));

    const calendarSections: CalendarSection[] = [];
    cache.sections.forEach((section) => {
      const calendarSection = section as CalendarSection;
      const content = (calendarSection.content = get(data, section));
      switch (section.type as SectionCacheType) {
        case "yaml":
          calendarSection.data = cache.frontmatter;
          break; // break yaml
        case "list":
        case "paragraph":
        case "heading":
          const line = section.position.start.line;
          calendarSection.links = links.get(line);
          calendarSection.embeds = embeds.get(line);
          break; // break heading
        case "code":
          const codeParsed = parseCode(content);
          calendarSection.data = codeParsed;
          break; // break code
        case "comment":
          const commentParsed = parseComment(content);
          calendarSection.data = commentParsed;
          break; // break code

        default:
          break;
      }

      calendarSections.push(calendarSection);
    });

    return calendarSections;
  }

  processLink(
    cache: ReferenceCache,
    file: TFile,
    processedCaches: Map<number, Set<CalendarReferenceCache>>
  ) {
    const process = cache as CalendarReferenceCache;
    process.file = this.app.metadataCache.getFirstLinkpathDest(
      cache.link,
      file.path
    ) as TFile;
    const line = cache.position.start.line;
    let processed = processedCaches.get(line);
    if (!processed) {
      processedCaches.set(line, (processed = new Set()));
    }
    processed.add(process);
  }
}
