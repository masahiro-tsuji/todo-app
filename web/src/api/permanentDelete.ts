import type { Todo } from '@/types';
import { axiosClient } from './axios';

export const permanentDelete = async (id: string): Promise<Todo> => {
  const response = await axiosClient.delete<Todo>(`/todos/${id}/permanent-delete`);
  return response.data;
};
