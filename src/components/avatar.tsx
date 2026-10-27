import { cn } from "@/lib/utils";
import {
  Avatar as ShadAvatar,
  AvatarImage,
  AvatarFallback,
  type AvatarProps as ShadAvatarProps,
  type AvatarImageProps,
  type AvatarFallbackProps,
} from "./ui/avatar";

export type AvatarProps = ShadAvatarProps & {
  src?: string;
  size?: "xs" | "sm" | "md" | "lg" | "full";
  imageProps?: Omit<AvatarImageProps, "src">;
  fallbackProps?: Omit<AvatarFallbackProps, "src">;
};

const sizes: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  full: "size-full",
};

const Avatar = ({
  src,
  size = "md",
  imageProps,
  fallbackProps,
  className,
  children,
  ...rest
}: AvatarProps) => {
  return (
    <ShadAvatar
      className={cn("flex items-center justify-center", sizes[size], className)}
      {...rest}
    >
      {children || (
        <>
          <AvatarImage src={src} {...imageProps} />
          <AvatarFallback {...fallbackProps} />
        </>
      )}
    </ShadAvatar>
  );
};

export default Avatar;
