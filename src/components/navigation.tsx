import { useNavigate } from "@/hooks/useNavigate";
import Container, { type ContainerProps } from "./container";
import { Button, type ButtonProps } from "./ui/button";
import { useLocation } from "react-router-dom";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { IoMenu } from "react-icons/io5";
import { useMemo, useState } from "react";
import Drawer from "./drawer";
import { onScrollToAnchor } from "@/utils/helper";

export type NavItem = {
  label: string;
  link: string;
  buttonProps?: ButtonProps;
};

export type NavigationProps = ContainerProps & {
  items: NavItem[];
};

const Navigation = ({ items, gap = "lg", ...rest }: NavigationProps) => {
  const nav = useNavigate();
  const location = useLocation();
  const { sm } = useWindowDimension();

  const [toggleDrawer, setToggleDrawer] = useState(false);

  const urlHash = location.hash;

  const renderNavItems = useMemo(() => {
    return items.map(({ label, link, buttonProps }, i) => {
      const { className: buttonClassName, ...restButtonProps } =
        buttonProps || {};

      const isSelected = urlHash === link;

      return (
        <Container key={i} padding="none" cornerRadius="none">
          <Button
            variant="clear"
            className={`cursor-pointer rounded-none relative ${
              isSelected ? "nav-selected" : "nav"
            } ${buttonClassName || ""}`}
            style={{
              padding: 0,
            }}
            {...restButtonProps}
            onClick={() => {
              nav({ path: link as any });
              onScrollToAnchor(link.substring(1));
              setToggleDrawer(false);
            }}
          >
            {label}
          </Button>
        </Container>
      );
    });
  }, [items, urlHash, nav]);

  const renderDrawerMenu = useMemo(() => {
    return (
      <Drawer
        direction="right"
        open={toggleDrawer}
        title="Menu"
        onClose={() => setToggleDrawer(false)}
      >
        <Container flexDisplay gap="sm" className="px-[18px] py-0">
          {renderNavItems}
        </Container>
      </Drawer>
    );
  }, [toggleDrawer, renderNavItems]);

  return (
    <>
      <Container
        flexDisplay
        flexDirection="row"
        alignItems="center"
        gap={gap}
        padding="none"
        cornerRadius="none"
        {...rest}
      >
        {sm ? (
          <Button
            size="icon-lg"
            variant="secondary"
            onClick={() => setToggleDrawer(true)}
          >
            <IoMenu />
          </Button>
        ) : (
          renderNavItems
        )}
      </Container>
      {renderDrawerMenu}
    </>
  );
};

export default Navigation;
