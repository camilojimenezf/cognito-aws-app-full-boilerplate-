import type { ITodo } from "../entities/todo.entity";
import type { UpdateTodoDto } from "../dtos/update-todo.dto";

export type UpdateTodo = (input: UpdateTodoDto) => Promise<ITodo>;
