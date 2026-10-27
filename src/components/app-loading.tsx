import Container from "./container";
import Avatar from "./avatar";
import { appIconFillLg } from "@/assets";
import { Spinner } from "./ui/spinner";

const AppLoading = () => {
  return (
    <Container
      cornerRadius="none"
      flexDisplay
      alignItems="center"
      justifyContent="center"
      className="h-screen"
    >
      <Container padding="none" className="h-28 w-28">
        <Avatar src={appIconFillLg} size="full" />
      </Container>
      <Spinner className="size-10" />
    </Container>
  );
};

export default AppLoading;
