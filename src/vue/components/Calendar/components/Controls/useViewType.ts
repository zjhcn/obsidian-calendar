import Calendar from "@toast-ui/calendar";
import { t } from "src/lang/helpers";
import { CalendarViewType } from "src/obsidian_vue.type";
import { effect, Ref, ref, watch } from "vue";

export function useViewType(calendar: Ref<Calendar | null>) {
  const options = [
    {
      value: "month",
      display: t("Monthly"),
    },
    {
      value: "week",
      display: t("Weekly"),
    },
    {
      value: "day",
      display: t("Daily"),
    },
  ];

  const viewType = ref<CalendarViewType>("week");

  watch(viewType, (viewName) => {
    calendar.value!.changeView(viewName);
  });

  return {
    options,
    viewType,
  };
}
