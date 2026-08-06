import { z } from 'zod';

export const createTodoFormSchema = z.object({
  title: z.string().trim().min(1, 'タイトルを入力してください'),
  detail: z.string().optional(),
});

export type CreateTodoForm = z.infer<typeof createTodoFormSchema>;
