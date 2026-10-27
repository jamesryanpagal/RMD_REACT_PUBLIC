import { appIconFillLg } from "@/assets";
import Avatar from "@/components/avatar";
import Container from "@/components/container";
import { InputPassword } from "@/components/input-group";
import { Text, TextSmall, Title } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginSchema } from "@/utils/schema.z";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import Alert from "@/components/alert";
import { PiWarningCircleFill } from "react-icons/pi";
import { useLogin } from "@/hooks/queries/useUser";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@/hooks/useNavigate";
import pckg from "../../../../package.json";
import { onSaveLocalStorage } from "@/utils/helper";
import { STORAGE_KEY } from "@/utils/constants";

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const { setToken, setRole, setModuleAccess } = useAuth();

  const nav = useNavigate();

  const { mutateAsync: login } = useLogin({
    onSuccess: data => {
      const { accessToken, role, moduleAccess } = data.response || {};
      setToken(accessToken || null);
      setRole(role || null);
      setModuleAccess(moduleAccess || []);
      onSaveLocalStorage(STORAGE_KEY.ROLE, role || "");
      onSaveLocalStorage(
        STORAGE_KEY.MODULE_ACCESS,
        JSON.stringify(moduleAccess || []),
      );
      nav({ path: "" });
    },
    onError: err => {
      setError("root", {
        message: err.message || "Something went wrong. Please try again.",
      });
    },
    onMutate: () => {
      clearErrors("root");
    },
  });

  const onFormSubmit = useCallback(async (props: LoginSchema) => {
    await login(props);
  }, []);

  return (
    <Container
      cornerRadius="none"
      flexDisplay
      alignItems="center"
      justifyContent="center"
      className="min-h-screen relative"
    >
      <form
        className="rounded-md shadow-2xl bg-card"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Container padding="md" className="w-[400px]" flexDisplay>
          <Container padding="none" className="h-28">
            <Avatar src={appIconFillLg} size="full" />
          </Container>
          <Container padding="none" className="flex-1 mb-4">
            <Title className="text-center text-5xl">Welcome!</Title>
            <Text className="text-center">Login to your account</Text>
          </Container>
          {errors.root?.message && (
            <Alert
              variant="destructive"
              icon={<PiWarningCircleFill />}
              title="Login Failed"
              description={errors.root.message}
            />
          )}
          <Input placeholder="Username" {...register("username")} />
          <InputPassword placeholder="Password" {...register("password")} />
          <Button
            className="mt-2"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Login
          </Button>
        </Container>
      </form>
      <Container
        className="absolute bottom-0 w-full"
        cornerRadius="none"
        flexDisplay
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <TextSmall secondary className="text-xs">
          v{pckg.version}
        </TextSmall>
      </Container>
    </Container>
  );
};

export default Login;
