import Calendar, { TZDate } from "@toast-ui/calendar";
import { unitOfTime } from "moment";
import { CalendarSection } from "src/obsidian_vue.type";

export declare type DateType = Date | string | number | TZDate;
export declare type EventCategory = "milestone" | "task" | "allday" | "time";
export declare type EventState = "Busy" | "Free";

let uid = 0;

const id = () => `calendar_event_${uid++}`;

export class CalendarEvent {
  /**
   * Calendar instance
   */
  readonly calendar: Calendar;
  /**
   * `Optional` unique id for various use
   */
  readonly id: string;
  /**
   * Calendar ID
   */
  calendarId: string;
  /**
   * Title for the event
   */
  title: string;
  /**
   * When the event starts
   */
  start?: TZDate;
  /**
   * When the event ends
   */
  end?: TZDate;
  /**
   * Location of the event
   */
  location?: string;
  /**
   * Attendees of the event
   */
  attendees?: string[];
  /**
   * Category of the event (milestone, task, allday, time)
   */
  category: EventCategory;
  /**
   * State of the event. The default is 'Busy'
   */
  state?: EventState;
  /**
   * Determine whether the event is shown or hidden
   */
  isVisible: boolean = true;
  /**
   * Text color of the event element
   */
  color?: string;
  /**
   * Background color of the event element
   */
  backgroundColor?: string;
  /**
   * Background color of the dragging event element
   */
  dragBackgroundColor?: string;
  /**
   * Left border color of the event element
   */
  borderColor?: string;
  /**
   * Custom style for the event element
   */
  customStyle?: Record<string, string>;
  /**
   * Raw data for the event
   */
  raw: {
    heading: CalendarSection;
    body: CalendarSection[];
    comment: CalendarSection[];
  };
  /**
   * Repeat Event
   */
  repeat?: boolean | number;

  constructor(
    calendar: Calendar,
    title: string,
    calendarId: string,
    category: EventCategory = "time"
  ) {
    this.id = id();
    this.title = title;
    this.calendarId = calendarId;
    this.category = category;
    this.raw = {} as any;
    this.calendar = calendar;
  }

  get isAllday() {
    return this.category === "allday";
  }

  set isAllDay(bool: boolean) {
    this.category = "allday";
  }

  private _isReadOnly: boolean = false;
  /**
   * Determine whether the event is read-only
   */
  get isReadOnly(): boolean {
    const view = this.calendar.getViewName();
    if (view === "month") {
      return this._isReadOnly;
    }

    // view === week or day
    return this.category !== "time" || this._isReadOnly;
  }

  set isReadOnly(bool: boolean) {
    this._isReadOnly = bool;
  }

  /**
   * Body for the event
   */
  get body() {
    if (!this.raw.body) {
      return null;
    }

    return this.raw.body.map((c) => c.content).join("\n");
  }

  setStart(start: DateType) {
    this.start = new TZDate(start);
  }

  setEnd(end: DateType) {
    this.end = new TZDate(end);
  }

  addStart(amount: number, unit: unitOfTime.Base) {
    if (!this.start) {
      this.start = new TZDate();
    }
    this.start = this.addDate(this.start, amount, unit);
  }

  addEnd(amount: number, unit: unitOfTime.Base) {
    if (!this.end) {
      this.end = new TZDate(this.start);
    }
    this.end = this.addDate(this.end, amount, unit);
  }

  addRaw(type: "heading" | "body" | "comment", section: CalendarSection) {
    const { raw } = this;

    if (type === "heading") {
      raw.heading = section;
      return this;
    }

    // body or comment
    if (!raw[type]) {
      raw[type] = [];
    }
    raw[type].push(section);
  }

  clone() {
    const event = new CalendarEvent(
      this.calendar,
      this.title,
      this.calendarId,
      this.category
    );
    Object.assign(event, this);
    Object.assign(event.raw, this.raw);
    return event;
  }

  addDate(date: TZDate, amount: number, unit: unitOfTime.Base) {
    const tzDate = new TZDate(date);
    switch (unit) {
      case "years":
      case "y":
        tzDate.addFullYear(amount);
        break;

      case "months":
      case "M":
        tzDate.addMonth(amount);
        break;

      case "weeks":
      case "w":
        tzDate.addDate(7 * amount);
        break;

      case "days":
      case "d":
        tzDate.addDate(amount);
        break;

      case "hours":
      case "h":
        tzDate.addHours(amount);
        break;

      case "minutes":
      case "m":
        tzDate.addMinutes(amount);
        break;

      case "seconds":
      case "s":
        tzDate.addSeconds(amount);
        break;

      case "milliseconds":
      case "ms":
        tzDate.addMilliseconds(amount);
        break;

      default:
        break;
    } // end switch

    return tzDate;
  } // end addDate
}
