import {
  onCreateContractCashPaymentFn,
  onCreateContractPartialOrFullDownPaymentFn,
  onCreateContractStraightMonthlyPaymentFn,
  onDeleteContractFn,
  onForfeitContractFn,
  onGetClientLotReservationFn,
  onGetContractFn,
  onGetContractsFn,
  onGetPaymentsBreakdownFn,
  type ClientLotReservationProps,
  type ContractIdProps,
  type ContractResponse,
  type PaymentsBreakdownResponse,
  type QueryIdProps,
  type QuerySearchProps,
  type ReservationResponse,
} from "@/api/query-fn.api";
import {
  useQuery,
  useQueryMutation,
  type MutationOptions,
  type QueryOptions,
} from "./useRq";
import type { NodeResponse } from "@/api/axios.api";
import type {
  CashPaymentSchema,
  PartialAndFullDownPaymentSchema,
  StraightMonthlyPaymentSchema,
} from "@/utils/schema.z";

export const useGetClientLotReservation = (
  request?: ClientLotReservationProps,
  options?: QueryOptions<NodeResponse<ReservationResponse>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["client-lot-reservation", request],
    queryFn: () => onGetClientLotReservationFn(request),
  });
};

export const useCreateContractCashPayment = (
  options?: MutationOptions<NodeResponse<string>, CashPaymentSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["create-contract-cash-payment"],
    mutationFn: onCreateContractCashPaymentFn,
  });
};

export const useCreateContractPartialOrFullDownPayment = (
  options?: MutationOptions<
    NodeResponse<string>,
    PartialAndFullDownPaymentSchema
  >,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["create-contract-partial-or-full-down-payment"],
    mutationFn: onCreateContractPartialOrFullDownPaymentFn,
  });
};

export const useCreateContractStraightMonthlyPayment = (
  options?: MutationOptions<NodeResponse<string>, StraightMonthlyPaymentSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["create-contract-straight-monthly-payment"],
    mutationFn: onCreateContractStraightMonthlyPaymentFn,
  });
};

export const useGetContracts = (
  request?: QuerySearchProps,
  options?: QueryOptions<NodeResponse<ContractResponse[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["contracts", request],
    queryFn: () => onGetContractsFn(request),
  });
};

export const useGetContract = (
  request?: QueryIdProps,
  options?: QueryOptions<NodeResponse<ContractResponse>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["contract", request],
    queryFn: () => onGetContractFn(request),
  });
};

export const useGetPaymentsBreakdown = (
  request?: ContractIdProps,
  options?: QueryOptions<NodeResponse<PaymentsBreakdownResponse>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["payments-breakdown", request],
    queryFn: () => onGetPaymentsBreakdownFn(request),
  });
};

export const useDeleteContract = (
  options?: MutationOptions<NodeResponse<string>, QueryIdProps>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["delete-contract"],
    mutationFn: onDeleteContractFn,
  });
};

export const useForfeitContract = (
  options?: MutationOptions<NodeResponse<string>, QueryIdProps>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["forfeit-contract"],
    mutationFn: onForfeitContractFn,
  });
};
