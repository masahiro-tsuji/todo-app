import { axiosClient } from './axios';

export type Todo = {
  userId: string;
  id: string;
  title: string;
  createdAt: string;
  detail?: string;
};

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axiosClient.get<Todo[]>('/todos');
  return response.data;
};
