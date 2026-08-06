import { axiosClient } from './axios';
import type { Todo } from './types/todo';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axiosClient.get<Todo[]>('/todos');
  return response.data;
};
