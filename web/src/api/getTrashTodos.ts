import type { Todo } from '@/types';
import { axiosClient } from './axios';

export const getTrashTodos = async (): Promise<Todo[]> => {
  const response = await axiosClient.get<Todo[]>('/todos/trash');
  return response.data;
};
