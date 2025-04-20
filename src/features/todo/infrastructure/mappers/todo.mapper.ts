import type { TodoIndexedDbResponse } from "../interfaces/todo-indexeddb.response";
import type { ITodo } from "../../domain/entities/todo.entity";

export function mapTodoIndexedDbResponse(
  response: TodoIndexedDbResponse
): ITodo {
  return {
    id: response.id,
    title: response.description,
    completed: response.is_ok,
    createdAt: new Date(response.created_at),
    updatedAt: new Date(response.updated_at),
  };
}
