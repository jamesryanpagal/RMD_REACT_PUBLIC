import { IoClose } from "react-icons/io5";
import Container from "./container";
import { Button } from "./ui/button";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Drawer as ShadDrawer,
  type DrawerProps as ShadDrawerProps,
} from "./ui/drawer";
import { Separator } from "./ui/separator";

export type DrawerProps = ShadDrawerProps & {
  title?: string;
  description?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

const Drawer = ({
  open,
  title,
  description,
  header,
  footer,
  children,
  onClose,
  ...rest
}: DrawerProps) => {
  return (
    <ShadDrawer open={open} onClose={onClose} {...rest}>
      <DrawerContent>
        <DrawerHeader>
          <Container
            padding="none"
            flexDisplay
            flexDirection="row"
            alignItems="center"
            gap="sm"
          >
            <Container className="w-full" padding="none">
              {!header ? (
                <>
                  <DrawerTitle>{title}</DrawerTitle>
                  <DrawerDescription>{description || ""}</DrawerDescription>
                </>
              ) : (
                header
              )}
            </Container>
            <Button variant="secondary" size="icon" onClick={onClose}>
              <IoClose />
            </Button>
          </Container>
        </DrawerHeader>
        <Separator className="mb-5" />
        {children}
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </ShadDrawer>
  );
};

export default Drawer;
