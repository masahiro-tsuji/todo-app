import { axiosClient } from './axios';
import type { Todo } from './types/todo';

export type CreateTodoRequestBody = {
  title: string;
  detail?: string;
};

export const createTodo = async (body: CreateTodoRequestBody): Promise<Todo> => {
  const response = await axiosClient.post<Todo>('/todos', body);
  return response.data;
};
