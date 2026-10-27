import { type PropsWithChildren } from "react";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { cn } from "@/lib/utils";
import type { ClassName, Sizes } from "@/utils/type";

type PaddingSize = Extract<Sizes, "sm" | "md" | "lg" | "xl"> | "none";
type ShadowSize = Extract<Sizes, "sm" | "md" | "lg">;
type GapSize = Extract<Sizes, "sm" | "md" | "lg"> | "none";
type BorderWidthSize = Extract<Sizes, "sm" | "md" | "lg">;
type CornerRadiusSize = Extract<Sizes, "sm" | "md" | "lg"> | "full" | "none";

export type ContainerPaddingProps = {
  top?: PaddingSize;
  right?: PaddingSize;
  bottom?: PaddingSize;
  left?: PaddingSize;
};

export type ShadowValue = {
  blur: number;
  spread: number;
};

export type ContainerProps = PropsWithChildren &
  React.HTMLAttributes<HTMLDivElement> & {
    bordered?: boolean;
    borderWidth?: BorderWidthSize;
    cornerRadius?: CornerRadiusSize;
    flexDisplay?: boolean;
    flexDirection?: React.CSSProperties["flexDirection"];
    gap?: GapSize;
    padding?: ContainerPaddingProps | PaddingSize;
    alignItems?: React.CSSProperties["alignItems"];
    justifyContent?: React.CSSProperties["justifyContent"];
    shadow?: ShadowSize;
    borderStyle?: React.CSSProperties["borderStyle"];
    sm?: Partial<Omit<ContainerProps, "sm" | "md" | "lg">>;
    md?: Partial<Omit<ContainerProps, "sm" | "md" | "lg">>;
    lg?: Partial<Omit<ContainerProps, "sm" | "md" | "lg">>;
    ref?: React.Ref<HTMLDivElement>;
  };

const paddingSize: Record<PaddingSize, ClassName> = {
  none: "p-0",
  sm: "p-2.5",
  md: "p-5",
  lg: "p-7",
  xl: "p-10",
};

const paddingTopSize: Record<PaddingSize, ClassName> = {
  none: "p-0",
  sm: "pt-2.5",
  md: "pt-5",
  lg: "pt-7",
  xl: "pt-10",
};

const paddingRightSize: Record<PaddingSize, ClassName> = {
  none: "p-0",
  sm: "pr-2.5",
  md: "pr-5",
  lg: "pr-7",
  xl: "pr-10",
};

const paddingBottomSize: Record<PaddingSize, ClassName> = {
  none: "p-0",
  sm: "pb-2.5",
  md: "pb-5",
  lg: "pb-7",
  xl: "pb-10",
};

const paddingLeftSize: Record<PaddingSize, ClassName> = {
  none: "p-0",
  sm: "pl-2.5",
  md: "pl-5",
  lg: "pl-7",
  xl: "pl-10",
};

const gapSize: Record<GapSize, ClassName> = {
  none: "gap-0",
  sm: "gap-2.5",
  md: "gap-5",
  lg: "gap-7",
};

const borderSize: Record<BorderWidthSize, ClassName> = {
  sm: "border",
  md: "border-2",
  lg: "border-4",
};

const cornerRadiusSize: Record<CornerRadiusSize, ClassName> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const Container = ({
  bordered,
  borderWidth = "sm",
  flexDisplay = false,
  flexDirection = "column",
  cornerRadius = "md",
  gap = "sm",
  padding = "sm",
  alignItems,
  justifyContent = "start",
  // borderStyle = "solid",
  className,
  sm: smProps,
  md: mdProps,
  lg: lgProps,
  ref,
  ...rest
}: ContainerProps) => {
  const { sm: wsm, md: wmd, lg: wlg } = useWindowDimension();

  const sm = wsm ? smProps : {};
  const md = wmd ? mdProps : {};
  const lg = wlg ? lgProps : {};

  const paddingProps = sm?.padding || md?.padding || lg?.padding || padding;
  const flexDisplayProps =
    sm?.flexDisplay || md?.flexDisplay || lg?.flexDisplay || flexDisplay;
  const flexDirectionProps =
    sm?.flexDirection ||
    md?.flexDirection ||
    lg?.flexDirection ||
    flexDirection;
  const gapProps = sm?.gap || md?.gap || lg?.gap || gap;
  const alignItemsProps =
    sm?.alignItems || md?.alignItems || lg?.alignItems || alignItems;
  const justifyContentProps =
    sm?.justifyContent ||
    md?.justifyContent ||
    lg?.justifyContent ||
    justifyContent;
  const borderedProps =
    sm?.bordered || md?.bordered || lg?.bordered || bordered;
  const borderWidthProps =
    sm?.borderWidth || md?.borderWidth || lg?.borderWidth || borderWidth;
  // ? to be implemented in the future
  // ? ====================================
  // const borderStyleProps =
  //   sm?.borderStyle || md?.borderStyle || lg?.borderStyle || borderStyle;
  // ? ====================================
  const cornerRadiusProps =
    sm?.cornerRadius || md?.cornerRadius || lg?.cornerRadius || cornerRadius;

  return (
    <div
      ref={ref}
      className={cn(
        typeof paddingProps === "string"
          ? paddingSize[paddingProps]
          : `${paddingTopSize[paddingProps.top as string] || ""} ${
              paddingBottomSize[paddingProps.bottom as string] || ""
            } ${paddingRightSize[paddingProps.right as string] || ""} ${
              paddingLeftSize[paddingProps.left as string] || ""
            }`,
        flexDisplayProps && "flex",
        flexDirectionProps && flexDirectionProps === "row"
          ? "flex-row"
          : flexDirectionProps === "row-reverse"
          ? "flex-row-reverse"
          : flexDirectionProps === "column-reverse"
          ? "flex-col-reverse"
          : "flex-col",
        gapProps && gapSize[gapProps],
        alignItemsProps
          ? alignItemsProps === "center"
            ? "items-center"
            : alignItemsProps === "end"
            ? "items-end"
            : "items-start"
          : "",
        justifyContentProps && justifyContentProps === "center"
          ? "justify-center"
          : justifyContentProps === "end"
          ? "justify-end"
          : justifyContentProps === "space-between"
          ? "justify-between"
          : justifyContentProps === "justify-around"
          ? "justify-around"
          : "justify-start",
        borderedProps
          ? borderWidthProps
            ? borderSize[borderWidthProps]
            : "border border-border"
          : "",
        // "border border-border",
        cornerRadiusProps && cornerRadiusSize[cornerRadiusProps],
        className,
      )}
      {...rest}
    />
  );
};

export default Container;
