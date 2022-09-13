import { EventObject } from "@toast-ui/calendar";
import { callExpression } from ".";

export function getEventFilterFn(code: string) {
  return (event: EventObject) =>
    callExpression(`return ${code}`, {
      event,
    });
}
