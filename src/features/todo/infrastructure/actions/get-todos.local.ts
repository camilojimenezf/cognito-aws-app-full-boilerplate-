import { openDB } from 'idb';

import type { GetTodos } from '../../domain/actions/get-todos.action';
import { mapTodoIndexedDbResponse } from '../mappers/todo.mapper';
import type { TodoIndexedDbResponse } from '../interfaces/todo-indexeddb.response';

const DB_NAME = 'todo-db';
const STORE = 'todos';

export const getTodos: GetTodos = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    },
  });

  const items = (await db.getAll(STORE)) as TodoIndexedDbResponse[];
  return items.map(mapTodoIndexedDbResponse);
};
