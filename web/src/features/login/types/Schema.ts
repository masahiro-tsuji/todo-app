import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

export type LoginForm = z.infer<typeof loginFormSchema>;
