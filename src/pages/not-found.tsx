import { pageNotFoundImg } from "@/assets";
import Container from "@/components/container";
import { TextSmall, Title } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@/hooks/useNavigate";

const NotFound = () => {
  const nav = useNavigate();
  return (
    <Container
      cornerRadius="none"
      className="h-screen"
      flexDisplay
      alignItems="center"
      justifyContent="center"
    >
      <img src={pageNotFoundImg} height={300} width={300} />
      <Title>404 Not Found</Title>
      <TextSmall>The page you're looking for was not found</TextSmall>
      <Button onClick={() => nav({ path: "" })}>Back to Home Page</Button>
    </Container>
  );
};

export default NotFound;
