import { axiosClient } from './axios';
import type { Todo } from './types/todo';

export const getTrashTodos = async (): Promise<Todo[]> => {
  const response = await axiosClient.get<Todo[]>('/todos/trash');
  return response.data;
};
