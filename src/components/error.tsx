import Container from "./container";
import Avatar from "./avatar";
import { errorIcon } from "@/assets";
import { Text, Title } from "./typography";

const Error = () => {
  return (
    <Container
      className="h-screen"
      cornerRadius="none"
      flexDisplay
      alignItems="center"
      justifyContent="center"
      gap="none"
    >
      <Avatar src={errorIcon} className="size-20 rounded-none" />
      <Title>The app is experiencing some issues</Title>
      <Text>Please contact support.</Text>
    </Container>
  );
};

export default Error;
