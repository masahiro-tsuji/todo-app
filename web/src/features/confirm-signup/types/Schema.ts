import { z } from 'zod';

export const confirmSignupFormSchema = z.object({
  code: z.string().regex(/^\d{6}$/, '6桁の数字を入力してください'),
});

export type ConfirmSignupForm = z.infer<typeof confirmSignupFormSchema>;
