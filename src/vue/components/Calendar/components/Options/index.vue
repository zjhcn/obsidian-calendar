<template>
    <div>
        <DetailsComp open="true" summary="Options">
            <DetailsComp summary="Theme">
                <ObsidianColor v-model="theme.nowIndicatorBullet.backgroundColor" />
            </DetailsComp>
        </DetailsComp>
    </div>
</template>

<script setup lang="ts">
import ObsidianColor from "src/vue/components/Color/index.vue";
import { useSettingStore } from "src/vue/store";
import DetailsComp from "../Details/index.vue";

const { theme } = useSettingStore();
</script>
