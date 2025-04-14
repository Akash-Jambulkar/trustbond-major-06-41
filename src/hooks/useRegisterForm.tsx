
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMode } from "@/contexts/ModeContext";
import { UserRole } from "@/contexts/auth/types";

// Define the form validation schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
  role: z.enum(["user", "bank"]).refine(value => ["user", "bank"].includes(value), {
    message: "Invalid role selected"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Define the form data type
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const useRegisterForm = () => {
  const { isProductionMode } = useMode();
  
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user" as "user" | "bank", // Explicitly type this to match the schema
    },
    mode: "onChange"
  });
  
  // Clear form data when switching between production and demo modes
  useEffect(() => {
    if (isProductionMode) {
      form.reset({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
    }
  }, [isProductionMode, form]);

  return {
    form
  };
};
