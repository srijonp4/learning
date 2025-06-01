<script lang="ts" setup>
import type { Task } from "../types/type";
const props = defineProps<{
  tasks: Task[];
}>();
const emits = defineEmits<{
  toggleDone: [id: string];
  removeTask: [taskId: string];
}>();
</script>
<template>
  <TransitionGroup name="task-list" tag="div" class="task-list">
    <article v-for="task in props.tasks" :key="task.id" class="container">
      <label>
        <input
          @input="emits('toggleDone', task.id)"
          :checked="task.done"
          type="checkbox"
          name="done"
          id="done"
        />
        <span :class="{ done: task.done }">
          {{ task.title }}
        </span>
      </label>
      <button class="outline" @click="emits('removeTask', task.id)">
        Remove
      </button>
    </article>
  </TransitionGroup>
</template>

<style lang="css" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.done {
  text-decoration: line-through;
}
.remove {
  background-color: rgb(218, 38, 68);
}
.task-list {
  margin-top: 1rem;
}

.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.5s ease;
}
.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateX(300px);
}
</style>
