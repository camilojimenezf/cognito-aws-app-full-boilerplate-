import type { ITodo } from "../entities/todo.entity";

export type GetTodos = () => Promise<ITodo[]>;
