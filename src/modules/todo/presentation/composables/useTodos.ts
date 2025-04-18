import type { CreateTodoDto } from '../../domain/dtos/create-todo.dto'
import type { UpdateTodoDto } from '../../domain/dtos/update-todo.dto'

import { createTodo } from '../../infrastructure/actions/create-todo.local'
import { updateTodo } from '../../infrastructure/actions/update-todo.local'
import { getTodos } from '../../infrastructure/actions/get-todos.local'
import { deleteTodo } from '../../infrastructure/actions/delete-todo.local'

import { useTodoStore } from '../store/todo.store'

export function useTodos() {
  const todoStore = useTodoStore()

  async function loadTodos() {
    todoStore.setLoading(true)
    const todos = await getTodos()
    todoStore.setTodos(todos)
    todoStore.setLoading(false)
  }

  async function addTodo(input: CreateTodoDto) {
    const todo = await createTodo(input)
    todoStore.addTodoToList(todo)
  }

  async function editTodo(input: UpdateTodoDto) {
    const updated = await updateTodo(input)
    todoStore.updateTodoInList(updated)
  }

  async function removeTodo(id: string) {
    await deleteTodo(id)
    todoStore.removeTodoFromList(id)
  }

  return {
    loadTodos,
    addTodo,
    editTodo,
    removeTodo,
  }
}
