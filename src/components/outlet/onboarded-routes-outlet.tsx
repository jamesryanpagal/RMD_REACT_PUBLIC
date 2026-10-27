import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLayoutEffect, useRef, useState } from "react";
import { useUserDetails } from "@/hooks/queries/useUser";
import { REFRESH_TOKEN_ERROR } from "@/api/axios.api";
import AppLoading from "../app-loading";
import AppSidebar from "../app-sidebar";
import { sidebarData } from "@/utils/data";
import { SidebarProvider } from "../ui/sidebar";
import Container from "../container";
import Avatar from "../avatar";
import { appIconFillLg } from "@/assets";
import { Text, TextSmall } from "../typography";
import AppHeader from "../app-header";
import { onToPascalCase } from "@/utils/helper";
import { usePagePath } from "@/hooks/usePagePath";
import pckg from "../../../package.json";
import { Regexp } from "@/utils/constants";

export type OutletTabsProps = {
  label: string;
  link: string;
};

export type OutletContextProps = {
  outletTabs: OutletTabsProps[];
  mainRef: React.RefObject<HTMLDivElement>;
};

const OnboardedRoutesOutlet = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isLogout, setIsLogout] = useState<boolean | null>(null);
  const { userDetails, moduleAccess, setToken, setUserDetails } = useAuth();
  const { rawPath } = usePagePath({ includeQueryParams: true });

  const { data, error, isLoading } = useUserDetails();

  const [outletTabs, setOutletTabs] = useState<
    OutletContextProps["outletTabs"]
  >([]);

  useLayoutEffect(() => {
    const formattedRawPath = rawPath.split("/").filter(p => !!p);

    setOutletTabs(
      formattedRawPath.map(frp => {
        const hasQueryParams = frp.includes("?");

        const label = !hasQueryParams
          ? onToPascalCase(frp)
          : !frp.includes("tabName")
          ? onToPascalCase(frp.replace(Regexp.cleanTabLabel, ""))
          : frp.match(Regexp.tabName)?.[1].replace(/[+]/g, " ") || "";
        const link = hasQueryParams ? frp.split("=")[0] || "" : frp;

        return {
          label,
          link,
        };
      }),
    );
  }, [rawPath]);

  useLayoutEffect(() => {
    if (isLoading) return;

    if (
      !data?.response ||
      error?.message === REFRESH_TOKEN_ERROR.UNAUTHORIZED ||
      error?.message === REFRESH_TOKEN_ERROR.INVALID_TOKEN
    ) {
      setIsLogout(true);
    } else {
      setUserDetails(data.response);
      setToken(data?.response.accessToken || null);
      setIsLogout(false);
    }
  }, [data, error, isLoading]);

  if (isLoading) {
    return <AppLoading />;
  }

  if (isLogout === true) {
    return <Navigate to="/login" replace />;
  }

  if (!moduleAccess.length) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <AppSidebar
        menu={sidebarData(moduleAccess)}
        header={{
          icon: (
            <Avatar
              className="rounded-md bg-white"
              src={appIconFillLg}
              size="lg"
            />
          ),
          postFix: (
            <Container padding="none" className="flex-1">
              <Text className="text-[18px]">
                {onToPascalCase(userDetails?.firstName || "")}{" "}
                {onToPascalCase(
                  userDetails?.lastName?.[0]?.toUpperCase() || "",
                )}
                .
              </Text>
              <Text secondary className="text-[14px]">
                {userDetails?.role ? onToPascalCase(userDetails.role) : ""}
              </Text>
            </Container>
          ),
        }}
        footer={
          <Container padding="none">
            <TextSmall secondary>v{pckg.version}</TextSmall>
          </Container>
        }
      />
      <main ref={mainRef} className="flex flex-col overflow-x-auto">
        <AppHeader outletTabs={outletTabs} />
        <Container
          padding={{ left: "xl", bottom: "sm", right: "xl", top: "sm" }}
          cornerRadius="none"
          className="w-full xl:self-center xl:max-w-[1496px]"
        >
          <Outlet context={{ outletTabs, mainRef }} />
        </Container>
      </main>
    </SidebarProvider>
  );
};

export default OnboardedRoutesOutlet;
