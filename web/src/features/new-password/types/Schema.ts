import { z } from 'zod';

export const newPasswordFormSchema = z.object({
  newPassword: z
    .string()
    .min(8, '8文字以上で入力してください')
    .regex(/[a-z]/, '小文字を含めてください')
    .regex(/[0-9]/, '数字を含めてください'),
});
export type NewPasswordForm = z.infer<typeof newPasswordFormSchema>;
