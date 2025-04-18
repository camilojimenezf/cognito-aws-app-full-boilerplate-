<template>
  <div
    class="flex items-center justify-between bg-white shadow-sm rounded-lg p-4 border hover:shadow-md transition"
  >
    <div class="flex items-center gap-3">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="toggle"
        class="w-5 h-5 text-blue-600"
      />
      <span :class="['text-lg', todo.completed ? 'line-through text-gray-400' : 'text-gray-800']">
        {{ todo.title }}
      </span>
    </div>
    <button
      @click="remove"
      class="text-red-500 hover:text-red-700 transition cursor-pointer"
      title="Delete"
    >
      🗑
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ITodo } from '../../domain/entities/todo.entity'
import { useTodos } from '../composables/useTodos'

const props = defineProps<{ todo: ITodo }>()
const { editTodo, removeTodo } = useTodos()

function toggle() {
  editTodo({ id: props.todo.id, completed: !props.todo.completed })
}

function remove() {
  removeTodo(props.todo.id)
}
</script>
