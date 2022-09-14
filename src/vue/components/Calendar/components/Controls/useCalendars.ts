import Calendar from "@toast-ui/calendar";
import { useSettingStore } from "src/vue/store";
import { computed, ref, Ref, watch } from "vue";
import diff from "microdiff";
import { CalendarInfo } from "src/default_options";
import { CalendarMapOptions } from "src/vue/store/settings";

export function useCalendars(calendar: Ref<Calendar | null>) {
  const store = useSettingStore();
  const options = computed(() => {
    if (!calendar.value) {
      return {} as Required<CalendarMapOptions>;
    }
    return store.getOptionsByInstance(calendar.value);
  });
  const calendars = ref<CalendarInfo[] | null>(null);
  watch(
    options,
    (value) => {
      if (!value.calendars) {
        return;
      }
      calendars.value = value.calendars;
    },
    {
      immediate: true,
    }
  );

  const isSelectAll = computed({
    get() {
      if (!calendars.value) {
        return false;
      }
      return calendars.value.every((c) => {
        if (typeof c === "string") {
          return true;
        }
        return c.isVisible;
      });
    },
    set(bool: boolean) {
      if (!calendars.value) {
        return false;
      }
      calendars.value = calendars.value.map((c) => {
        if (typeof c === "string") {
          return c;
        }

        return {
          ...c,
          isVisible: bool,
        };
      });
    },
  });

  const isIndeterminate = computed(() => {
    if (!calendars.value) {
      return false;
    }
    const isVisibleList = calendars.value.filter((c) => c.isVisible);
    return !isSelectAll.value && isVisibleList.length > 0;
  });

  function onChange(calendar: CalendarInfo) {
    calendars.value = calendars.value!.map((c) => {
      if (typeof c === "string") {
        return c;
      }

      let isVisible = c.isVisible;
      if (calendar.id === c.id) {
        isVisible = !calendar.isVisible;
      }

      return {
        ...c,
        isVisible,
      };
    });
  }

  watch(calendars, (newObj, obj) => {
    if (obj === null) {
      return;
    }
    if (newObj === null) {
      return;
    }
    const changes = diff(obj, newObj);
    changes.forEach((change) => {
      if (change.type !== "CHANGE") {
        return;
      }
      const [i, key] = change.path;
      const calendarInfo = newObj[i as number];
      if (key === "isVisible") {
        calendar.value!.setCalendarVisibility(
          calendarInfo.id,
          !!calendarInfo.isVisible
        );
      }
    });
  });

  return {
    calendars,
    isIndeterminate,
    isSelectAll,
    onChange,
  };
}
