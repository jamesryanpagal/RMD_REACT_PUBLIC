import { NOTIFICATION_STATUS } from "@/api/query-fn.api";
import Container from "@/components/container";
import List from "@/components/list";
import { TextSmall, Title } from "@/components/typography";
import { useNotifications } from "@/hooks/queries/useNotifications";
import { useNavigate } from "@/hooks/useNavigate";
import { cn } from "@/lib/utils";
import {
  NOTIFICATION_TITLE_TEXT,
  NOTIFICATION_TYPE_ICON,
} from "@/utils/constants";
import { DATE_FORMAT, mtz } from "@/utils/mtz";

const Notifications = () => {
  const { data: notifications, isLoading } = useNotifications();
  const nav = useNavigate();

  return (
    <Container cornerRadius="none" flexDisplay padding="none">
      <Container
        className="w-full lg:w-[70%] self-center"
        padding="none"
        cornerRadius="none"
      >
        <List
          items={notifications?.response?.list}
          renderItem={({
            id,
            title,
            type,
            description,
            dateCreated,
            status,
          }) => {
            return (
              <Container
                padding={{ left: "md", right: "md" }}
                bordered
                flexDisplay
                flexDirection="row"
                alignItems="center"
                className={cn(
                  "h-[64px] shadow-2xl border-border/50 cursor-pointer hover:bg-accent",
                  status === NOTIFICATION_STATUS.UNREAD
                    ? "bg-accent"
                    : "bg-white",
                )}
                onClick={() => {
                  nav({
                    parent: ["notifications"],
                    path: ":id",
                    params: { id },
                    query: { tabName: NOTIFICATION_TITLE_TEXT[title] || "" },
                  });
                }}
              >
                {NOTIFICATION_TYPE_ICON[type]}
                <Container
                  padding="none"
                  cornerRadius="none"
                  flexDisplay
                  gap="none"
                  className="flex-1"
                >
                  <Title level={5}>{NOTIFICATION_TITLE_TEXT[title]}</Title>
                  <TextSmall>{description}</TextSmall>
                </Container>
                <Container padding="none" flexDisplay gap="none">
                  <TextSmall className="text-xs" secondary>
                    {mtz(dateCreated, "defaultformat").format(
                      DATE_FORMAT.shortDateAbbrev,
                    )}
                  </TextSmall>
                  <TextSmall className="text-xs" secondary>
                    {mtz(dateCreated, "isoZulu").format(DATE_FORMAT.time12h)}
                  </TextSmall>
                </Container>
              </Container>
            );
          }}
          isLoading={isLoading}
          estimateSize={() => 64}
          gap={5}
        />
      </Container>
    </Container>
  );
};

export default Notifications;
