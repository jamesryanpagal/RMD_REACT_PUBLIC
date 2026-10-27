import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tabs as ShadTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsProps as ShadTabsProps,
} from "@/components/ui/tabs";
import { useMemo, useState } from "react";

export type TabsItemsProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
};

export type TabsProps = ShadTabsProps & {
  items: TabsItemsProps[];
  currentTab?: TabsItemsProps["value"];
};

const Tabs = ({ currentTab, items, onValueChange, ...props }: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState(currentTab || items[0].value);

  const renderSelectedTabContent = useMemo(() => {
    return items.find(item => item.value === selectedTab)?.content || <></>;
  }, [selectedTab, items]);

  return (
    <ShadTabs
      defaultValue={selectedTab}
      {...props}
      onValueChange={e => {
        setSelectedTab(e);
        onValueChange?.(e);
      }}
    >
      <ScrollArea>
        <TabsList className="justify-start relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
          {items.map(item => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="overflow-hidden rounded-b-none border-x border-t bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              {item.icon}
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value={selectedTab}>{renderSelectedTabContent}</TabsContent>
    </ShadTabs>
  );
};

export default Tabs;
