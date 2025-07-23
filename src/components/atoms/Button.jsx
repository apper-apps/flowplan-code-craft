import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-white text-text-primary border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm",
    outline: "border border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300",
    ghost: "text-text-secondary hover:text-primary-600 hover:bg-primary-50",
    ai: "bg-gradient-primary text-white shadow-ai-glow hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;