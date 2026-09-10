import { axiosClient } from './axios';
import type { Todo } from './types/todo';

export const permanentDelete = async (id: string): Promise<Todo> => {
  const response = await axiosClient.delete<Todo>(`/todos/${id}/permanent-delete`);
  return response.data;
};
