// import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import {
  // Button,
  Group,
  Input,
  NumberField,
  type NumberFieldProps,
} from "react-aria-components";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import React from "react";
import type { InputProps } from "./ui/input";
// import { Button } from "./ui/button";
// import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export type InputNumberProps = NumberFieldProps & {
  label?: string;
  err?: string;
  required?: boolean;
  description?: string;
  showErr?: boolean;
  preFix?: React.ReactNode;
  disabled?: boolean;
  inputProps?: Omit<
    InputProps,
    "label" | "required" | "err" | "description" | "showErr"
  >;
};

const InputNumber = ({
  label,
  err,
  required,
  description,
  showErr = true,
  inputProps,
  preFix,
  disabled,
  isDisabled,
  ...rest
}: InputNumberProps) => {
  const Wrapper = label ? Field : React.Fragment;
  return (
    <Wrapper {...(label && { className: "gap-1.5" })}>
      {label && (
        <FieldLabel>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <NumberField
        aria-label="input-number"
        {...rest}
        isDisabled={disabled || isDisabled}
      >
        <div className="*:not-first:mt-2" aria-invalid={!!err}>
          <Group
            aria-invalid={!!err}
            className="relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border border-input aria-invalid:border-destructive text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:opacity-50 data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40"
          >
            {preFix && (
              <div className="border-r border-r-border flex h-full min-w-10 items-center justify-center gap-2 py-1.5 text-sm select-none bg-background [&>svg:not([class*='size-'])]:size-4">
                {preFix}
              </div>
            )}
            <Input
              className="flex-1 bg-background px-3 py-2 text-foreground tabular-nums"
              {...inputProps}
            />
            {/* <div className="flex h-[calc(100%+2px)] flex-col">
              <Button
                slot="increment"
                className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronUpIcon size={12} aria-hidden="true" />
              </Button>
              <Button
                slot="decrement"
                className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input bg-background text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronDownIcon size={12} aria-hidden="true" />
              </Button>
            </div> */}
          </Group>
        </div>
      </NumberField>
      {description && <FieldDescription>{description}</FieldDescription>}
      {err && showErr && <FieldError>{err}</FieldError>}
    </Wrapper>
  );
};

export default InputNumber;
