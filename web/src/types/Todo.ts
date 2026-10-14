export type Todo = {
  userId: string;
  id: string;
  title: string;
  createdAt: string;
  completed: boolean;
  detail?: string;
  deletedAt?: string;
  completedAt?: string;
};
