import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-gray-100 bg-white shadow-card",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;