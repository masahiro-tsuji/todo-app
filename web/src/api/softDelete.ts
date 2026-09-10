import { axiosClient } from './axios';
import type { Todo } from './types/todo';

export const softDelete = async (id: string): Promise<Todo> => {
  const response = await axiosClient.delete<Todo>(`/todos/${id}`);
  return response.data;
};
