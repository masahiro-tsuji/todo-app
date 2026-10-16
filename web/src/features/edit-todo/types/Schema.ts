import { z } from 'zod';
import { todoInputFormSchema } from '@/components';

export const editTodoFormSchema = todoInputFormSchema.extend({
  completed: z.boolean(),
});

export type EditTodoFormType = z.infer<typeof editTodoFormSchema>;
