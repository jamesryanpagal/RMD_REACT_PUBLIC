import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export type SpinnerProps = React.ComponentProps<"svg">;

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <Loader
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
