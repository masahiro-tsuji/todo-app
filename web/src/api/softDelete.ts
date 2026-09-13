import type { Todo } from '@/types';
import { axiosClient } from './axios';

export const softDelete = async (id: string): Promise<Todo> => {
  const response = await axiosClient.delete<Todo>(`/todos/${id}`);
  return response.data;
};
