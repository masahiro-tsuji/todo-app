import { z } from 'zod';

export const todoInputFormSchema = z.object({
  title: z.string().trim().min(1, 'タイトルを入力してください'),
  detail: z.string().optional(),
});

export type TodoInputFormType = z.infer<typeof todoInputFormSchema>;
