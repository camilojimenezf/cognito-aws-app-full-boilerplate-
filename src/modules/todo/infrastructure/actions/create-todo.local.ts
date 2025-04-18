import { openDB } from "idb";

import type { CreateTodo } from "../../domain/actions/create-todo.action";
import type { CreateTodoDto } from "../../domain/dtos/create-todo.dto";
import { mapTodoIndexedDbResponse } from "../mappers/todo.mapper";

const DB_NAME = "todo-db";
const STORE = "todos";

export const createTodo: CreateTodo = async (createTodoDto: CreateTodoDto) => {
  const bodyData = {
    id: crypto.randomUUID(),
    description: createTodoDto.title,
    is_ok: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    },
  });

  await db.put(STORE, bodyData);
  return mapTodoIndexedDbResponse(bodyData);
};
