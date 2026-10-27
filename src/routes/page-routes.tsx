import {
  createBrowserRouter as browserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import ComponentsOverview from "@/pages/components-overview";
import Agents from "@/pages/onboarded/agents";
import AuditTrail from "@/pages/onboarded/audit-trail";
import Clients from "@/pages/onboarded/clients";
import Contracts from "@/pages/onboarded/contracts";
import Projects from "@/pages/onboarded/projects";
import Requests from "@/pages/onboarded/requests";
import Reservations from "@/pages/onboarded/reservations";
import Users from "@/pages/onboarded/users";
import OnboardedRoutesOutlet from "@/components/outlet/onboarded-routes-outlet";
import Login from "@/pages/onboarding/login";
import NotFound from "@/pages/not-found";
import OnboardingRoutesOutlet from "@/components/outlet/onboarding-routes-outlet";
import Error from "@/components/error";
import Project from "@/pages/onboarded/projects/project";
import Settings from "@/pages/onboarded/settings";
import Client from "@/pages/onboarded/clients/client";
import Reservation from "@/pages/onboarded/reservations/reservation";
import { USER_ROLE } from "@/utils/type";
import type { MODULE_ACCESS } from "@/api/query-fn.api";
import NoAccess from "@/pages/no-access";
import User from "@/pages/onboarded/users/user";
import Agent from "@/pages/onboarded/agents/agent";
import Contract from "@/pages/onboarded/contracts/contract";
import Request from "@/pages/onboarded/requests/request";
import Audit from "@/pages/onboarded/audit-trail/audit";
import Notifications from "@/pages/onboarded/notifications";
import Notification from "@/pages/onboarded/notifications/notification";
import PageOutlet from "@/components/outlet/page-outlet";

export type OnboardedRoutePath =
  | "agents"
  | "audittrail"
  | "clients"
  | "projects"
  | ":id"
  | "requests"
  | "reservations"
  | "users"
  | "contracts"
  | "settings"
  | "noaccess"
  | "notifications";

export type OnboardingRoutePath = "login";

export type RoutePath =
  | ""
  | "/"
  | "*"
  | "overview"
  | OnboardingRoutePath
  | OnboardedRoutePath;
export type RouteParams = { id: string };

type BrowserRouterProps = Omit<RouteObject, "path" | "children"> & {
  path?: RoutePath;
  children?: BrowserRouterProps[];
};

const createBrowserRouter = (props: BrowserRouterProps[]) =>
  browserRouter(props as RouteObject[]);

const protectedRoutes: BrowserRouterProps[] = [
  {
    path: "projects",
    element: <PageOutlet />,
    children: [
      {
        path: "",
        element: <Projects />,
      },
      {
        path: ":id",
        element: <Project />,
      },
    ],
  },
  {
    path: "reservations",
    element: <PageOutlet />,
    children: [
      {
        path: "",
        element: <Reservations />,
      },
      {
        path: ":id",
        element: <Reservation />,
      },
    ],
  },
  {
    path: "clients",
    element: <PageOutlet />,
    children: [
      {
        path: "",
        element: <Clients />,
      },
      {
        path: ":id",
        element: <Client />,
      },
    ],
  },
  {
    path: "agents",
    element: <PageOutlet />,
    children: [
      {
        path: "",
        element: <Agents />,
      },
      {
        path: ":id",
        element: <Agent />,
      },
    ],
  },
  {
    path: "users",
    element: <PageOutlet />,
    children: [
      {
        path: "",
        element: <Users />,
      },
      {
        path: ":id",
        element: <User />,
      },
    ],
  },
  {
    path: "contracts",
    element: <PageOutlet />,
    children: [
      {
        path: "",
        element: <Contracts />,
      },
      {
        path: ":id",
        element: <Contract />,
      },
    ],
  },
  {
    path: "audittrail",
    element: <PageOutlet />,
    children: [
      {
        path: "",
        element: <AuditTrail />,
      },
      {
        path: ":id",
        element: <Audit />,
      },
    ],
  },
  {
    path: "requests",
    element: <PageOutlet />,
    children: [
      {
        path: "",
        element: <Requests />,
      },
      {
        path: ":id",
        element: <Request />,
      },
    ],
  },
];

const globalRoutes: BrowserRouterProps[] = [
  {
    path: "settings",
    element: <Settings />,
  },
  {
    path: "notifications",
    element: <PageOutlet />,
    children: [
      {
        path: "",
        element: <Notifications />,
      },
      {
        path: ":id",
        element: <Notification />,
      },
    ],
  },
];

const renderRoleBaseRoutes = (
  moduleAccess: MODULE_ACCESS[],
): BrowserRouterProps[] => {
  const filteredRoutes = protectedRoutes.filter(pr =>
    moduleAccess.includes(pr.path?.toUpperCase() as MODULE_ACCESS),
  );
  const initialRoute = filteredRoutes[0]?.path || "";

  const routesAccess: BrowserRouterProps[] = [
    { path: "", element: <Navigate to={initialRoute} /> },
    ...filteredRoutes,
    ...globalRoutes,
  ];

  return routesAccess;
};

const renderNoAccessRoutes: BrowserRouterProps[] = [
  {
    path: "",
    element: <Navigate to="noaccess" />,
  },
  {
    path: "noaccess",
    element: <NoAccess />,
  },
];

const router = (moduleAccess: MODULE_ACCESS[], role?: USER_ROLE | null) => {
  const noAccessRoutes = !moduleAccess.length;
  return createBrowserRouter([
    {
      path: "/",
      element: <OnboardedRoutesOutlet />,
      errorElement: <Error />,
      children:
        !role || noAccessRoutes
          ? renderNoAccessRoutes
          : renderRoleBaseRoutes(moduleAccess),
    },
    {
      path: "login",
      element: <OnboardingRoutesOutlet />,
      children: [
        {
          path: "",
          element: <Login />,
        },
      ],
    },
    {
      path: "overview",
      element: <ComponentsOverview />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
};

export default router;
