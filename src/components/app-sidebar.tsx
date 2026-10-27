import type { RoutePath } from "@/routes/page-routes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { usePagePath } from "@/hooks/usePagePath";
import { Text } from "./typography";
import { useNavigate } from "@/hooks/useNavigate";
import { useCallback } from "react";
import { Separator } from "./ui/separator";
import Container from "./container";

export type SideBarItemsProps = {
  title: string;
  url: RoutePath;
  parent?: RoutePath[];
  anchor?: string;
  icon?: React.ReactNode;
  subMenu?: SideBarItemsProps[];
};

export type SideBarGroupProps = {
  group: {
    label?: string;
    items: SideBarItemsProps[];
  };
};

export type MenuProps = {
  key: RoutePath;
  showSubMenu: (path: RoutePath, subMenu?: SideBarItemsProps[]) => boolean;
  children?: MenuProps[];
};

export type HeaderProps = {
  icon?: React.ReactNode;
  postFix?: React.ReactNode;
};

export type AppSidebarProps = {
  header?: HeaderProps;
  menu: (SideBarItemsProps | SideBarGroupProps)[];
  footer?: React.ReactNode;
  menuProps?: MenuProps[];
  enableLastPageVisited?: RoutePath[];
  routePathToSavePage?: RoutePath;
};

const AppSidebar = ({ header, menu, footer }: AppSidebarProps) => {
  const { rawPath } = usePagePath();
  const { open } = useSidebar();

  const nav = useNavigate();

  const onNavigate = useCallback(
    (path: RoutePath) => () => {
      nav({ path });
    },
    [],
  );

  const onHighlightMenu = useCallback(
    (url: string) => {
      return rawPath.includes(url);
    },
    [rawPath],
  );

  return (
    <Sidebar collapsible="icon">
      {header && (
        <SidebarHeader>
          <Container
            flexDisplay
            flexDirection="row"
            alignItems="center"
            justifyContent={open ? "start" : "center"}
            padding="none"
          >
            {header.icon}
            {open && header.postFix}
          </Container>
          <Separator className="mt-3" />
        </SidebarHeader>
      )}
      <SidebarContent>
        {menu.map((props, i) => {
          const isGroup = (props as any).hasOwnProperty("group");

          if (isGroup) {
            const { label, items } = (props as SideBarGroupProps).group || {};
            return (
              <SidebarGroup key={i}>
                {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
                {!open && i !== 0 && (
                  <Container padding="none" className="px-2">
                    <Separator className="mb-3" />
                  </Container>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map(({ title, url, icon }, j) => {
                      const isSelected = onHighlightMenu(url);
                      return (
                        <SidebarMenuItem key={j}>
                          <SidebarMenuButton
                            isActive={isSelected}
                            asChild
                            onClick={onNavigate(url)}
                            size="default"
                          >
                            <div
                              className={`${
                                !open ? "flex justify-center" : ""
                              }`}
                            >
                              {icon}
                              {open && (
                                <Text {...(!isSelected && { secondary: true })}>
                                  {title}
                                </Text>
                              )}
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          }

          const { title, icon, url } = (props as SideBarItemsProps) || {};

          const isSelected = onHighlightMenu(url);

          return (
            <SidebarMenu
              key={i}
              className={`${!open ? "flex items-center" : ""}`}
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isSelected}
                  asChild
                  onClick={onNavigate(url)}
                  size="default"
                >
                  <div className={`${!open ? "flex justify-center" : ""}`}>
                    {icon}
                    {open && (
                      <Text {...(!isSelected && { secondary: true })}>
                        {title}
                      </Text>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          );

          // const isSelected = rawPath.includes(url);
          // return (
          //   <SidebarGroup key={i}>
          //     <SidebarGroupContent>
          //       <SidebarMenu>
          //         <SidebarMenuItem>
          //           <SidebarMenuButton
          //             isActive={isSelected}
          //             asChild
          //             onClick={onNavigate(url)}
          //             size="default"
          //           >
          //             <div className={`${!open ? "flex justify-center" : ""}`}>
          //               {icon}
          //               {open && (
          //                 <Text {...(!isSelected && { secondary: true })}>
          //                   {title}
          //                 </Text>
          //               )}
          //             </div>
          //           </SidebarMenuButton>
          //         </SidebarMenuItem>
          //       </SidebarMenu>
          //     </SidebarGroupContent>
          //   </SidebarGroup>
          // );
        })}
      </SidebarContent>
      {open && <SidebarFooter>{footer || <></>}</SidebarFooter>}
    </Sidebar>
  );
};

export default AppSidebar;
