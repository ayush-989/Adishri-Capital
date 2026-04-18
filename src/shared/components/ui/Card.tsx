import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "./Button";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
 feature/admin-dashboard
      className={cn("rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 text-slate-800", className)}

      className={cn("rounded-2xl border border-gray-100 bg-white text-gray-950 shadow-sm hover:shadow-md transition-shadow duration-300", className)}
 main
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
 feature/admin-dashboard
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5 pb-4 border-b border-slate-100", className)} {...props} />

    <div ref={ref} className={cn("flex flex-col space-y-2 p-6 md:p-8", className)} {...props} />
 main
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
 feature/admin-dashboard
    <h3 ref={ref} className={cn("text-base font-semibold leading-none tracking-tight text-slate-800", className)} {...props} />

    <h3 ref={ref} className={cn("text-2xl font-bold leading-none tracking-tight text-gray-900", className)} {...props} />
 main
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
 feature/admin-dashboard
    <p ref={ref} className={cn("text-sm text-slate-500 font-medium", className)} {...props} />

    <p ref={ref} className={cn("text-sm text-gray-500 font-medium", className)} {...props} />
 main
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
 feature/admin-dashboard
    <div ref={ref} className={cn("p-5 pt-4", className)} {...props} />

    <div ref={ref} className={cn("p-6 md:p-8 pt-0 md:pt-0", className)} {...props} />
 main
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
 feature/admin-dashboard
    <div ref={ref} className={cn("flex items-center p-5 pt-4 border-t border-slate-100", className)} {...props} />

    <div ref={ref} className={cn("flex items-center p-6 md:p-8 pt-0 md:pt-0 border-t border-gray-50/50 mt-4", className)} {...props} />
 main
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
