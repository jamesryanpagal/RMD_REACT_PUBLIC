import type { NodeResponse } from "@/api/axios.api";
import { useQuery, type QueryOptions } from "./useRq";
import {
  onGetNotification,
  onGetNotificationsFn,
  type NotificationCountAndListResponse,
  type NotificationResponse,
  type NotificationsQuery,
  type QueryIdProps,
} from "@/api/query-fn.api";

export const useNotifications = (
  request?: NotificationsQuery,
  options?: QueryOptions<NodeResponse<NotificationCountAndListResponse>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["notifications", request],
    queryFn: () => onGetNotificationsFn(request),
  });
};

export const useGetNotification = (
  request: QueryIdProps,
  options?: QueryOptions<NodeResponse<NotificationResponse>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["notification", request],
    queryFn: () => onGetNotification(request),
  });
};
