import { z } from 'zod';

export const editTodoFormSchema = z.object({
  title: z.string().trim().min(1, 'タイトルを入力してください'),
  detail: z.string().optional(),
});

export type EditTodoForm = z.infer<typeof editTodoFormSchema>;
