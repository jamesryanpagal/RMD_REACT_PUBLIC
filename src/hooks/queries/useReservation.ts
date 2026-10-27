import type { NodeResponse } from "@/api/axios.api";
import { useQuery, useQueryMutation, type MutationOptions } from "./useRq";
import type { ReservationSchema } from "@/utils/schema.z";
import {
  onCreateReservationFn,
  onDeleteReservationFn,
  onGetReservationFn,
  onGetReservationsFn,
  type QueryIdProps,
  type QuerySearchProps,
  type ReservationResponse,
} from "@/api/query-fn.api";

export const useGetReservations = (
  request?: QuerySearchProps,
  options?: NodeResponse<ReservationResponse[]>,
) => {
  return useQuery({
    ...options,
    queryKey: ["reservations", request],
    queryFn: () => onGetReservationsFn(request),
  });
};

export const useGetReservation = (
  request?: QueryIdProps,
  options?: NodeResponse<ReservationResponse>,
) => {
  return useQuery({
    ...options,
    queryKey: ["reservation", request],
    queryFn: () => onGetReservationFn(request),
  });
};

export const useCreateReservation = (
  options?: MutationOptions<NodeResponse<string>, ReservationSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["create-reservation"],
    mutationFn: onCreateReservationFn,
  });
};

export const useDeleteReservation = (
  options?: MutationOptions<NodeResponse<string>, QueryIdProps>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["delete-reservation"],
    mutationFn: onDeleteReservationFn,
  });
};
