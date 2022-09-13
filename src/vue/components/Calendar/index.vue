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
import { Theme } from "src/default_options";
import { formatEvents } from "src/utils";
import { onBeforeUnmount } from "vue";
import { onMounted, ref } from "vue";
import { PropType } from "vue-demi";

const { leaf, mounted, options, theme, save } = defineProps({
    leaf: {
        type: Object as PropType<WorkspaceLeaf>,
        required: true,
    },
    mounted: Function as PropType<(calendar: Calendar) => void>,
    save: Function as PropType<(payload: any) => void>,
    options: Object as PropType<Options>,
    theme: Object as PropType<Theme>,
});
const popupRef = ref<Element | null>(null);

const container = ref<Element | null>(null);
const calendarRef = ref<Calendar | null>(null);

onMounted(() => {
    if (!container.value) {
        return;
    }
    const calendar = (calendarRef.value = new Calendar(container.value, options));
    mounted && mounted(calendarRef.value as Calendar);

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
        save && save(info);

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
    calendarRef.value?.destroy();
});
</script>

<style lang="scss">
.calendar-container {
    height: 100%;
}
</style>
