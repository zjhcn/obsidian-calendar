import { sections } from "./data";

const defaultCalendar = "DEFAULT_CALENDAR";

const events: any[] = [];
let activeCalendar = defaultCalendar;
let activeEvent: any = {
  title: "",
  body: "",
  start: 0,
  calendarName: activeCalendar,
  end: null,
  category: "time",
};

sections.forEach((section) => {
  if (section.type === "yaml") {
    return;
  }
});

function parseHeading(heading: string) {
  return {
    level: 0,
    title: "",
  };
}
