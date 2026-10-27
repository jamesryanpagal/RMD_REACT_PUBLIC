import type { NodeResponse } from "@/api/axios.api";
import {
  useQuery,
  useQueryMutation,
  type MutationOptions,
  type QueryOptions,
} from "./useRq";
import {
  getUserDetailsFn,
  onAssignClientFn,
  onAssignProjectFn,
  onChangePasswordFn,
  onCreateUserFn,
  onDeleteUserFn,
  onGetUserClientsFn,
  onGetUserFn,
  onGetUserProjectsFn,
  onGetUsersFn,
  onLoginFn,
  onLogoutFn,
  onUpdateUserAccessAndFunctionsFn,
  onUpdateUserAddressDetailsFn,
  onUpdateUserPersonalDetailsFn,
  type ClientResponse,
  type LoginResponse,
  type ProjectResponse,
  type QueryIdProps,
  type QuerySearchProps,
  type User,
} from "@/api/query-fn.api";
import type {
  AssignClientSchema,
  AssignProjectSchema,
  ChangePasswordSchema,
  LoginSchema,
  PersonalDetailsSchema,
  ProjectAddressDetailsSchema,
  UpdateUserAccessAndFunctionsSchema,
  UserSchema,
} from "@/utils/schema.z";

export const useUserDetails = (options?: QueryOptions<NodeResponse<User>>) => {
  return useQuery({
    ...options,
    queryKey: ["user-details"],
    queryFn: () => getUserDetailsFn(),
  });
};

export const useLogin = (
  options?: MutationOptions<NodeResponse<LoginResponse>, LoginSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["login"],
    mutationFn: onLoginFn,
  });
};

export const useLogout = (
  options?: MutationOptions<NodeResponse<string>, null>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["logout"],
    mutationFn: onLogoutFn,
  });
};

export const useCreateUser = (
  options?: MutationOptions<NodeResponse<string>, UserSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["create-user"],
    mutationFn: onCreateUserFn,
  });
};

export const useGetUsers = (
  request?: QuerySearchProps,
  options?: QueryOptions<NodeResponse<User[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["users", request],
    queryFn: () => onGetUsersFn(request),
  });
};

export const useGetUser = (
  request?: QueryIdProps,
  options?: QueryOptions<NodeResponse<User>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["user", request],
    queryFn: () => onGetUserFn(request),
  });
};

export const useChangePassword = (
  options?: MutationOptions<NodeResponse<string>, ChangePasswordSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["change-password"],
    mutationFn: onChangePasswordFn,
  });
};

export const useUpdateUserAccessAndFunctions = (
  options?: MutationOptions<
    NodeResponse<string>,
    UpdateUserAccessAndFunctionsSchema
  >,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-user-access-and-functions"],
    mutationFn: onUpdateUserAccessAndFunctionsFn,
  });
};

export const useUpdateUserAddressDetails = (
  options?: MutationOptions<NodeResponse<string>, ProjectAddressDetailsSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-user-address-details"],
    mutationFn: onUpdateUserAddressDetailsFn,
  });
};

export const useUpdateUserPersonalDetails = (
  options?: MutationOptions<NodeResponse<string>, PersonalDetailsSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-user-personal-details"],
    mutationFn: onUpdateUserPersonalDetailsFn,
  });
};

export const useDeleteUser = (
  options?: MutationOptions<NodeResponse<string>, QueryIdProps>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["user-delete"],
    mutationFn: onDeleteUserFn,
  });
};

export const useAssignClient = (
  options?: MutationOptions<NodeResponse<string>, AssignClientSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["assign-client"],
    mutationFn: onAssignClientFn,
  });
};

export const useAssignProject = (
  options?: MutationOptions<NodeResponse<string>, AssignProjectSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["assign-project"],
    mutationFn: onAssignProjectFn,
  });
};

export const useGetUserClients = (
  request?: QueryIdProps,
  options?: QueryOptions<NodeResponse<ClientResponse[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["user-clients", request],
    queryFn: () => onGetUserClientsFn(request),
  });
};

export const useGetUserProjects = (
  request?: QueryIdProps,
  options?: QueryOptions<NodeResponse<ProjectResponse[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["user-projects", request],
    queryFn: () => onGetUserProjectsFn(request),
  });
};
