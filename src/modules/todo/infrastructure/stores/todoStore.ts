import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ITodo } from '../../domain/entities/todo.entity'

export const useTodoStore = defineStore('todos', () => {
  // State
  const todos = ref<ITodo[]>([])
  const isLoading = ref(false)

  // Actions
  function setTodos(newTodos: ITodo[]) {
    todos.value = newTodos
  }

  function addTodoToList(todo: ITodo) {
    todos.value = [...todos.value, todo]
  }

  function updateTodoInList(updatedTodo: ITodo) {
    const index = todos.value.findIndex((t) => t.id === updatedTodo.id)
    if (index !== -1) todos.value[index] = updatedTodo
  }

  function removeTodoFromList(id: string) {
    todos.value = todos.value.filter((t) => t.id !== id)
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  return {
    // State
    todos,
    isLoading,

    // Actions
    setTodos,
    addTodoToList,
    updateTodoInList,
    removeTodoFromList,
    setLoading,
  }
})
