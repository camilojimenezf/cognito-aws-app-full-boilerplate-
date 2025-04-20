import type { CreateTodoDto } from '@todo/domain/dtos/create-todo.dto'
import type { UpdateTodoDto } from '@todo/domain/dtos/update-todo.dto'

import actions from '@todo/infrastructure/actions'

import { useTodoStore } from '@todo/presentation/store/todo.store'

export function useTodos() {
  const todoStore = useTodoStore()

  async function loadTodos() {
    todoStore.setLoading(true)
    const todos = await actions.getTodos()
    todoStore.setTodos(todos)
    todoStore.setLoading(false)
  }

  async function addTodo(input: CreateTodoDto) {
    const todo = await actions.createTodo(input)
    todoStore.addTodoToList(todo)
  }

  async function editTodo(input: UpdateTodoDto) {
    const updated = await actions.updateTodo(input)
    todoStore.updateTodoInList(updated)
  }

  async function removeTodo(id: string) {
    await actions.deleteTodo(id)
    todoStore.removeTodoFromList(id)
  }

  return {
    loadTodos,
    addTodo,
    editTodo,
    removeTodo,
  }
}
