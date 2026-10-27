import {
  onApproveRequestFn,
  onGetRequestDetailsFn,
  onGetRequestsFn,
  onRejectOrDeleteRequestFn,
  type ApproveRequestProps,
  type QueryIdAndModuleProps,
  type RejectOrDeleteRequestProps,
  type RequestModuleProps,
  type RequestResponse,
} from "@/api/query-fn.api";
import {
  useQuery,
  useQueryMutation,
  type MutationOptions,
  type QueryOptions,
} from "./useRq";
import type { NodeResponse } from "@/api/axios.api";

export const useGetRequests = (
  request?: RequestModuleProps,
  options?: QueryOptions<NodeResponse<RequestResponse[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["requests", request],
    queryFn: () => onGetRequestsFn(request),
  });
};

export const useGetRequestDetails = (
  request?: QueryIdAndModuleProps,
  options?: QueryOptions<NodeResponse<RequestResponse>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["request-details", request],
    queryFn: () => onGetRequestDetailsFn(request),
  });
};

export const useApproveRequest = (
  options?: MutationOptions<NodeResponse<string>, ApproveRequestProps>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["approve-request"],
    mutationFn: onApproveRequestFn,
  });
};

export const useRejectOrDeleteRequest = (
  options?: MutationOptions<NodeResponse<string>, RejectOrDeleteRequestProps>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["reject-or-delete-request"],
    mutationFn: onRejectOrDeleteRequestFn,
  });
};
