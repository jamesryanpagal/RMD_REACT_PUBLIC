import * as React from "react";

import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field";

export type InputProps = Omit<React.ComponentProps<"input">, "prefix"> & {
  label?: string;
  required?: boolean;
  err?: string;
  description?: string;
  showErr?: boolean;
};

function Input({
  className,
  placeholder,
  type,
  label,
  required,
  err,
  description,
  showErr = true,
  ...props
}: InputProps) {
  const Wrapper = label ? Field : React.Fragment;

  return (
    <Wrapper {...(label && { className: "gap-1.5" })}>
      {label && (
        <FieldLabel>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <input
        placeholder={placeholder}
        type={type}
        required={false}
        aria-invalid={!!err}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground/50 selection:bg-primary selection:text-primary-foreground dark:bg-transparent border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {err && showErr && <FieldError>{err}</FieldError>}
    </Wrapper>
  );
}

export { Input };
