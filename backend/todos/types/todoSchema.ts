import { z } from 'zod';

export type Todo = {
  userId: string;
  id: string;
  title: string;
  createdAt: string;
  detail?: string;
  deletedAt?: string;
  completedAt?: string;
};

/** TODO作成スキーマ */
export const createTodoBodySchema = z.object({
  title: z.string().trim().min(1, 'タイトルは必須です'),
  detail: z.string().optional(),
});
export type CreateTodoRequestBody = z.infer<typeof createTodoBodySchema>;

/** TODO更新スキーマ */
export const updateTodoRequestSchema = createTodoBodySchema
  .partial()
  .extend({ completed: z.boolean().optional() })
  .refine((data) => data.title !== undefined || data.detail !== undefined || data.completed !== undefined, {
    message: '更新する項目を1つ以上指定してください',
  });
export type UpdateTodoRequestBody = z.infer<typeof updateTodoRequestSchema>;

/** TODO一覧取得の status クエリ */
export const todosStatusSchema = z.enum(['active', 'completed', 'trashed']);
export type TodosStatus = z.infer<typeof todosStatusSchema>;
