import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { onFormatNumber } from "@/utils/helper";

export type BadgeVariants =
  | "default"
  | "secondary"
  | "destructive"
  | "pending"
  | "ongoing"
  | "sold"
  | "outline-default"
  | "outline-secondary"
  | "outline-destructive"
  | "outline-pending"
  | "outline-ongoing"
  | "outline-sold"
  | "outline";

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

export type CounterBadgeProps = Pick<BadgeProps, "variant"> & {
  count: number;
  max?: number;
};

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        pending:
          "border-transparent bg-mac-and-cheese text-secondary-foreground [a&]:hover:bg-secondary/90",
        ongoing:
          "border-transparent bg-primary text-secondary-foreground [a&]:hover:bg-secondary/90",
        sold: "border-transparent bg-success text-background dark:text-secondary-foreground [a&]:hover:bg-secondary/90",

        "outline-default":
          "border-dodger-blue text-dodger-blue [a&]:hover:bg-primary/90",
        "outline-secondary":
          "border-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        "outline-destructive":
          "border-destructive text-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        "outline-pending":
          "border-mac-and-cheese text-mac-and-cheese [a&]:hover:bg-secondary/90",
        "outline-ongoing":
          "border-primary text-primary [a&]:hover:bg-secondary/90",
        "outline-sold":
          "border-success text-success dark:border-turtle-green dark:text-turtle-green [a&]:hover:bg-secondary/90",

        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

function CounterBadge({
  count,
  max,
  variant = "destructive",
}: CounterBadgeProps) {
  return (
    <Badge
      variant={variant}
      className="absolute -top-2 -right-1.5 text-[10px] pb-0 pt-px px-1.5 h-auto w-auto"
    >
      {count > (max || 0)
        ? `${onFormatNumber(max || 0)}+`
        : onFormatNumber(count)}
    </Badge>
  );
}

export { Badge, badgeVariants, CounterBadge };
