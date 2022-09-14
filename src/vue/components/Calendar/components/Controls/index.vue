<template>
    <div class="calendar-ctrls">
        <details class="calendar-ctrls-details" ref="colorPopupDetailsRef">
            <summary class="calendar-ctrls-summary">
                <i class="calendar-ctrls-summary-icon" v-icon="'calendar-with-checkmark'"></i>
            </summary>

            <div class="calendar-ctrls-color-popup">
                <div class="calendar-ctrls-color">
                    <label class="calendar-ctrls-checkbox">
                        <input type="checkbox" :indeterminate="isIndeterminate" v-model="isSelectAll" />
                        <span>{{t("Select All")}}</span>
                    </label>
                </div>
                <template v-if="calendars">
                    <div class="calendar-ctrls-color" v-for="c in calendars" :key="c.id">
                        <label class="calendar-ctrls-checkbox">
                            <input type="checkbox" :checked="c.isVisible" @change="onChange(c)" />
                            <span>{{c.name}}</span>
                        </label>
                        <Color v-model="c.backgroundColor" />
                    </div>
                </template>
            </div>
        </details>
        <div class="calendar-ctrls-right">
            <span class="calendar-ctrls-item calendar-ctrls-range">{{renderRange}}</span>
            <details class="calendar-ctrls-details" open>
                <summary class="calendar-ctrls-summary">
                    <i class="calendar-ctrls-summary-open" v-icon="'gear'"></i>
                </summary>

                <div class="calendar-ctrls-btn">
                    <Dropdown class="calendar-ctrls-item" v-model="viewType" :options="viewsOptions" />
                    <button class="calendar-ctrls-item" @click="onToday">{{t("Today")}}</button>
                    <button class="calendar-ctrls-item" v-icon="'left-arrow'" @click="onPrev"></button>
                    <button class="calendar-ctrls-item" v-icon="'right-arrow'" @click="onNext"></button>
                </div>
            </details>
        </div>
    </div>
</template>

<script setup lang="ts">
import Calendar from "@toast-ui/calendar";
import { t } from "src/lang/helpers";
import { computed, PropType, ref, set, toRefs, watch } from "vue-demi";
import Dropdown from "src/vue/components/Dropdown/index.vue";
import { useCalendars } from "./useCalendars";
import { useViewType } from "./useViewType";
import { tzFormat } from "src/utils";
import Color from "src/vue/components/Color/index.vue";
import { onClickOutside } from '@vueuse/core';

const colorPopupDetailsRef = ref<HTMLDetailsElement | null>(null);

onClickOutside(colorPopupDetailsRef, () => {
    if (colorPopupDetailsRef.value?.getAttribute("open") === null) {
        return;
    }
    colorPopupDetailsRef.value?.removeAttribute("open");
});

const props = defineProps({
    calendar: {
        type: Object as PropType<Calendar | null>,
        required: true,
    },
});

const { calendar } = toRefs(props);
const { calendars, isIndeterminate, isSelectAll, onChange } = useCalendars(calendar);
const { options: viewsOptions, viewType } = useViewType(calendar);

const renderRange = computed(() => {
    if (!calendar.value) {
        return "";
    }
    const start = calendar.value.getDateRangeStart();
    const end = calendar.value.getDateRangeEnd();
    switch (viewType.value) {
        case "month":
            return tzFormat(start, "YYYY-MM") + " ~ " + tzFormat(end, "YYYY-MM");
        case "day":
            return tzFormat(start, "YYYY-MM-DD");

        case "week":
        default:
            return tzFormat(start, "YYYY-MM-DD") + " ~ " + tzFormat(end, "YYYY-MM-DD");
    }
});

function onToday() {
    calendar.value!.today();
}

function onPrev() {
    calendar.value!.prev();
}

function onNext() {
    calendar.value!.next();
}

</script>

<style lang="scss">
.calendar-ctrls {
    margin-bottom: 0.7em;
    display: flex;
    justify-content: space-between;

    .calendar-ctrls-details {
        position: relative;
        padding-left: 24px;

        .calendar-ctrls-summary {
            height: var(--input-height);
            position: absolute;
            left: 0;
            top: calc(var(--input-height) / 2);
            transform: translateY(-50%);

            &::marker {
                display: none;
                font-size: 0;
            }

            svg {
                vertical-align: middle;
            }
        }

        .calendar-ctrls-summary-open,
        .calendar-ctrls-summary-icon {
            font-size: 0;
            display: inline-block;
            border-radius: var(--radius-s);
            height: var(--input-height);
            line-height: var(--input-height);
        }

        .calendar-ctrls-summary-open {
            padding: 0 8px;
        }

        &[open] {
            .calendar-ctrls-summary-open {
                background-color: var(--background-modifier-hover);
            }
        }

    }

    .calendar-ctrls-item {
        margin-right: 0.7em;
        vertical-align: middle;
    }

    .calendar-ctrls-right {
        display: flex;
        height: var(--input-height);

        .calendar-ctrls-details {
            padding-left: 45px;
            padding-top: 0;
        }


    }

    .calendar-ctrls-range {
        line-height: var(--input-height);
    }

    .calendar-ctrls-color {
        white-space: nowrap;
        display: flex;
        justify-content: space-between;

        .calendar-ctrls-checkbox {
            display: inline-block;
            height: var(--input-height);
            line-height: var(--input-height);

            &:nth-child(1) {
                padding-right: 8px;
            }
        }
    }

    .calendar-ctrls-color-popup {
        position: absolute;
        padding: var(--size-2-3);
        border: 1px solid var(--background-modifier-border-hover);
        background-color: var(--background-secondary);
        border-radius: var(--radius-m);
        box-shadow: var(--shadow-s);
        z-index: var(--layer-menu);
        user-select: none;
    }
}
</style>

