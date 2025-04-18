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
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodos } from '../composables/useTodos'

const { addTodo } = useTodos()
const title = ref('')

function submit() {
  if (title.value.trim()) {
    addTodo({ title: title.value })
    title.value = ''
  }
}
</script>
