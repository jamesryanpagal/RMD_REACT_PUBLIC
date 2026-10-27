import { ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, type ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";
import React from "react";

export type DropdownButtonItemProps = Omit<
  DropdownButtonOptionsProps,
  "onClick"
>;

export type DropdownButtonOptionsProps = {
  id: string;
  label: string;
  description?: string;
  onClick?: (props: DropdownButtonItemProps) => void;
};

export type DropdownButtonProps = ButtonProps & {
  options: DropdownButtonOptionsProps[];
};

const DropdownButton = ({
  options,
  variant,
  className,
  disabled,
  ...rest
}: DropdownButtonProps) => {
  return (
    <div className="inline-flex divide-x divide-primary-foreground/30 rounded-md shadow-xs rtl:space-x-reverse">
      <Button
        disabled={disabled}
        variant={variant}
        className={cn("rounded-r-none", className)}
        {...rest}
      >
        {options[0].label}
      </Button>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button
            aria-label="Options"
            className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
            size="icon-sm"
            variant={variant}
            disabled={disabled}
          >
            <ChevronDownIcon aria-hidden="true" size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
          {options.slice(1).map((props, i) => {
            const { id, label, description, onClick } = props;
            return (
              <React.Fragment key={id}>
                {i !== 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem onClick={() => onClick?.(props)}>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{label}</span>
                    <span className="text-muted-foreground text-xs">
                      {description}
                    </span>
                  </div>
                </DropdownMenuItem>
              </React.Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownButton;
