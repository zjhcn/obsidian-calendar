<template>
    <div class="calendar-container" @mousemove.ctrl="onMousemove" ref="container">
    </div>
</template>

<script setup lang="ts">
import Calendar, { Options } from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import { debounce, Plugin, TFile } from "obsidian";
import { WorkspaceLeaf } from "obsidian";
import { Theme } from "src/default_options";
import { VIEW_TYPE_CALENDAR } from "src/views/Calendar";
import { CalendarEvent } from "src/views/Calendar/event";
import { useSettingStore } from "src/vue/store";
import { onBeforeUnmount } from "vue";
import { onMounted, ref } from "vue";
import { PropType } from "vue-demi";

const { plugin, leaf, mounted, options, file, save } = defineProps({
    plugin: {
        type: Object as PropType<Plugin>,
        required: true,
    },
    leaf: {
        type: Object as PropType<WorkspaceLeaf>,
        required: true,
    },
    mounted: Function as PropType<(calendar: Calendar) => void>,
    save: Function as PropType<(payload: any) => void>,
    options: Object as PropType<Options>,
    theme: Object as PropType<Theme>,
    file: {
        required: true,
        type: Object as PropType<TFile>,
    }
});

const container = ref<Element | null>(null);
const calendarRef = ref<Calendar | null>(null);

onMounted(() => {
    if (!container.value) {
        return;
    }
    const store = useSettingStore();
    let processedOptions: Options = options as any;
    if (!options) {
        processedOptions = {};
    }
    processedOptions.timezone = store.getTimezone();
    const calendar = (calendarRef.value = new Calendar(container.value, processedOptions));
    mounted && mounted(calendarRef.value as Calendar);

    calendar.on('clickDayName', (event) => {
        if (calendar.getViewName() === 'week') {
            const dateToMove = new Date(event.date);

            calendar.setDate(dateToMove);
            calendar.changeView('day');
        }
    });

    calendar.on('selectDateTime', function (info) {
        console.log('selectDateTime', info, calendar);
        save && save(info);

        setTimeout(() => {
            calendar.clearGridSelections();
            // info.gridSelectionElements.forEach(el => el?.remove());
        }, 1000);
    });

    calendar.on('clickEvent', async function (info) {
        const { event, nativeEvent } = info;
        console.log('clickEvent', info);
        console.log("file.path", file.path);

    });
});

onBeforeUnmount(() => {
    calendarRef.value?.destroy();
});

let lockMousemove = 0;
const onMousemove = debounce<any, any>(function onMousemove(event: MouseEvent) {
    let parentElement: HTMLElement | null = event.target as HTMLElement;
    let dataset: Record<"eventId" | "calendarId", string> = null as any;
    lockMousemove++;
    const currentLock = lockMousemove;
    while (parentElement) {
        if (currentLock !== lockMousemove) {
            return;
        }
        if (parentElement.dataset.eventId) {
            dataset = parentElement.dataset as any;
            break;
        }
        parentElement = parentElement.parentElement;
    }

    if (!dataset) return;

    const info = calendarRef.value?.getEvent(dataset.eventId, dataset.calendarId) as CalendarEvent;
    const { body, heading } = info.raw;
    if (!body) return;

    let linktext = heading.content.replace(/^#* /, "#");
    plugin.app.workspace.trigger("hover-link", {
        event,
        source: VIEW_TYPE_CALENDAR,
        hoverParent: container.value,
        targetEl: event.target || container.value, //null //0.15.0 hover editor!!
        linktext,
        sourcePath: file.path,
    });
}, 200, true);
</script>

<style lang="scss">
.calendar-container {
    height: 100%;
}
</style>
