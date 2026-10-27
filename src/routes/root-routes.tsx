import { RouterProvider } from "react-router-dom";
import router from "./page-routes";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

const RootRoutes = () => {
  const { role, moduleAccess } = useAuth();

  const routerInstance = useMemo(
    () => router(moduleAccess, role),
    [moduleAccess, role],
  );

  return <RouterProvider router={routerInstance} />;
};

export default RootRoutes;
