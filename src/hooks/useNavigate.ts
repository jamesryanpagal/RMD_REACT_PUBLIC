import type { MODULES, REQUEST_MODULE } from "@/api/query-fn.api";
import { type RoutePath, type RouteParams } from "../routes/page-routes";
import {
  type NavigateOptions,
  useNavigate as useRRDNavigate,
} from "react-router-dom";

type ReservationQuery = {
  project?: string;
  phase?: string;
  block?: string;
  lot?: string;
  tabName?: string;
};

type RequestQuery = {
  module?: REQUEST_MODULE;
};

type AuditQuery = {
  auditModule?: MODULES;
};

type NavOptions = NavigateOptions;
type QueryOptions = ReservationQuery | RequestQuery | AuditQuery;

export type NavProps = {
  parent?: RoutePath[];
  path: RoutePath;
  params?: RouteParams;
  query?: QueryOptions;
  options?: NavOptions;
  isSubRoute?: boolean;
};

export const useNavigate = () => {
  const navigate = useRRDNavigate();

  const nav = ({
    parent,
    path,
    params,
    query,
    options,
    isSubRoute,
  }: NavProps) => {
    const joinParentPath = parent ? `${parent.join("/")}/` : "";
    const queryParams = new URLSearchParams();

    if (query) {
      Object.entries(query).map(([key, val]) => {
        queryParams.set(key, val.replace(/[ñÑ]/g, "n"));
      });
    }

    if (params) {
      const pathArr = path.split("/");
      const routePath = Object.keys(params).reduce((acc, c) => {
        const urlParamIndex = pathArr.findIndex(p => p === `:${c}`);
        pathArr.splice(urlParamIndex, 1, `${params[c as keyof RouteParams]}`);

        acc = pathArr.join("/");

        return acc;
      }, "");

      const formattedPath = `${joinParentPath}${routePath}${
        queryParams.size ? `?${queryParams.toString()}` : ""
      }`;
      navigate(`${isSubRoute ? "" : "/"}${formattedPath}`, options);
    } else {
      const formattedPath = `${joinParentPath}${path}${
        queryParams.size ? `?${queryParams.toString()}` : ""
      }`;
      navigate(`${isSubRoute ? "" : "/"}${formattedPath}`, options);
    }
  };

  return nav;
};
