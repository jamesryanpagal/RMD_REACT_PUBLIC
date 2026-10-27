import { useId } from "react";

import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
} from "@/components/ui/radio-group";
import type { DropdownItemProps } from "./dropdown";
import { cn } from "@/lib/utils";

export type RadioButtonGroupItemsProps = Pick<
  DropdownItemProps,
  "icon" | "id" | "label"
> & {
  value: string;
};

export type RadioButtonGroupProps = RadioGroupProps & {
  items: RadioButtonGroupItemsProps[];
};

const RadioButtonGroup = ({
  items,
  className,
  ...rest
}: RadioButtonGroupProps) => {
  const id = useId();

  return (
    <RadioGroup
      className={cn("flex flex-wrap gap-2", className)}
      defaultValue="1"
      {...rest}
    >
      {items.map(({ value, icon, label }) => (
        <div
          key={`${id}-${value}`}
          className="relative flex flex-col items-start gap-4 border border-input cursor-pointer py-1.5 px-2 rounded-full shadow-xs outline-none has-data-[state=checked]:border-dodger-blue"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem
              id={`${id}-${value}`}
              value={value}
              className="after:absolute after:inset-0 sr-only"
            />
            <Label htmlFor={`${id}-${value}`}>
              {icon}
              {label}
            </Label>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
};

export default RadioButtonGroup;
