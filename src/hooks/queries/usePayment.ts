import type { NodeResponse } from "@/api/axios.api";
import {
  useQuery,
  useQueryMutation,
  type MutationOptions,
  type QueryOptions,
} from "./useRq";
import type {
  AdjustReservationValiditySchema,
  PayForAllRemainingDatesSchema,
  PayForDueDateSchema,
  ReleaseAgentCommissionSchema,
  UpdatePaymentSchema,
} from "@/utils/schema.z";
import {
  onAdjustReservationValidityFn,
  onCreatePaymentAllRemainingDatesFn,
  onCreatePaymentFn,
  onGetPaymentFn,
  onReleaseAgentCommissionFn,
  onUpdatePaymentFn,
  type Payment,
  type QueryIdProps,
} from "@/api/query-fn.api";

export const useCreatePayment = (
  options?: MutationOptions<NodeResponse<string>, PayForDueDateSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["create-payment"],
    mutationFn: onCreatePaymentFn,
  });
};

export const useCreateFullPayment = (
  options?: MutationOptions<
    NodeResponse<string>,
    PayForAllRemainingDatesSchema
  >,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["create-full-payment"],
    mutationFn: onCreatePaymentAllRemainingDatesFn,
  });
};

export const useGetPayment = (
  request?: QueryIdProps,
  options?: QueryOptions<NodeResponse<Payment>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["payment", request],
    queryFn: () => onGetPaymentFn(request),
  });
};

export const useAdjustReservationValidity = (
  options?: MutationOptions<
    NodeResponse<string>,
    AdjustReservationValiditySchema
  >,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["adjust-reservation-validity"],
    mutationFn: onAdjustReservationValidityFn,
  });
};

export const useUpdatePayment = (
  options?: MutationOptions<NodeResponse<string>, UpdatePaymentSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-payment"],
    mutationFn: onUpdatePaymentFn,
  });
};

export const useReleaseAgentCommission = (
  options?: MutationOptions<NodeResponse<string>, ReleaseAgentCommissionSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["release-agent-commission"],
    mutationFn: onReleaseAgentCommissionFn,
  });
};
