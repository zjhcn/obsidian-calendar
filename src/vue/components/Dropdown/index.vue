<template>
    <label ref="container"> </label>
</template>

<script setup lang="ts">
import { DropdownComponent } from "obsidian";
import { onMounted, PropType, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";
import { DropdownOption } from "src/obsidian_vue.type";

const props = defineProps({
    modelValue: String,
    options: {
        type: Array as PropType<DropdownOption[]>,
        required: true
    }
});

const emit = defineEmits(["update:modelValue"]);

const container = ref<HTMLDivElement | null>(null);
const dropdownEl = ref<DropdownComponent | null>(null);
const selected = useVModel(props, "modelValue", emit);

onMounted(() => {
    if (!container.value) {
        return;
    }

    const dropdownComponent = new DropdownComponent(container.value);
    dropdownEl.value = dropdownComponent;
    if (props.options) {
        props.options.forEach(({ value, display }) => {
            dropdownComponent.addOption(value, display);
        });
    }
    if (selected.value) {
        dropdownEl.value?.setValue(selected.value);
    }
    dropdownComponent.onChange((value) => {
        selected.value = value;
    });
});

watch(selected, (value) => {
    if (value === undefined) {
        return;
    }
    dropdownEl.value?.setValue(value);
});

</script>

