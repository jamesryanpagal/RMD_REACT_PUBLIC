import Container from "@/components/container";
import { Text, Title } from "@/components/typography";
import { lockDarkIcon } from "@/assets";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@/hooks/useNavigate";
import { useInvalidateQuery } from "@/hooks/useInvalidateQuery";
import { useLogout } from "@/hooks/queries/useUser";
import { useAuth } from "@/hooks/useAuth";

const NoAccess = () => {
  const nav = useNavigate();
  const { onClearState } = useAuth();
  const { onInvalidate } = useInvalidateQuery();

  const { mutateAsync: logout, isPending } = useLogout({
    onSuccess: () => {
      onClearState();
      onInvalidate(["user-details"]);
    },
  });

  const onReload = () => {
    onInvalidate(["user-details"]);
    nav({ path: "" });
  };

  const onLogout = async () => {
    await logout(null);
  };

  return (
    <Container
      flexDisplay
      alignItems="center"
      justifyContent="center"
      className="h-screen"
    >
      <Container
        flexDisplay
        justifyContent="center"
        alignItems="center"
        className="w-[400px]"
      >
        <div
          className="h-20 w-20 bg-center bg-cover rounded-full bg-mac-and-cheese my-5"
          style={{
            backgroundImage: `url(${lockDarkIcon})`,
          }}
        />
        <Title className="text-center">
          This page is restricted to authorized users only.
        </Title>
        <Text secondary className="text-center">
          You must have the necessary permissions and access rights. Contact RMD
          Land Support to request access at{" "}
          <span className="text-dodger-blue underline underline-offset-4">
            support@example.com
          </span>
        </Text>
        <Separator className="my-3" />
        <Container
          padding="none"
          flexDisplay
          flexDirection="row"
          alignItems="center"
        >
          <Button
            variant="destructive"
            disabled={isPending}
            loading={isPending}
            onClick={onLogout}
          >
            I Understand
          </Button>
          <Button onClick={onReload} disabled={isPending}>
            Reload
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default NoAccess;
