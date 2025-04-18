import { openDB } from "idb";
import type { DeleteTodo } from "../../domain/actions/delete-todo.action";

const DB_NAME = "todo-db";
const STORE = "todos";

export const deleteTodo: DeleteTodo = async (id: string) => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    },
  });

  await db.delete(STORE, id);
};
