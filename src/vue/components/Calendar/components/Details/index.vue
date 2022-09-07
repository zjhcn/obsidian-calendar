<template>
    <details :open="open" class="calendar-details">
        <summary>{{ summary }}</summary>

        <slot></slot>
    </details>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: true
    },
    summary: String
});

const emit = defineEmits(["update:modelValue"]);
const open = useVModel(props, "modelValue", emit);
</script>

<style lang="scss">
.calendar-details>.calendar-details {
    padding-left: 1em;
}
</style>
