import type { Todo } from '@/types';
import { axiosClient } from './axios';

export type UpdateTodoRequestBody = {
  title?: string;
  detail?: string;
};

export const updateTodo = async (id: string, body: UpdateTodoRequestBody): Promise<Todo> => {
  const response = await axiosClient.patch<Todo>(`/todos/${id}`, body);
  return response.data;
};
