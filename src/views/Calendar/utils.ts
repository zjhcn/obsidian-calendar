import Calendar from "@toast-ui/calendar";
import { unitOfTime } from "moment";
import { Loc, parseYaml, SectionCache } from "obsidian";
import { DEFAULT_CALENDARS_COLOR } from "src/default_options";
import {
  CalendarSection,
  SectionCode,
  SectionComment,
  SectionCommentData,
  SectionCommentDataDuration,
  SectionCommentType,
} from "src/obsidian_vue.type";
import { useSettingStore } from "src/vue/store";
import { CalendarInfo } from "./CalendarInfo.class";
import { CalendarEvent, EventCategory } from "./Event.class";

const calendarHeadingLv = 1;
const eventHeadingLv = 2;

export function parseMDToEvents(
  calendar: Calendar,
  content: string,
  sections: CalendarSection[]
) {
  const calendarVisibleMap = new Map<string, boolean>();
  const calendars: (string | CalendarInfo)[] = [];
  let activeCalendar = "";
  let activeEvent: CalendarEvent | null = null;
  const store = useSettingStore();
  const options = store.getOptionsByInstance(calendar);

  function processSections() {
    const events: CalendarEvent[] = [];
    sections.forEach((section) => {
      let sectionContent = get(content, section);
      switch (section.type) {
        case "yaml":
          break; // break yaml

        case "heading":
          section.links?.forEach((link) => {
            if (!link.displayText) {
              return;
            }
            sectionContent = sectionContent.replace(
              link.original,
              link.displayText
            );
          });
          section.embeds?.forEach((link) => {
            if (!link.displayText) {
              return;
            }
            sectionContent = sectionContent.replace(
              link.original,
              link.displayText
            );
          });
          const heading = parseHeading(sectionContent);
          const title = heading.title;

          // Calendar
          if (calendarHeadingLv === heading.level) {
            activeEvent = null;
            activeCalendar = title;
            calendarVisibleMap.set(activeCalendar, heading.isVisible);
            calendars.push(title);
            return;
          }

          // Event
          if (eventHeadingLv === heading.level) {
            activeEvent = new CalendarEvent(
              calendar,
              title,
              activeCalendar,
              heading.category
            );
            activeEvent.addRaw("heading", section);
            activeEvent.start = heading.start;
            activeEvent.end = heading.end;
            events.push(activeEvent);
            return;
          }
          break; // break heading

        case "list":
        case "code":
        case "paragraph":
          activeEvent?.addRaw("body", section);
          break; // break list

        case "comment":
          if (!section.data || !section.data.subject) {
            return;
          }

          const comment = section.data as SectionComment;
          if (comment.subject === "Event") {
            processCommentEvent(comment.data);
          }

          break; // break comment

        default:
          break;
      }
    });

    return events;
  }

  function processCommentEvent(data: SectionCommentData) {
    if (!activeEvent) {
      return;
    }
    if (data.start) {
      activeEvent.setStart(data.start);
    }
    if (data.end) {
      activeEvent.setEnd(data.end);
    }

    if (data.duration) {
      const duration = parseDuration(data.duration);
      if (duration) {
        activeEvent.addEnd(duration.amount, duration.unit);
      }
    }
    activeEvent.repeat = data.repeat;
  }

  const events = processSections();
  const repeatEvents = [...events];
  events.forEach((event) => {
    if (!event.repeat) {
      return;
    }

    const times =
      typeof event.repeat === "boolean" ? options.repeatTimes : event.repeat;
    for (let i = 0; i < times; i++) {
      const cloneEvent = event.clone();
      cloneEvent.addStart(i + 1, "d");
      cloneEvent.addEnd(i + 1, "d");
      repeatEvents.push(cloneEvent);
    }
  });

  return {
    events: repeatEvents,
    calendars: getCalendars(calendars).map((c) => {
      c.isVisible = calendarVisibleMap.get(c.id);
      return c;
    }),
  };
}

export function getCalendars(
  calendars: (string | CalendarInfo)[]
): CalendarInfo[] {
  const len = DEFAULT_CALENDARS_COLOR.length;
  return calendars.map<CalendarInfo>((c, i) => {
    if (typeof c === "string") {
      return {
        id: c,
        name: c,
        backgroundColor: DEFAULT_CALENDARS_COLOR[i % len],
      };
    }

    return c;
  });
}
export function get(content: string, section: SectionCache) {
  return content.slice(
    section.position.start.offset,
    section.position.end.offset
  );
}

const headingTimeReg =
  /(#+) (([^~]{1}[^\[]*)|(~~[^\[]*~~)) ?((\[(.*)~(.*)\])|(\[(.*)\]))?(.*)/;
function parseHeading(heading: string) {
  const ret = {
    level: 0,
    title: "",
    start: null as any,
    end: null as any,
    category: "time" as EventCategory,
    isVisible: true,
  };

  // EventObj
  const hasTimeMatches = headingTimeReg.exec(heading);
  if (hasTimeMatches) {
    let [
      // raw === heading
      raw,
      // # or ## or ### or #### or ##### or ######
      level,
      // Title or ~~Title~~
      titleMatches,
      // Title or undefined (when has ~~~~)
      title,
      // ~~Title~~ or undefined (when no ~~~~)
      hideTitle,
      // [1970-01-01~1970-12-01] or [1970-01-01]
      time,
      // [1970-01-01~1970-12-01] or undefined (when match singleMatches)
      rangeMatches,
      // 1970-01-01 or undefined (when match singleMatches)
      rangeStart,
      // 1970-12-01 or undefined (when match singleMatches)
      rangeEnd,
      // [1970-01-01] or undefined (when match rangeMatches)
      singleMatches,
      // 1970-01-01 or undefined (when match rangeMatches)
      singleStart,
      // milestone, task, allday, time, undefined
      category,
    ] = hasTimeMatches;
    ret.level = level.length;
    ret.title = (title || hideTitle.replace(/~~/g, ""))?.trim();
    ret.isVisible = !!title;
    ret.start = rangeStart?.trim() || singleStart?.trim();
    ret.end = rangeEnd?.trim();
    ret.category = (category?.trim() as EventCategory) || ret.category;
    return ret;
  }

  return ret;
}

const codeReg = /```(.*)\n((.|\s)*)\n```/;
export function parseCode(code: string): SectionCode {
  const matches = codeReg.exec(code);
  if (!matches) {
    return {
      lang: null as any,
      data: null as any,
      raw: code,
    };
  }

  const [
    // raw === code
    raw,
    // json or yaml or other
    lang,
    // JSON string or YAML string or other
    codeStr,
  ] = matches;
  let data = null;

  if (lang.toUpperCase() === "JSON") {
    try {
      data = JSON.parse(codeStr);
    } catch (error) {
      console.error(error);
    }
  }
  if (lang.toUpperCase() === "YAML" || lang.toUpperCase() === "YML") {
    try {
      data = parseYaml(codeStr.replace(/^---/, "").replace(/---$/, ""));
    } catch (error) {
      console.error(error);
    }
  }

  return {
    raw,
    lang,
    data,
  };
}

const commentReg = /%%(.*)\n(.|\s)+%%/;
export function parseComment(comment: string): SectionComment {
  const matches = commentReg.exec(comment);
  if (!matches) {
    return {
      raw: comment,
      subject: null as any,
    };
  }

  const [
    // raw === code
    raw,
    // json or yaml or other
    subject,
  ] = matches;

  const ret = {
    raw,
    subject: subject as SectionCommentType,
  };

  const codeParsed = parseCode(comment);
  if (!codeParsed.lang) {
    return ret;
  }

  return {
    ...codeParsed,
    ...ret,
  };
}

const durationReg = /^((\d+) ?(.*))$/;
function parseDuration(duration: SectionCommentDataDuration) {
  const matches = durationReg.exec(duration);
  if (!matches) return null;

  const [
    // raw === duration
    raw,
    // origin === duration
    origin,
    // number
    amount,
    // years, y, quarters, Q, d, days, ...
    unit = "d",
  ] = matches;

  return {
    amount: Number(amount),
    unit: unit as unitOfTime.Base,
  };
}
