import * as React from "react";
import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field";
import RTAAS, { type TextareaAutosizeProps } from "react-textarea-autosize";

export type TextAreaProps = Omit<React.ComponentProps<"textarea">, "prefix"> & {
  label?: string;
  required?: boolean;
  err?: string;
  description?: string;
};

export type RTAASProps = Pick<
  TextAreaProps,
  "label" | "required" | "err" | "description"
> &
  TextareaAutosizeProps;

function Textarea({
  className,
  label,
  required,
  err,
  description,
  ...props
}: TextAreaProps) {
  const Wrapper = label ? Field : React.Fragment;
  return (
    <Wrapper {...(label && { className: "gap-1.5" })}>
      {label && (
        <FieldLabel>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <textarea
        data-slot="textarea"
        aria-invalid={!!err}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-transparent flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {err && <FieldError>{err}</FieldError>}
    </Wrapper>
  );
}

export const TextAreaAutoSize = ({
  label,
  err,
  required,
  description,
  className,
  ...rest
}: RTAASProps) => {
  const Wrapper = label ? Field : React.Fragment;
  return (
    <Wrapper {...(label && { className: "gap-1.5" })}>
      {label && (
        <FieldLabel>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <RTAAS
        data-slot="textarea"
        aria-invalid={!!err}
        className={cn(
          "border-input resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-transparent flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        {...rest}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {err && <FieldError>{err}</FieldError>}
    </Wrapper>
  );
};

export { Textarea };
