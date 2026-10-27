import { cn } from "@/lib/utils";
import type React from "react";

type H1Props = React.ComponentProps<"h1"> & {
  level?: 1;
};
type H2Props = React.ComponentProps<"h2"> & {
  level?: 2;
};
type H3Props = React.ComponentProps<"h3"> & {
  level?: 3;
};
type H4Props = React.ComponentProps<"h4"> & {
  level?: 4;
};
type H5Props = React.ComponentProps<"h5"> & {
  level?: 5;
};

export type TitleProps = H1Props | H2Props | H3Props | H4Props | H5Props;

const renderTitle: Record<string, (props: any) => React.ReactNode> = {
  "1": ({ className, ...rest }) => (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
        className,
      )}
      {...rest}
    />
  ),
  "2": ({ className, ...rest }) => (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight",
        className,
      )}
      {...rest}
    />
  ),
  "3": ({ className, ...rest }) => (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
      {...rest}
    />
  ),
  "4": ({ className, ...rest }) => (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...rest}
    />
  ),
  "5": ({ className, ...rest }) => (
    <h5
      className={cn("scroll-m-20 text-lg font-bold tracking-tight", className)}
      {...rest}
    />
  ),
};

export const Title = ({ level = 3, ...props }: TitleProps) => {
  return renderTitle[level](props);
};

export const Text = ({
  className,
  secondary,
  ...rest
}: React.ComponentProps<"p"> & { secondary?: boolean }) => {
  return (
    <p
      className={cn("", secondary ? "text-secondary-color" : "", className)}
      {...rest}
    />
  );
};

export const Blockquote = ({
  className,
  ...rest
}: React.ComponentProps<"blockquote">) => {
  return (
    <blockquote className={cn("border-l-2 pl-6 italic", className)} {...rest} />
  );
};

export const TextSmall = ({
  className,
  secondary,
  ...rest
}: React.ComponentProps<"small"> & { secondary?: boolean }) => {
  return (
    <small
      className={cn(
        "text-sm leading-4 font-medium",
        secondary ? "text-secondary-color" : "",
        className,
      )}
      {...rest}
    />
  );
};
