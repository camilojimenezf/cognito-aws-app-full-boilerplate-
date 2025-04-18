import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { useTodos } from '@todo/presentation/composables/useTodos';
import { useTodoStore } from '@todo/presentation/store/todo.store';
import actions from '@todo/infrastructure/actions';

describe('useTodos composable', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let todoStoreMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    const pinia = createTestingPinia();
    setActivePinia(pinia);
    todoStoreMock = useTodoStore();
  });

  it('loadTodos: sets loading, fetches todos, updates store, and unsets loading', async () => {
    const initialTodos = [
      { id: '1', title: 'Todo 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '2', title: 'Todo 2', completed: true, createdAt: new Date(), updatedAt: new Date() },
    ];
    const actionsSpy = vi.spyOn(actions, 'getTodos').mockResolvedValue(initialTodos);

    const { loadTodos } = useTodos();
    await loadTodos();

    expect(todoStoreMock.setLoading).toHaveBeenNthCalledWith(1, true);
    expect(actionsSpy).toHaveBeenCalledTimes(1);
    expect(todoStoreMock.setTodos).toHaveBeenCalledWith(initialTodos);
    expect(todoStoreMock.setLoading).toHaveBeenNthCalledWith(2, false);
  });

  it('addTodo: adds a todo to the store', async () => {
    const newTodo = {
      id: '3',
      title: 'New Todo',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const actionsSpy = vi.spyOn(actions, 'createTodo').mockResolvedValue(newTodo);

    const { addTodo } = useTodos();
    await addTodo(newTodo);

    expect(actionsSpy).toHaveBeenCalledTimes(1);
    expect(todoStoreMock.addTodoToList).toHaveBeenCalledWith(newTodo);
  });

  it('editTodo: updates a todo in the store', async () => {
    const updatedTodo = {
      id: '1',
      title: 'Updated Todo',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const actionsSpy = vi.spyOn(actions, 'updateTodo').mockResolvedValue(updatedTodo);

    const { editTodo } = useTodos();
    await editTodo(updatedTodo);

    expect(actionsSpy).toHaveBeenCalledTimes(1);
    expect(todoStoreMock.updateTodoInList).toHaveBeenCalledWith(updatedTodo);
  });

  it('removeTodo: removes a todo from the store', async () => {
    const id = '1';
    const actionsSpy = vi.spyOn(actions, 'deleteTodo').mockResolvedValue();

    const { removeTodo } = useTodos();
    await removeTodo(id);

    expect(actionsSpy).toHaveBeenCalledTimes(1);
    expect(todoStoreMock.removeTodoFromList).toHaveBeenCalledWith(id);
  });
});
