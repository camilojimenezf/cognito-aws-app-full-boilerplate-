import { openDB } from 'idb'

import type { UpdateTodoDto } from '@todo/domain/dtos/update-todo.dto'
import { updateTodo } from '@todo/infrastructure/actions/update-todo.local'

interface MockData {
  id: string
  description: string
  is_ok: boolean
  created_at: string
  updated_at: string
}

const mockStore = new Map<string, MockData>()

vi.mock('idb', () => ({
  openDB: vi.fn().mockResolvedValue({
    get: vi.fn().mockImplementation((_, id: string) => Promise.resolve(mockStore.get(id))),
    put: vi.fn().mockImplementation((_, data: MockData) => {
      mockStore.set(data.id, data)
      return Promise.resolve()
    }),
    getAll: vi.fn(),
    delete: vi.fn(),
  }),
}))

const initialTodo = {
  id: '1',
  description: 'Old Title',
  is_ok: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

beforeEach(() => {
  mockStore.clear()

  mockStore.set(initialTodo.id, { ...initialTodo })
})

describe('updateTodo action', () => {
  it('updates an existing todo and returns the updated entity', async () => {
    const newTitle = 'New Title'
    const newCompleted = true
    const dto: UpdateTodoDto = { id: '1', title: newTitle, completed: newCompleted }

    const result = await updateTodo(dto)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = await (openDB as any).mock.results[0].value
    expect(db.put).toHaveBeenCalledTimes(1)
    expect(db.put).toHaveBeenCalledWith('todos', {
      id: '1',
      description: newTitle,
      is_ok: newCompleted,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })

    expect(result).toMatchObject({
      id: '1',
      title: newTitle,
      completed: newCompleted,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })

    const stored = mockStore.get('1')!
    expect(stored.description).toBe(newTitle)
    expect(stored.is_ok).toBe(newCompleted)
    expect(typeof stored.updated_at).toBe('string')
    expect(new Date(stored.updated_at)).toBeInstanceOf(Date)
  })

  it('throws if the todo does not exist', async () => {
    const dto: UpdateTodoDto = { id: 'non-existent', title: 'X' }
    await expect(updateTodo(dto)).rejects.toThrow('Todo not found')
  })
})
