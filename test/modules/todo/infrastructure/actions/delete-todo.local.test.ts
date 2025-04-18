import { openDB } from 'idb'
import { deleteTodo } from '@todo/infrastructure/actions/delete-todo.local'

interface MockData {
  id: string
  description: string
  is_ok: boolean
  created_at: string
  updated_at: string
}

const STORE = 'todos'

const mockStore = new Map<string, MockData>()

vi.mock('idb', () => ({
  openDB: vi.fn().mockResolvedValue({
    delete: vi.fn().mockImplementation((_, id: string) => {
      mockStore.delete(id)
      return Promise.resolve()
    }),
    // stubs for other methods (not used here)
    get: vi.fn(),
    put: vi.fn(),
    getAll: vi.fn(),
  }),
}))

// seed initial data
const initialTodos: MockData[] = [
  {
    id: '1',
    description: 'First',
    is_ok: false,
    created_at: '2025-04-18T00:00:00.000Z',
    updated_at: '2025-04-18T00:00:00.000Z',
  },
  {
    id: '2',
    description: 'Second',
    is_ok: true,
    created_at: '2025-04-18T00:00:00.000Z',
    updated_at: '2025-04-18T00:00:00.000Z',
  },
]

beforeEach(() => {
  mockStore.clear()

  for (const t of initialTodos) {
    mockStore.set(t.id, t)
  }
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('deleteTodo action', () => {
  it('calls db.delete once with the correct store and id', async () => {
    await deleteTodo('1')

    // grab the db object that openDB resolved to
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = await (openDB as any).mock.results[0].value

    expect(db.delete).toHaveBeenCalledTimes(1)
    expect(db.delete).toHaveBeenCalledWith(STORE, '1')
  })

  it('removes the item from mockStore', async () => {
    expect(mockStore.has('1')).toBe(true)

    await deleteTodo('1')

    expect(mockStore.has('1')).toBe(false)
  })

  it('does not throw if the id does not exist', async () => {
    await expect(deleteTodo('non-existent')).resolves.toBeUndefined()
    // store remains unchanged
    expect(mockStore.size).toBe(initialTodos.length)
  })
})
