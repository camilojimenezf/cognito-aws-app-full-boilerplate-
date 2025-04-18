import type { CreateTodoDto } from '@todo/domain/dtos/create-todo.dto'
import { createTodo } from '@todo/infrastructure/actions/create-todo.local'

type MockData = {
  id: string
  description: string
  is_ok: boolean
  created_at: string
  updated_at: string
}

const mockStore = new Map<string, MockData>()

vi.mock('idb', () => ({
  openDB: async () => ({
    getAll: async () => [...mockStore.values()],
    put: async (_storeName: string, data: MockData) => {
      mockStore.set(data.id, data)
    },
    get: async (_storeName: string, id: string) => mockStore.get(id),
    delete: async (_storeName: string, id: string) => {
      mockStore.delete(id)
    },
  }),
}))

beforeEach(() => {
  mockStore.clear()
})

describe('createTodo action', () => {
  it('persists a new todo and returns it correctly', async () => {
    mockStore.clear()

    const todoTitle = 'Mocked Todo'

    const dto: CreateTodoDto = { title: todoTitle }
    const todo = await createTodo(dto)

    expect(todo).toMatchObject({
      id: expect.any(String),
      title: todoTitle,
      completed: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })

    const storedTodo = mockStore.get(todo.id)
    expect(storedTodo).toMatchObject({
      id: todo.id,
      description: todoTitle,
      is_ok: false,
      created_at: todo.createdAt.toISOString(),
      updated_at: todo.updatedAt.toISOString(),
    })
  })
})
