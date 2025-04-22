
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRegisterForm, RegisterFormValues } from "@/hooks/useRegisterForm";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { RegisterFormFields } from "./RegisterFormFields";
import { RegisterSubmitButton } from "./RegisterSubmitButton";

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { form } = useRegisterForm();
  const navigate = useNavigate();

  const handleSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const success = await register(data.email, data.password, data.name, data.role);
      
      if (success) {
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: "Registration successful! Please check your email to verify your account." 
            } 
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <RegisterFormFields form={form} />
        <RegisterSubmitButton isLoading={isLoading} />
      </form>
    </Form>
  );
};
