<script lang="ts" setup>
import { ref } from "vue";

const newTask = ref("");
const error = ref("");
const emits = defineEmits<{
  addTask: [newTask: string];
}>();

function handleSubmit() {
  // console.log({ newTask: newTask.value });
  if (newTask.value.trim()) {
    emits("addTask", newTask.value);
    newTask.value = "";
  } else {
    error.value = "Tasks cannot be empty";
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <label for="task-input">
      New Task
      <input
        v-model="newTask"
        name="newTask"
        type="text"
        id="task-input"
        :aria-invalid="!!error || undefined"
        @change="error = ''"
      />
      <small v-if="error" class="invalid-helper">
        {{ error }}
      </small>
    </label>
    <div class="button-container">
      <button type="submit">Add Task</button>
    </div>
  </form>
</template>
<style scoped>
.button-container {
  display: flex;
  justify-content: end;
}
</style>
