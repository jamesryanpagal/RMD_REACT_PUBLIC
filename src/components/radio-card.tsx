import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
} from "./ui/radio-group";

export type RadioCardProps = RadioGroupProps & {
  options: RadioCardOptions[];
};

export type RadioCardOptions = {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  props?: React.ComponentProps<"div">;
};

const RadioCard = ({ options, ...rest }: RadioCardProps) => {
  return (
    <RadioGroup {...rest}>
      {options.map(({ id, label, value, icon, props }) => {
        const { className, ...restProps } = props || {};
        return (
          <div
            key={id}
            className={cn(
              "w-[100px] relative flex cursor-pointer flex-col items-center gap-3 rounded-md border border-border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50 has-data-[state=checked]:border-primary-foreground has-data-[state=checked]:ring-1 has-data-[state=checked]:ring-primary has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary-foreground/5",
              className,
            )}
            {...restProps}
          >
            <RadioGroupItem id={id} value={value} className="sr-only" />
            {icon}
            <Label
              htmlFor={id}
              className="cursor-pointer text-xs leading-none font-medium text-foreground after:absolute after:inset-0"
            >
              {label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default RadioCard;
