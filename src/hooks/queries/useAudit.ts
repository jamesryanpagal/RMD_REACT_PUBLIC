import {
  onGetAuditDetailsFn,
  onGetAuditListFn,
  type AuditDetailsProps,
  type AuditDetailsResponse,
  type AuditModuleProps,
  type AuditResponse,
} from "@/api/query-fn.api";
import { useQuery, type QueryOptions } from "./useRq";
import type { NodeResponse } from "@/api/axios.api";

export const useGetAuditList = (
  request?: AuditModuleProps,
  options?: QueryOptions<NodeResponse<AuditResponse[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["audit-list", request],
    queryFn: () => onGetAuditListFn(request),
  });
};

export const useGetAuditDetails = (
  request?: AuditDetailsProps,
  options?: QueryOptions<NodeResponse<AuditDetailsResponse>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["audit-details", request],
    queryFn: () => onGetAuditDetailsFn(request),
  });
};
