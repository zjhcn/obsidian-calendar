<template>
    <div class="calendar-container" ref="container">
    </div>
    <div class="calendar-preview-popup" ref="popupRef"></div>
</template>

<script setup lang="ts">
import Calendar, { Options } from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import { MarkdownRenderer } from "obsidian";
import { WorkspaceLeaf } from "obsidian";
import { formatEvents } from "src/utils";
import { onBeforeUnmount } from "vue";
import { onMounted, ref } from "vue";
import { PropType } from "vue-demi";

import { useSettingStore } from "../../store/settings";
import { CalendarInfo } from "../../../default_options";

const { leaf, mounted, options, template, eventFilter, calendars } = defineProps({
    leaf: {
        type: Object as PropType<WorkspaceLeaf>,
        required: true,
    },
    mounted: Function as PropType<(calendar: Calendar) => void>,
    options: Object as PropType<Options>,
    template: Object as PropType<Record<string, string>>,
    eventFilter: String,
    calendars: Array as PropType<CalendarInfo[]>,
});
const popupRef = ref<Element | null>(null);

const settingStore = useSettingStore();
const container = ref<Element | null>(null);
const calendarRef = ref<Calendar | null>(null);

onMounted(() => {
    const { options: finalOptions, template: finalTemplate } = settingStore.getOptions({
        options,
        template,
        eventFilter,
        calendars,
    });

    if (!container.value) {
        return;
    }
    const calendar = (calendarRef.value = new Calendar(container.value, finalOptions));
    mounted && mounted(calendarRef.value as Calendar);

    settingStore.setCalendarInstance(
        leaf.view,
        calendar,
        {
            view: finalOptions.defaultView as any,
            options: finalOptions,
            template: finalTemplate,
            eventFilter: eventFilter as any,
            calendars: calendars as any
        });
    calendar.createEvents(formatEvents([
        {
            id: "event0",
            calendarId: "cal2",
            title: "Weekly meeting",
            start: "2022-09-06",
            end: "2022-09-06",
        },
        {
            id: "event1",
            calendarId: "cal2",
            title: "Weekly meeting",
            start: "2022-09-06 19:00:00",
            end: "2022-09-06 22:00:00",
        },
        {
            id: "event2",
            calendarId: "cal1",
            title: "Lunch appointment",
            body: `
## Test

sdasfffffffffffffsjalhgjkashdlfa


fdsafdsafa
`,
            start: "2022-09-08 22:00:00",
            end: "2022-09-08 23:00:00",
        },
        {
            id: "event3",
            calendarId: "cal2",
            title: "Vacation",
            start: "2022-09-08",
            end: "2022-09-10",
            isAllday: true,
            category: "allday",
        },
        {
            id: "milestone",
            calendarId: "cal2",
            title: "milestone",
            start: "2022-09-08",
            end: "2022-09-10",
            category: "milestone",
        },
        {
            id: "allday2",
            calendarId: "cal2",
            title: "allday",
            start: "2022-09-08",
            end: "2022-09-10",
            category: "allday",
        },
        {
            id: "allday3",
            calendarId: "cal2",
            title: "allday",
            start: "2022-09-08",
            end: "2022-09-10",
            category: "allday",
        },
        {
            id: "allday4",
            calendarId: "cal2",
            title: "allday",
            start: "2022-09-08",
            end: "2022-09-10",
            category: "allday",
        },
        {
            id: "task",
            calendarId: "cal2",
            title: "task",
            start: "2022-09-08",
            end: "2022-09-10",
            category: "task",
        },
        {
            id: "time",
            calendarId: "cal2",
            title: "time",
            start: "2022-09-08",
            end: "2022-09-10",
            category: "time",
        },
    ]));

    calendar.on('clickDayName', (event) => {
        if (calendar.getViewName() === 'week') {
            const dateToMove = new Date(event.date);

            calendar.setDate(dateToMove);
            calendar.changeView('day');
        }
    });

    calendar.on('beforeUpdateEvent', function ({ event, changes }) {
        const { id, calendarId } = event;

        console.log(event);
        console.log(changes);
        calendar.updateEvent(id, calendarId, changes);
    });

    calendar.on('beforeCreateEvent', function (info) {
        console.log('beforeCreateEvent', info);
    });
    calendar.on('beforeUpdateEvent', function (info) {
        console.log('beforeUpdateEvent', info);
    });
    calendar.on('beforeDeleteEvent', function (info) {
        console.log('beforeDeleteEvent', info);
    });
    calendar.on('selectDateTime', function (info) {
        console.log('selectDateTime', info, calendar);

        setTimeout(() => {
            calendar.clearGridSelections();
            // info.gridSelectionElements.forEach(el => el?.remove());
        }, 1000);
    });

    calendar.on('clickEvent', function (info) {
        console.log('clickEvent', info, popupRef.value);
        popupRef.value?.empty();
        MarkdownRenderer.renderMarkdown(
            info.event.body,
            popupRef.value as any,
            "test/test.md",
            leaf.view
        );
    });

    calendar.on('clickTimezonesCollapseBtn', function (info) {
        console.log('clickTimezonesCollapseBtn', info);
    });

});

onBeforeUnmount(() => {
    console.log("onBeforeUnmount");
});

setTimeout(() => {
    const cl = calendarRef.value;
    if (!cl) {
        return;
    }

    cl.updateEvent("event3", "cal2", {
        start: "2022-09-07",
    });
}, 2000);
</script>

<style lang="scss">
.calendar-container {
    height: 100%;
}
</style>
