import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center duration-100 border border-transparent whitespace-nowrap text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 transition-all active:opacity-90 font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/95",
        destructive:
          "bg-destructive/10 text-destructive  hover:bg-destructive/20",
        outline:
          "border border-border bg-card hover:text-muted-foreground shadow-sm shadow-black/5",
        "outline-solid":
          "border border-primary bg-card hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground  hover:bg-foreground/15",
        "secondary-outline":
          "bg-secondary border-foreground/10 text-secondary-foreground  hover:bg-secondary/80 hover:border-transparent",
        ghost: "hover:bg-muted hover:primary",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-emerald-500/10 text-emerald-500",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
      },
      size: {
        default: "h-8 px-2.5 gap-2 rounded-md",
        sm: "h-7 px-2  gap-1.5 text-sm rounded-md",
        xs: "h-6 px-3 text-xs gap-1 text-xs rounded-md",
        xxs: "h-5 px-2 text-xs gap-1 text-xs rounded-md",
        lg: "h-9 px-4 gap-3 text-base [&_svg:not([class*='size-'])]:size-4 rounded-lg",
        icon: "size-8 rounded-md",
        "icon-sm": "size-7 text-sm rounded-md",
        "icon-xs": "size-6 text-xs rounded-md",
        "icon-xxs": "size-5 text-xs rounded-md",
      },
      rounded: {
        false: "",
        true: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: false,
    },
  }
);

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  rounded,
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className, rounded }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {loading && loadingText ? loadingText : children}
    </Comp>
  );
}

export { Button, buttonVariants };

