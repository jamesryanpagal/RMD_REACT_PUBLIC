import {
  onCreateClientFn,
  onGetClientFn,
  onGetClientsFn,
  onUpdateClientPersonalDetailsFn,
  type ClientResponse,
  type QueryIdProps,
  type QuerySearchProps,
} from "@/api/query-fn.api";
import {
  useQuery,
  useQueryMutation,
  type MutationOptions,
  type QueryOptions,
} from "./useRq";
import type { NodeResponse } from "@/api/axios.api";
import type {
  ClientPersonalDetailsSchema,
  ClientSchema,
} from "@/utils/schema.z";

export const useGetClients = (
  request?: QuerySearchProps,
  options?: QueryOptions<NodeResponse<ClientResponse[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["clients", request],
    queryFn: () => onGetClientsFn(request),
  });
};

export const useGetClient = (
  request?: QueryIdProps,
  options?: QueryOptions<NodeResponse<ClientResponse>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["client", request],
    queryFn: () => onGetClientFn(request),
  });
};

export const useUpdateClientPersonalDetails = (
  options?: MutationOptions<NodeResponse<string>, ClientPersonalDetailsSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-client-personal-details"],
    mutationFn: onUpdateClientPersonalDetailsFn,
  });
};

export const useCreateClient = (
  options?: MutationOptions<NodeResponse<string>, ClientSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["create-client"],
    mutationFn: onCreateClientFn,
  });
};
