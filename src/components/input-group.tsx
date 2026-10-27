import React, { useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import type { InputProps } from "./ui/input";
import {
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
  InputGroup as ShadInputGroup,
} from "./ui/input-group";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "./ui/button";
import {
  TextAreaAutoSize,
  type RTAASProps,
  type TextAreaProps,
} from "./ui/textarea";
import { cn } from "@/lib/utils";

export type InputGroupProps = InputProps & {
  prefix?: React.ReactNode;
  postfix?: React.ReactNode;
};

export type TextAreaGroupProps = Pick<InputGroupProps, "prefix" | "postfix"> &
  (RegularTextAreaProps | AutoSizeTextAreaProps);

type RegularTextAreaProps = TextAreaProps & {
  autoSize?: false;
};

type AutoSizeTextAreaProps = RTAASProps & {
  autoSize: true;
};

const InputGroup = ({
  prefix,
  postfix,
  label,
  required,
  err,
  showErr = true,
  description,
  ...props
}: InputGroupProps) => {
  const Wrapper = label ? Field : React.Fragment;
  return (
    <Wrapper {...(label && { className: "gap-1.5" })}>
      {label && (
        <FieldLabel>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <ShadInputGroup>
        <InputGroupInput err={err} showErr={false} {...props} />
        {prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
        {postfix && (
          <InputGroupAddon align="inline-end">{postfix}</InputGroupAddon>
        )}
      </ShadInputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {err && showErr && <FieldError>{err}</FieldError>}
    </Wrapper>
  );
};

export const InputPassword = ({
  type = "password",
  ...rest
}: InputGroupProps) => {
  const [togglePassword, setTogglePassword] = useState(false);
  return (
    <InputGroup
      {...rest}
      type={togglePassword ? "text" : type}
      postfix={
        <Button
          className="-mr-1.5"
          variant="clear"
          type="button"
          prefix={!togglePassword ? <EyeClosed /> : <Eye />}
          onClick={() => setTogglePassword(prev => !prev)}
        />
      }
    />
  );
};

export const TextAreaGroup = ({
  prefix,
  postfix,
  required,
  label,
  err,
  description,
  autoSize,
  ...props
}: TextAreaGroupProps) => {
  const Wrapper = label ? Field : React.Fragment;
  return (
    <Wrapper {...(label && { className: "gap-1.5", "aria-invalid": !!err })}>
      {label && (
        <FieldLabel>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <ShadInputGroup>
        {autoSize ? (
          <TextAreaAutoSize
            data-slot="input-group-control"
            {...(props as any)}
            className={cn(
              "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
              props.className,
            )}
          />
        ) : (
          <InputGroupTextarea {...props} />
        )}
        {prefix && (
          <InputGroupAddon align="block-start">{prefix}</InputGroupAddon>
        )}
        {postfix && (
          <InputGroupAddon align="block-end">{postfix}</InputGroupAddon>
        )}
      </ShadInputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {err && <FieldError>{err}</FieldError>}
    </Wrapper>
  );
};

export default InputGroup;
