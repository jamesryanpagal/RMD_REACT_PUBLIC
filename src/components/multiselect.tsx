import MultipleSelector, {
  type MultipleSelectorProps,
} from "@/components/ui/multiselect";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import React from "react";
import { EmptyMultiSelect } from "./ui/empty";
import { FaBoxOpen } from "react-icons/fa";

export type MultiSelectProps = MultipleSelectorProps & {
  label?: string;
  required?: boolean;
  description?: string;
  showErr?: boolean;
  disabled?: boolean;
};

const MultiSelect = ({
  options,
  value,
  defaultOptions,
  placeholder,
  hideClearAllButton,
  hidePlaceholderWhenSelected,
  emptyIndicator,
  label,
  err,
  required,
  showErr = true,
  description,
  disabled,
  ...rest
}: MultiSelectProps) => {
  const Wrapper = label ? Field : React.Fragment;
  return (
    <Wrapper {...(label && { className: "gap-1.5" })}>
      {label && (
        <FieldLabel className={`${disabled ? "text-secondary-color/50" : ""}`}>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <MultipleSelector
        commandProps={{
          label: "Select frameworks",
        }}
        value={value}
        defaultOptions={defaultOptions}
        options={options}
        placeholder={placeholder}
        hideClearAllButton={hideClearAllButton}
        hidePlaceholderWhenSelected={hidePlaceholderWhenSelected}
        emptyIndicator={
          emptyIndicator || (
            <EmptyMultiSelect
              title="Empty"
              icon={<FaBoxOpen />}
              description="No options can be display here."
            />
          )
        }
        disabled={disabled}
        err={err}
        {...rest}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {err && showErr && <FieldError>{err}</FieldError>}
    </Wrapper>
  );
};

export default MultiSelect;
