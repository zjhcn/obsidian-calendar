<template>
    <label ref="container"> </label>
</template>

<script setup lang="ts">
import { ColorComponent, HSL, RGB } from "obsidian";
import { onMounted, PropType, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";

const props = defineProps({
    modelValue: [String, Object] as PropType<string | RGB | HSL>,
});

const emit = defineEmits(["update:modelValue"]);

const container = ref<HTMLDivElement | null>(null);
const colorEl = ref<ColorComponent | null>(null);
const color = useVModel(props, "modelValue", emit);

onMounted(() => {
    if (!container.value) {
        return;
    }

    const colorComponent = new ColorComponent(container.value);
    colorEl.value = colorComponent;
    if (color.value) {
        setValue(color.value);
    }
    colorComponent.onChange((value) => {
        color.value = value;
    });
});

watch(color, (value) => {
    setValue(value);
});

function setValue(value?: string | RGB | HSL) {
    if (typeof value === "string") {
        colorEl.value?.setValue(value);
        return;
    }

    if (Object.prototype.hasOwnProperty.call(color.value, "r")) {
        colorEl.value?.setValueRgb(value as RGB);
        return;
    }

    if (Object.prototype.hasOwnProperty.call(color.value, "h")) {
        colorEl.value?.setValueHsl(value as HSL);
        return;
    }
}
</script>

