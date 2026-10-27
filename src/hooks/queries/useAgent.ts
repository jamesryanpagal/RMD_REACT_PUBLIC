import type { NodeResponse } from "@/api/axios.api";
import {
  useQuery,
  useQueryMutation,
  type MutationOptions,
  type QueryOptions,
} from "./useRq";
import type {
  AgentPersonalDetailsSchema,
  CreateAgentSchema,
  StartCommissionSchema,
} from "@/utils/schema.z";
import {
  onCreateAgentFn,
  onGetAgentCommissionBreakdownFn,
  onGetAgentCommissionsFn,
  onGetAgentFn,
  onGetAgentsFn,
  onStartAgentCommissionFn,
  onUpdateAgentPersonalDetailsFn,
  type AgentCommissionBreakdownResponse,
  type AgentCommissionResponse,
  type AgentResponse,
  type QueryAgentCommissionsProps,
  type QueryIdProps,
  type QuerySearchProps,
} from "@/api/query-fn.api";

export const useCreateAgent = (
  options?: MutationOptions<NodeResponse<string>, CreateAgentSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["create-agent"],
    mutationFn: onCreateAgentFn,
  });
};

export const useGetAgents = (
  request?: QuerySearchProps,
  options?: QueryOptions<NodeResponse<AgentResponse[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["agents", request],
    queryFn: () => onGetAgentsFn(request),
  });
};

export const useGetAgent = (
  request?: QueryIdProps,
  options?: QueryOptions<NodeResponse<AgentResponse>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["agent", request],
    queryFn: () => onGetAgentFn(request),
  });
};

export const useUpdateAgentPersonalDetails = (
  options?: MutationOptions<NodeResponse<string>, AgentPersonalDetailsSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-agent-personal-details"],
    mutationFn: onUpdateAgentPersonalDetailsFn,
  });
};

export const useGetAgentCommissions = (
  request?: QueryAgentCommissionsProps,
  options?: QueryOptions<NodeResponse<AgentCommissionResponse[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["agent-commissions", request],
    queryFn: () => onGetAgentCommissionsFn(request),
  });
};

export const useGetAgentCommission = (
  request?: QueryIdProps,
  options?: QueryOptions<NodeResponse<AgentCommissionResponse[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["agent-commission", request],
    queryFn: () => onGetAgentCommissionsFn(request),
  });
};

export const useGetAgentCommissionBreakdown = (
  request?: QueryIdProps,
  options?: QueryOptions<NodeResponse<AgentCommissionBreakdownResponse[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["agent-commission-breakdown", request],
    queryFn: () => onGetAgentCommissionBreakdownFn(request),
  });
};

export const useStartAgentCommission = (
  options?: MutationOptions<NodeResponse<string>, StartCommissionSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["start-agent-commission"],
    mutationFn: onStartAgentCommissionFn,
  });
};
