import { axiosClient } from './axios';
import type { Todo } from './types/todo';

export const restore = async (id: string): Promise<Todo> => {
  const response = await axiosClient.post<Todo>(`/todos/${id}/restore`, {});
  return response.data;
};
