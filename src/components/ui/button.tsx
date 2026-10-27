import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export type ButtonProps = Omit<React.ComponentProps<"button">, "prefix"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    prefix?: React.ReactNode;
    postfix?: React.ReactNode;
  };

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        success: "bg-success text-primary-foreground hover:bg-success/90",
        "ghost-success":
          "bg-transparent text-success dark:text-turtle-green hover:bg-success/20",
        "secondary-success":
          "bg-success/20 text-success dark:text-turtle-green hover:bg-success/30",
        "outline-destructive":
          "bg-transparent text-destructive border border-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:hover:bg-input/20",
        secondary:
          "bg-secondary-color/20 hover:bg-secondary-color/30 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-input/20",
        link: "text-primary underline-offset-4 hover:underline",
        clear: "bg-transparent",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-4",
        xs: "h-6 rounded-sm px-2 has-[>svg]:px-1.5",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  loading,
  prefix,
  postfix,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading ? <Spinner /> : prefix || <></>}
      {children}
      {!loading && postfix && postfix}
    </Comp>
  );
}

export { Button, buttonVariants };
