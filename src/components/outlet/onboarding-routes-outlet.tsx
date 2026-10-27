import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLayoutEffect, useState } from "react";
import { useUserDetails } from "@/hooks/queries/useUser";
import { REFRESH_TOKEN_ERROR } from "@/api/axios.api";
import AppLoading from "../app-loading";

const OnboardingRoutesOutlet = () => {
  const [isLogout, setIsLogout] = useState<boolean | null>(null);
  const { setToken } = useAuth();

  const { data, error, isLoading } = useUserDetails();

  useLayoutEffect(() => {
    if (isLoading) return;

    if (
      !data?.response ||
      error?.message === REFRESH_TOKEN_ERROR.UNAUTHORIZED ||
      error?.message === REFRESH_TOKEN_ERROR.INVALID_TOKEN
    ) {
      setIsLogout(true);
    } else {
      setToken(data?.response.accessToken || null);
      setIsLogout(false);
    }
  }, [data, error, isLoading]);

  if (isLoading) {
    return <AppLoading />;
  }

  if (isLogout === false) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default OnboardingRoutesOutlet;
