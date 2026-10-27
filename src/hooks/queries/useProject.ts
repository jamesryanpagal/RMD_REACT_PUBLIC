import type { NodeResponse } from "@/api/axios.api";
import {
  useQuery,
  useQueryMutation,
  type MutationOptions,
  type QueryOptions,
} from "./useRq";
import type { StepsFormProps } from "@/pages/onboarded/projects";
import {
  onAddBlockFn,
  onAddLotFn,
  onAddPhaseFn,
  onCreateProjectFn,
  onDeleteLotFn,
  onDeleteProjectFn,
  onGetProjectFn,
  onGetProjectsFn,
  onUdpateProjectAddressDetailsFn,
  onUpdateBlockTitleFn,
  onUpdateLotFn,
  onUpdatePhaseTitleFn,
  onUpdateProjectNameAndDescriptionFn,
  onUpdateThemeFn,
  type AddPhase,
  type ProjectAddressDetailsProps,
  type ProjectNameAndDescriptionProps,
  type ProjectResponse,
  type QueryIdProps,
  type QuerySearchProps,
  type UpdateThemeProps,
} from "@/api/query-fn.api";
import type {
  AddBlockSchema,
  BlockTitleSchema,
  LotSchema,
  PhaseTitleSchema,
} from "@/utils/schema.z";

export const useCreateProject = (
  options?: MutationOptions<NodeResponse<string>, StepsFormProps["formData"]>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["create-project"],
    mutationFn: onCreateProjectFn,
  });
};

export const useGetProjects = (
  request?: QuerySearchProps,
  options?: QueryOptions<NodeResponse<ProjectResponse[]>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["projects", request],
    queryFn: () => onGetProjectsFn(request),
  });
};

export const useGetProject = (
  request?: QueryIdProps,
  options?: QueryOptions<NodeResponse<ProjectResponse>>,
) => {
  return useQuery({
    ...options,
    queryKey: ["project", request],
    queryFn: () => onGetProjectFn(request),
  });
};

export const useUpdateProjectNameAndDescription = (
  options?: MutationOptions<
    NodeResponse<string>,
    ProjectNameAndDescriptionProps
  >,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-project-name-and-description"],
    mutationFn: onUpdateProjectNameAndDescriptionFn,
  });
};

export const useUpdateProjectAddressDetails = (
  options?: MutationOptions<NodeResponse<string>, ProjectAddressDetailsProps>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-project-address-details"],
    mutationFn: onUdpateProjectAddressDetailsFn,
  });
};

export const useDeleteProject = (
  options?: MutationOptions<NodeResponse<string>, QueryIdProps>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["delete-project"],
    mutationFn: onDeleteProjectFn,
  });
};

export const useUpdateLot = (
  options?: MutationOptions<NodeResponse<string>, LotSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-lot"],
    mutationFn: onUpdateLotFn,
  });
};

export const useDeleteLot = (
  options?: MutationOptions<NodeResponse<string>, QueryIdProps>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["delete-lot"],
    mutationFn: onDeleteLotFn,
  });
};

export const useUpdatePhaseTitle = (
  options?: MutationOptions<NodeResponse<string>, PhaseTitleSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-phase-title"],
    mutationFn: onUpdatePhaseTitleFn,
  });
};

export const useUpdateBlockTitle = (
  options?: MutationOptions<NodeResponse<string>, BlockTitleSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-block-title"],
    mutationFn: onUpdateBlockTitleFn,
  });
};

export const useAddLot = (
  options?: MutationOptions<NodeResponse<string>, LotSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["add-lot"],
    mutationFn: onAddLotFn,
  });
};

export const useAddBlock = (
  options?: MutationOptions<NodeResponse<string>, AddBlockSchema>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["add-block"],
    mutationFn: onAddBlockFn,
  });
};

export const useAddPhase = (
  options?: MutationOptions<NodeResponse<string>, AddPhase>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["add-phase"],
    mutationFn: onAddPhaseFn,
  });
};

export const useUpdateTheme = (
  options?: MutationOptions<NodeResponse<string>, UpdateThemeProps>,
) => {
  return useQueryMutation({
    ...options,
    mutationKey: ["update-theme"],
    mutationFn: onUpdateThemeFn,
  });
};
