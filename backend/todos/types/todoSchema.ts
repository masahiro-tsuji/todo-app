import { z } from 'zod';

export const createTodoBodySchema = z.object({
  title: z.string().trim().min(1, 'タイトルは必須です'),
  detail: z.string().optional(),
});

export type CreateTodoRequestBody = z.infer<typeof createTodoBodySchema>;
