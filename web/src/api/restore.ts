import type { Todo } from '@/types';
import { axiosClient } from './axios';

export const restore = async (id: string): Promise<Todo> => {
  const response = await axiosClient.post<Todo>(`/todos/${id}/restore`, {});
  return response.data;
};
