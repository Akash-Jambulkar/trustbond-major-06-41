
import * as React from "react";
import { cn } from "@/lib/utils";

export interface KeypadProps extends React.HTMLAttributes<HTMLDivElement> {}

const Keypad = React.forwardRef<HTMLDivElement, KeypadProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
);
Keypad.displayName = "Keypad";

export interface KeypadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const KeypadButton = React.forwardRef<HTMLButtonElement, KeypadButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-lg font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
KeypadButton.displayName = "KeypadButton";

export { Keypad, KeypadButton };
