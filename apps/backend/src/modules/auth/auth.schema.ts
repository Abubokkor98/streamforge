import { z } from 'zod';

const PASSWORD_MIN_LENGTH = 8;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, { error: 'Name is required' }),
    email: z.email({ error: 'Please provide a valid email address' }),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, {
        error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      })
      .regex(DIGIT_REGEX, { error: 'Password must contain at least one number' })
      .regex(SPECIAL_CHAR_REGEX, {
        error: 'Password must contain at least one special character',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.email({ error: 'Please provide a valid email address' }),
  password: z.string().min(1, { error: 'Password is required' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
