import { z } from "zod";

// ✅ Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

// ✅ Signup Schema
export const signupSchema = loginSchema
  .extend({
    name: z.string().min(2, "Name is too short."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Please enter a valid email."),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type SignupSchemaData = z.infer<typeof signupSchema>;
export type LoginSchemaData = z.infer<typeof loginSchema>;
