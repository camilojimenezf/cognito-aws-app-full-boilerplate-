import { shallowMount } from '@vue/test-utils';
import type { ITodo } from '@todo/domain/entities/todo.entity';
import TodoPage from '@todo/presentation/pages/TodoPage.vue';

const mockLoadTodos = vi.fn();

vi.mock('@todo/presentation/composables/useTodos', () => ({
  useTodos: () => ({
    loadTodos: mockLoadTodos,
  }),
}));

const mockStore = {
  isLoading: false,
  todos: [] as ITodo[],
};

vi.mock('@todo/presentation/store/todo.store', () => ({
  useTodoStore: () => mockStore,
}));

describe('TodoPage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockStore.isLoading = false;
    mockStore.todos = [];
  });

  it('calls loadTodos on mount', () => {
    shallowMount(TodoPage);
    expect(mockLoadTodos).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when store.isLoading is true', () => {
    mockStore.isLoading = true;
    const wrapper = shallowMount(TodoPage);

    expect(wrapper.text()).toContain('Loading todos...');
  });

  it('renders a TodoItem stub for each todo when not loading', () => {
    mockStore.isLoading = false;
    mockStore.todos = [
      { id: '1', title: 'A', completed: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '2', title: 'B', completed: true, createdAt: new Date(), updatedAt: new Date() },
      { id: '3', title: 'C', completed: false, createdAt: new Date(), updatedAt: new Date() },
    ];

    const wrapper = shallowMount(TodoPage);

    // shallowMount stubs <TodoItem> como <todo-item-stub>
    const items = wrapper.findAll('todo-item-stub');
    expect(items).toHaveLength(mockStore.todos.length);
  });
});
