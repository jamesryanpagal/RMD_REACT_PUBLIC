import React from "react";

import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipTrigger,
  type TooltipProps as ShadTooltipProps,
} from "@/components/ui/tooltip";

export type TooltipProps = ShadTooltipProps & {
  trigger: React.ReactNode;
};

const Tooltip = ({ trigger, children, ...rest }: TooltipProps) => {
  return (
    <ShadTooltip {...rest}>
      <TooltipTrigger asChild className="cursor-pointer">
        {trigger}
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </ShadTooltip>
  );
};

export default Tooltip;
