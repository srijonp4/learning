<script lang="ts" setup>
import type { TasksFilter } from "../types/type";
const props = defineProps<{
  filter: TasksFilter;
  currentFilter: TasksFilter;
}>();
const emits = defineEmits<{
  setFilter: [filter: TasksFilter];
}>();
</script>
<template>
  <button
    class="button-secondary"
    :class="{ contrast: props.filter === props.currentFilter }"
    @click="emits('setFilter', props.filter)"
  >
    {{ props.filter }}
  </button>
</template>

<style scoped>
button {
  text-transform: capitalize;
  font-style: italic;
}
</style>
