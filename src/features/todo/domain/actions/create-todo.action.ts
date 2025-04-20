import type { ITodo } from "../entities/todo.entity";
import type { CreateTodoDto } from "../dtos/create-todo.dto";

export type CreateTodo = (input: CreateTodoDto) => Promise<ITodo>;
