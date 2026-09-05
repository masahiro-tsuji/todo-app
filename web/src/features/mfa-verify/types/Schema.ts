import { z } from 'zod';

export const mfaVerifyFormSchema = z.object({
  code: z.string().regex(/^\d{6}$/, '6桁の数字を入力してください'),
});
export type MfaVerifyForm = z.infer<typeof mfaVerifyFormSchema>;
