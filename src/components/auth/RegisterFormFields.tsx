
import React from "react";
import { User, Mail, LockKeyhole, CheckCircle2 } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RegisterFormValues } from "@/hooks/useRegisterForm";
import { UseFormReturn } from "react-hook-form";

interface RegisterFormFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const RegisterFormFields = ({ form }: RegisterFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <FormControl>
                <Input id="name" placeholder="John Doe" className="pl-10" {...field} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="email">Email</FormLabel>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <FormControl>
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" {...field} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="password">Password</FormLabel>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockKeyhole size={18} className="text-gray-400" />
              </div>
              <FormControl>
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...field} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckCircle2 size={18} className="text-gray-400" />
              </div>
              <FormControl>
                <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10" {...field} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Account Type</FormLabel>
            <FormControl>
              <RadioGroup value={field.value} onValueChange={field.onChange} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user" className="cursor-pointer">Individual User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="cursor-pointer">Bank/Financial Institution</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
