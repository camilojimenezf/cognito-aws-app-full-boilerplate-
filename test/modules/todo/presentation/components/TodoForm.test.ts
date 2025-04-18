import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import TodoForm from '@todo/presentation/components/TodoForm.vue';

const mockAddTodo = vi.fn();

vi.mock('@todo/presentation/composables/useTodos', () => ({
  useTodos: () => ({ addTodo: mockAddTodo }),
}));

describe('TodoForm.vue', () => {
  let wrapper: ReturnType<typeof shallowMount>;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = shallowMount(TodoForm, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
  });

  it('calls addTodo with the entered title and then clears the input', async () => {
    const input = wrapper.find('input');
    const form = wrapper.find('form');

    await input.setValue('New Todo Item');
    expect((input.element as HTMLInputElement).value).toBe('New Todo Item');

    await form.trigger('submit.prevent');

    expect(mockAddTodo).toHaveBeenCalledTimes(1);
    expect(mockAddTodo).toHaveBeenCalledWith({ title: 'New Todo Item' });
    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('does not call addTodo if input is empty or whitespace', async () => {
    const input = wrapper.find('input');
    const form = wrapper.find('form');

    await input.setValue('   ');
    await form.trigger('submit.prevent');

    expect(mockAddTodo).not.toHaveBeenCalled();
    expect((input.element as HTMLInputElement).value).toBe('   ');
  });

  it('should fail if addTodo throws an error', async () => {
    mockAddTodo.mockRejectedValue(new Error('Error adding todo'));

    const input = wrapper.find('input');
    const form = wrapper.find('form');

    await input.setValue('New Todo Item');
    await form.trigger('submit.prevent');

    expect(mockAddTodo).toHaveBeenCalledTimes(1);
    expect(mockAddTodo).toHaveBeenCalledWith({ title: 'New Todo Item' });
    expect((input.element as HTMLInputElement).value).toBe('New Todo Item');
    expect(wrapper.find('p').text()).toBe('Error adding todo');
  });
});
