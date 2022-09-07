import { EventObject } from "@toast-ui/calendar";
import { callExpression } from ".";

export function formatEvents(events: EventObject[]): EventObject[] {
  return events.map((evt: EventObject) => {
    if (evt.category) {
      evt.isReadOnly = true;
    }

    return evt;
  });
}

export function getEventFilterFn(code: string) {
  return (event: EventObject) =>
    callExpression(`return ${code}`, {
      event,
    });
}
