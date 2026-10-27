import type React from "react";
import {
  DropdownMenu,
  type DropdownMenuProps,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  type DropdownMenuItemProps,
} from "./ui/dropdown-menu";
import type { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { NoData } from "./ui/empty";
import Container from "./container";
import { TextSmall } from "./typography";

export type DropdownItemProps = {
  id: string;
  icon?: React.ReactNode;
  label: string;
  labelProps?: React.ComponentProps<"small"> & { secondary?: boolean };
  descriptions?: string;
  rightContent?: React.ReactNode;
  itemProps?: DropdownMenuItemProps;
  onClick?: (id: string, item?: DropdownItemProps) => void;
};

export type DropdownProps = DropdownMenuProps & {
  trigger: React.ReactNode;
  header?: React.ReactNode;
  contentProps?: DropdownMenuContentProps;
  items: (DropdownItemProps | null)[];
  empty?: React.ReactNode;
  onClick?: (id: string, item?: DropdownItemProps) => void;
};

const Dropdown = ({
  trigger,
  empty,
  items,
  header,
  contentProps,
  onClick: onGlobalClick,
  ...rest
}: DropdownProps) => {
  return (
    <DropdownMenu {...rest}>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent {...contentProps}>
        {header && (
          <>
            <DropdownMenuLabel>{header}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {!items.length
          ? empty || (
              <NoData
                title="No notifications yet."
                description="You will be notified when you have new notifications."
              />
            )
          : items.map((props, i) => {
              if (!props) {
                return <DropdownMenuSeparator key={i} />;
              }

              const {
                id,
                label,
                labelProps,
                descriptions,
                rightContent,
                icon,
                itemProps,
                onClick,
              } = props;

              return (
                <DropdownMenuItem
                  key={i}
                  onClick={() => {
                    onGlobalClick?.(id, props);
                    onClick?.(id, props);
                  }}
                  {...itemProps}
                >
                  {icon}
                  <Container
                    cornerRadius="none"
                    padding="none"
                    flexDisplay
                    flexDirection="column"
                    gap="none"
                    className="w-full py-1"
                  >
                    <TextSmall {...labelProps}>{label}</TextSmall>
                    <TextSmall>{descriptions}</TextSmall>
                  </Container>
                  {rightContent || <></>}
                </DropdownMenuItem>
              );
            })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
