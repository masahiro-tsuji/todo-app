import type { Todo } from '@/types';
import { axiosClient } from './axios';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axiosClient.get<Todo[]>('/todos');
  return response.data;
};
