import React, { type PropsWithChildren } from "react";
import {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as ShadCard,
} from "./ui/card";
import type { ClassName } from "@/utils/type";

export type CardProps = PropsWithChildren & {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: ClassName;
  headerClassName?: ClassName;
  footerClassName?: ClassName;
};

const Card = ({
  title,
  description,
  action,
  header,
  footer,
  children,
  className,
  headerClassName,
  footerClassName,
}: CardProps) => {
  return (
    <ShadCard className={className || "w-full max-w-sm"}>
      {(header || title) && (
        <CardHeader className={headerClassName}>
          {header || (
            <>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
              {action && <CardAction>{action}</CardAction>}
            </>
          )}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className={footerClassName || "flex-row gap-2"}>
          {footer}
        </CardFooter>
      )}
    </ShadCard>
  );
};

export default Card;
