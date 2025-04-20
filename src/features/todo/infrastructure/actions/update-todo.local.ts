import { openDB } from "idb";

import type { UpdateTodo } from "../../domain/actions/update-todo.action";
import type { UpdateTodoDto } from "../../domain/dtos/update-todo.dto";
import type { TodoIndexedDbResponse } from "../interfaces/todo-indexeddb.response";
import { mapTodoIndexedDbResponse } from "../mappers/todo.mapper";

const DB_NAME = "todo-db";
const STORE = "todos";

export const updateTodo: UpdateTodo = async (updateTodoDto: UpdateTodoDto) => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    },
  });

  const current = (await db.get(
    STORE,
    updateTodoDto.id
  )) as TodoIndexedDbResponse;

  if (!current) throw new Error("Todo not found");

  const updated: TodoIndexedDbResponse = {
    ...current,
    description: updateTodoDto.title ?? current.description,
    is_ok: updateTodoDto.completed ?? current.is_ok,
    updated_at: new Date().toISOString(),
  };

  await db.put(STORE, updated);
  return mapTodoIndexedDbResponse(updated);
};
