import React, { useRef } from "react";
import {
  useVirtualizer,
  type PartialKeys,
  type VirtualItem,
  type VirtualizerOptions,
} from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { NoData, type EmptyProps } from "./ui/empty";
import { NotificationLoading } from "./ui/skeleton";
import type { ClassName } from "@/utils/type";

export type ListProps<T> = PartialKeys<
  Omit<
    VirtualizerOptions<HTMLDivElement, HTMLDivElement>,
    "count" | "getScrollElement"
  >,
  "scrollToFn" | "observeElementRect" | "observeElementOffset"
> & {
  items?: T[] | null;
  renderItem: (item: T, vItem: VirtualItem) => React.ReactNode;
  empty?: EmptyProps;
  isLoading?: boolean;
  className?: ClassName;
};

const List = <T,>({
  items,
  renderItem,
  empty,
  isLoading,
  className,
  ...rest
}: ListProps<T>) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    title = "No data found",
    description = "No items to be disaplyed here.",
    ...emptyProps
  } = empty || {};

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: items?.length || 0,
    getScrollElement: () => ref.current,
    ...rest,
  });

  return (
    <div
      ref={ref}
      className={cn("overflow-y-auto w-full h-[calc(100vh-84px)]", className)}
    >
      <div
        className="relative w-full"
        style={{ height: `${getTotalSize()}px` }}
      >
        {isLoading ? (
          <NotificationLoading />
        ) : !items || !items.length ? (
          <NoData title={title} description={description} {...emptyProps} />
        ) : (
          getVirtualItems().map(vItem => {
            const { key, index, size, start } = vItem;
            return (
              <div
                key={key}
                className={cn("absolute top-0 left-0 w-full")}
                style={{
                  height: `${size}px`,
                  transform: `translateY(${start}px)`,
                }}
              >
                {renderItem(items[index], vItem)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default List;
