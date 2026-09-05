import { z } from 'zod';

export const mfaSetupFormSchema = z.object({
  code: z.string().regex(/^\d{6}$/, '6桁の数字を入力してください'),
});
export type MfaSetupForm = z.infer<typeof mfaSetupFormSchema>;
