import Container from "./container";
import { Button } from "./ui/button";
import Avatar from "./avatar";
import { SidebarTrigger } from "./ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import Dropdown, { type DropdownItemProps } from "./dropdown";
import { profileDropdownItems } from "@/utils/data";
import { Text, TextSmall } from "./typography";
import { onFormatNumber, onToPascalCase } from "@/utils/helper";
import { useCallback, useMemo, useState } from "react";
import { useLogout } from "@/hooks/queries/useUser";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { type OutletContextProps } from "./outlet/onboarded-routes-outlet";
import Breadcrumb from "./breadcrumb";
import ConfirmationModal from "./confirmation-modal";
import { useNavigate } from "@/hooks/useNavigate";
import type { RoutePath } from "@/routes/page-routes";
import { Bell, ChevronLeft, MessageCircle } from "lucide-react";
import { useSocketNotification } from "@/hooks/socket/useSocketNotification";
import { useNotifications } from "@/hooks/queries/useNotifications";
import {
  NOTIFICATION_TITLE_TEXT,
  NOTIFICATION_TYPE_ICON,
} from "@/utils/constants";
import { DATE_FORMAT, mtz } from "@/utils/mtz";
import { NOTIFICATION_STATUS } from "@/api/query-fn.api";
import { CounterBadge } from "./ui/badge";

export type AppHeaderProps = Pick<OutletContextProps, "outletTabs">;

const AppHeader = ({ outletTabs }: AppHeaderProps) => {
  const [toggleLogoutModal, setToggleLogoutModal] = useState(false);
  const [toggleNotificationDropdown, setToggleNotificationDropdown] =
    useState(false);
  const { userDetails, onClearState } = useAuth();
  const { onInvalidate } = useInvalidateQuery();
  const { mutateAsync: logout, isPending } = useLogout({
    onSuccess: () => {
      onClearState();
      onInvalidate(["user-details"]);
      setToggleLogoutModal(false);
    },
  });

  const { data: notifications } = useNotifications({ take: 10 });

  const { firstName, lastName, role } = userDetails || {};

  const nav = useNavigate();

  const onClickItem = (id: string) => {
    if (id === "logout") {
      setToggleLogoutModal(true);
    } else {
      nav({ path: id as RoutePath });
    }
  };

  const onBack = () => {
    const previousTabLink = outletTabs.at(-2)?.link;

    if (!previousTabLink) return;
    nav({ path: previousTabLink as RoutePath });
  };

  const onLogout = async () => {
    await logout(null);
  };

  const onNotificationListener = useCallback(() => {
    onInvalidate(["notifications"]);
  }, []);

  const notificationItems = useMemo((): (DropdownItemProps | null)[] => {
    return (
      notifications?.response?.list.map(
        ({ id, title, description, type, status, dateCreated }) => ({
          id,
          label: NOTIFICATION_TITLE_TEXT[title],
          descriptions: description,
          icon: NOTIFICATION_TYPE_ICON[type],
          labelProps: { className: "font-bold text-sm" },
          rightContent: (
            <Container
              padding="none"
              flexDisplay
              flexDirection="column"
              alignItems="end"
              gap="none"
              className="w-[120px]"
            >
              <TextSmall className="text-xs" secondary>
                {mtz(dateCreated, "defaultformat").format(
                  DATE_FORMAT.shortDateAbbrev,
                )}
              </TextSmall>
              <TextSmall className="text-xs" secondary>
                {mtz(dateCreated, "isoZulu").format(DATE_FORMAT.time12h)}
              </TextSmall>
            </Container>
          ),
          ...(status === NOTIFICATION_STATUS.UNREAD && {
            itemProps: { className: "bg-accent" },
          }),
        }),
      ) || []
    );
  }, [notifications]);

  const renderLogoutModal = useMemo(() => {
    return (
      <ConfirmationModal
        open={toggleLogoutModal}
        onOpenChange={setToggleLogoutModal}
        description="Are you sure you want to logout?"
        onCancel={() => setToggleLogoutModal(false)}
        onConfirm={onLogout}
        cancelButtonProps={{ label: "Stay Logged In", disabled: isPending }}
        confirmButtonProps={{
          label: "Logout",
          loading: isPending,
          disabled: isPending,
        }}
      />
    );
  }, [toggleLogoutModal, isPending]);

  useSocketNotification(onNotificationListener);

  return (
    <>
      <Container
        cornerRadius="none"
        flexDisplay
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        padding={{ top: "sm", right: "xl", bottom: "sm", left: "xl" }}
        className="w-full xl:self-center xl:max-w-[1496px]"
      >
        <Container
          bordered
          flexDisplay
          flexDirection="row"
          alignItems="center"
          padding="none"
          className="bg-card border-border/50 rounded-full py-2 px-3.5 shadow-2xl"
        >
          <SidebarTrigger />
          <Container bordered padding="none" className="h-5" />
          {outletTabs.length > 1 && (
            <Button variant="ghost" size="icon-xs" onClick={onBack}>
              <ChevronLeft />
            </Button>
          )}
          <Breadcrumb items={outletTabs} />
        </Container>
        <Container
          bordered
          flexDisplay
          flexDirection="row"
          alignItems="center"
          padding="none"
          className="bg-card border-border/50 rounded-full py-2 px-3.5 shadow-2xl"
        >
          <Dropdown
            modal={false}
            open={toggleNotificationDropdown}
            onOpenChange={setToggleNotificationDropdown}
            trigger={
              <Button
                variant="ghost"
                className="rounded-full text-secondary-color p-0! relative"
                size="icon-xs"
              >
                <Bell className="size-5" />
                <CounterBadge
                  count={notifications?.response?.count || 0}
                  max={9}
                />
              </Button>
            }
            contentProps={{
              align: "end",
              className: "max-h-[800px]",
            }}
            header={
              <Container
                cornerRadius="none"
                padding="none"
                className="w-full"
                flexDisplay
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text className="font-bold text-lg">Notifications</Text>
                {!!notifications?.response?.more && (
                  <Button
                    variant="link"
                    onClick={() => {
                      nav({ path: "notifications" });
                      setToggleNotificationDropdown(false);
                    }}
                  >
                    View {onFormatNumber(notifications.response.more)} more
                  </Button>
                )}
              </Container>
            }
            onClick={(id, item) =>
              nav({
                parent: ["notifications"],
                path: ":id",
                params: { id },
                query: { tabName: item?.label || "" },
              })
            }
            items={notificationItems}
          />
          <Button
            variant="ghost"
            className="rounded-full text-secondary-color p-0!"
            size="icon-xs"
          >
            <MessageCircle className="size-5" />
          </Button>
          <Dropdown
            onClick={onClickItem}
            modal={false}
            trigger={
              <Avatar
                className="bg-primary border border-border/30 rounded-full text-xs font-bold text-primary-foreground"
                size="xs"
              >
                {firstName?.[0].toUpperCase()}
                {lastName?.[0].toUpperCase()}
              </Avatar>
            }
            contentProps={{
              align: "end",
            }}
            header={
              <Container padding="none" className="h-10 w-60">
                <Text className="font-bold">{`${firstName || ""} ${
                  lastName || ""
                }`}</Text>
                <Text className="text-sm">{onToPascalCase(role || "")}</Text>
              </Container>
            }
            items={profileDropdownItems}
          />
        </Container>
      </Container>
      {renderLogoutModal}
    </>
  );
};

export default AppHeader;
