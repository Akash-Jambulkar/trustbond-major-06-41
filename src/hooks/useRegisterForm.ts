
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Create schema for registration form validation
const registerSchema = z
  .object({
    name: z.string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name must be less than 50 characters" }),
    email: z.string()
      .email({ message: "Please enter a valid email address" }),
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100, { message: "Password must be less than 100 characters" })
      .refine(
        (password) => /[A-Z]/.test(password),
        { message: "Password must contain at least one uppercase letter" }
      )
      .refine(
        (password) => /[0-9]/.test(password),
        { message: "Password must contain at least one number" }
      ),
    confirmPassword: z.string(),
    role: z.enum(["user", "bank"], {
      required_error: "Please select an account type",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Export the type
export type RegisterFormValues = z.infer<typeof registerSchema>;

// Custom hook for register form
export const useRegisterForm = () => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  return { form };
};
