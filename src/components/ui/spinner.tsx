
import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary";
}

export function Spinner({
  className,
  size = "md", 
  variant = "default",
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };
  
  const variantClasses = {
    default: "border-t-foreground/60",
    primary: "border-t-trustbond-primary",
    secondary: "border-t-trustbond-secondary",
  };

  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-transparent", 
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
