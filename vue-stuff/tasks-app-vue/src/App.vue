<script lang="ts" setup>
import { computed, ref } from "vue";
import TaskForm from "./components/TaskForm.vue";
import type { Task, TasksFilter } from "./types/type";
import TaskList from "./components/TaskList.vue";
import FilterButton from "./components/FilterButton.vue";
const message = ref("Tasks App");
const tasks = ref<Task[]>([]);
const filter = ref<TasksFilter>("all");
function addTask(newTask: string) {
  // console.log(newTask);
  tasks.value.push({
    title: newTask,
    id: crypto.randomUUID(),
    done: false,
  });
}
function removeTask(taskId: string) {
  tasks.value = tasks.value.filter((task) => task.id !== taskId);
}

function toggleDone(taskId: string) {
  const matchedTask = tasks.value.find((task) => task.id === taskId);
  if (matchedTask) matchedTask.done = !matchedTask?.done;
}
const totalDone = computed(() =>
  tasks.value.reduce((total, task) => (task.done ? total + 1 : total), 0)
);

function setFilter(value: TasksFilter) {
  filter.value = value;
}

const filteredTasks = computed(() => {
  switch (filter.value) {
    case "all":
      return tasks.value;
    case "todo":
      return tasks.value.filter((task) => task.done !== true);
    case "done":
      return tasks.value.filter((task) => task.done === true);
  }
});
</script>

<template>
  <main>
    <h1>{{ message }}</h1>
    <TaskForm @add-task="addTask" />
    <h5 v-if="!tasks.length">Add a task to get started</h5>
    <h5 v-else>
      {{ totalDone }} / {{ tasks.length }} tasks have been completed
    </h5>
    <div v-if="tasks.length" class="button-container">
      <FilterButton
        filter="all"
        :currentFilter="filter"
        @set-filter="setFilter"
      />
      <FilterButton
        filter="todo"
        :currentFilter="filter"
        @set-filter="setFilter"
      />
      <FilterButton
        filter="done"
        :currentFilter="filter"
        @set-filter="setFilter"
      />
    </div>
    <TaskList
      :tasks="filteredTasks"
      @toggle-done="toggleDone"
      @remove-task="removeTask"
    />
  </main>
</template>

<style scoped>
main {
  margin: 1rem auto;
  max-width: 800px;
  min-height: 100vh;
}
.button-container {
  display: flex;
  gap: 4px;
  justify-content: end;
  align-items: center;
}
</style>
