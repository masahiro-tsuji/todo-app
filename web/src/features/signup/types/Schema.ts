import { z } from 'zod';

export const signupFormSchema = z
  .object({
    email: z.email('有効なメールアドレスを入力してください'),
    password: z
      .string()
      .min(8, '8文字以上で入力してください')
      .regex(/[a-z]/, '小文字を含めてください')
      .regex(/[0-9]/, '数字を含めてください'),
    passwordConfirm: z.string().min(1, '確認用パスワードを入力してください'),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirm'],
  });

export type SignupForm = z.infer<typeof signupFormSchema>;
