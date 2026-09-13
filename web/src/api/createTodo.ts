import type { Todo } from '@/types';
import { axiosClient } from './axios';

export type CreateTodoRequestBody = {
  title: string;
  detail?: string;
};

export const createTodo = async (body: CreateTodoRequestBody): Promise<Todo> => {
  const response = await axiosClient.post<Todo>('/todos', body);
  return response.data;
};
