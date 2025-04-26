
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { useLoginForm } from "@/hooks/useLoginForm";

export const LoginForm = () => {
  const {
    formData,
    showPassword,
    isLoading,
    error,
    setShowPassword,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-trustbond-muted" />
          <Input 
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="pl-10 focus-visible:ring-trustbond-primary"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <a href="/forgot-password" className="text-sm text-trustbond-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-trustbond-muted" />
          <Input 
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            className="pl-10 pr-10 focus-visible:ring-trustbond-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-trustbond-muted hover:text-trustbond-dark"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="remember" 
          checked={formData.rememberMe} 
          onCheckedChange={handleCheckboxChange} 
        />
        <Label htmlFor="remember" className="text-sm text-trustbond-muted">
          Remember me for 30 days
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-trustbond-primary hover:bg-trustbond-primary/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="animate-spin mr-2">●</span>
        ) : (
          <Lock className="mr-2 h-4 w-4" />
        )}
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};
