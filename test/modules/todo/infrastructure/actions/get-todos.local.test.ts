import { openDB } from 'idb'

import type { ITodo } from '@todo/domain/entities/todo.entity'
import { getTodos } from '@todo/infrastructure/actions/get-todos.local'
import type { TodoIndexedDbResponse } from '@todo/infrastructure/interfaces/todo-indexeddb.response'

const STORE = 'todos'

const mockStore = new Map<string, TodoIndexedDbResponse>()

vi.mock('idb', () => ({
  openDB: vi.fn().mockResolvedValue({
    getAll: vi.fn().mockImplementation((storeName: string) => {
      // ensure it's querying the right store
      if (storeName !== STORE) return Promise.resolve([])
      return Promise.resolve([...mockStore.values()])
    }),
    // unused here
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }),
}))

// seed data in the same shape your mapper expects
const initialItems: TodoIndexedDbResponse[] = [
  {
    id: 'a',
    description: 'First',
    is_ok: false,
    created_at: '2025-04-18T00:00:00.000Z',
    updated_at: '2025-04-18T00:00:00.000Z',
  },
  {
    id: 'b',
    description: 'Second',
    is_ok: true,
    created_at: '2025-04-18T00:00:00.000Z',
    updated_at: '2025-04-18T00:00:00.000Z',
  },
]

beforeEach(() => {
  mockStore.clear()
  for (const item of initialItems) {
    mockStore.set(item.id, item)
  }
})

describe('getTodos action', () => {
  it('fetches all records, calls getAll once, and applies the mapper', async () => {
    const todos = await getTodos()

    // 1) Returns the correct number of items
    expect(todos).toHaveLength(initialItems.length)

    // 2) Each ITodo matches the mapped shape
    todos.forEach((todo: ITodo, i: number) => {
      const raw = initialItems[i]
      expect(todo).toEqual({
        id: raw.id,
        title: raw.description,
        completed: raw.is_ok,
        createdAt: new Date(raw.created_at),
        updatedAt: new Date(raw.updated_at),
      })
    })

    // 3) Ensure getAll was invoked exactly once against the right store
    //    We can grab db from openDB.mock.results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = await (openDB as any).mock.results[0].value
    expect(db.getAll).toHaveBeenCalledTimes(1)
    expect(db.getAll).toHaveBeenCalledWith(STORE)
  })

  it('returns an empty array when the store is empty', async () => {
    mockStore.clear()
    const todos = await getTodos()
    expect(todos).toEqual([])
  })
})
