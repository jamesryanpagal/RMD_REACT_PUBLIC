import type { EmailLogsResponse, QueryIdProps } from "@/api/query-fn.api";
import Container from "@/components/container";
import { Text, TextSmall } from "@/components/typography";
import { ProjectLoading } from "@/components/ui/skeleton";
import { useGetNotification } from "@/hooks/queries/useNotifications";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { onFormatFullName } from "@/utils/helper";
import { DATE_FORMAT, mtz } from "@/utils/mtz";
import { onPurifyHtml } from "@/utils/purifyer";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Notification = () => {
  const { id } = useParams<QueryIdProps>();
  const {
    data: notification,
    isLoading,
    isSuccess,
  } = useGetNotification({ id: id! });

  const { onInvalidate } = useInvalidateQuery();

  const { resendData, client, dateCreated } =
    (notification?.response as EmailLogsResponse) || {};

  const { to, subject, html } = resendData || {};

  const clientName =
    client &&
    onFormatFullName(client.firstName, client.lastName, client.middleName);

  useEffect(() => {
    if (isSuccess) {
      onInvalidate(["notifications"]);
    }
  }, [isSuccess]);

  if (isLoading) {
    return <ProjectLoading />;
  }

  return (
    <Container padding="none" cornerRadius="none" flexDisplay>
      <Container
        padding="none"
        flexDisplay
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text className="font-bold">
          <TextSmall className="mr-2">Subject:</TextSmall>
          {subject}
        </Text>
        <TextSmall>
          {mtz(dateCreated, "defaultformat").format(DATE_FORMAT.fullDateAbbrev)}
        </TextSmall>
      </Container>
      {clientName && (
        <Text className="font-bold">
          <TextSmall className="mr-10">To:</TextSmall>
          {clientName}
        </Text>
      )}
      <Text className="font-bold">
        <TextSmall className="mr-5">Email:</TextSmall>
        {to}
      </Text>
      <div
        className="email-content"
        dangerouslySetInnerHTML={{ __html: onPurifyHtml(html) }}
      />
    </Container>
  );
};

export default Notification;
