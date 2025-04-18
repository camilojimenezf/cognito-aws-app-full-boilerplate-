<template>
  <form @submit.prevent="submit" class="flex gap-2 items-center">
    <input
      v-model="title"
      placeholder="Add a new task"
      class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
    >
      Add
    </button>
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTodos } from '@todo/presentation/composables/useTodos';

const { addTodo } = useTodos();
const title = ref('');
const errorMessage = ref('');

async function submit() {
  if (title.value.trim()) {
    try {
      errorMessage.value = '';
      await addTodo({ title: title.value });
      title.value = '';
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Error adding todo';
    }
  }
}
</script>
