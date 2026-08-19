import { axiosClient } from './axios';
import type { Todo } from './types/todo';

export type UpdateTodoRequestBody = {
  title?: string;
  detail?: string;
};

export const updateTodo = async (id: string, body: UpdateTodoRequestBody): Promise<Todo> => {
  const response = await axiosClient.patch<Todo>(`/todos/${id}`, body);
  return response.data;
};
