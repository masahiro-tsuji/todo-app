import { z } from 'zod';

export const createTodoFormSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
});

export type CreateTodoForm = z.infer<typeof createTodoFormSchema>;
