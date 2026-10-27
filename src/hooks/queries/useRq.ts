import {
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseMutationOptions,
  type UseQueryOptions,
  useInfiniteQuery as useRQInfiniteQuery,
  useMutation as useRQMutation,
  useQuery as useRQQuery,
} from "@tanstack/react-query";

export type MutationOptions<Data, Var, Cntx = any> = UseMutationOptions<
  Data,
  Error,
  Var,
  Cntx
>;

export type QueryOptions<Data, Key extends QueryKey = any[]> = UseQueryOptions<
  Data,
  Error,
  Data,
  Key
>;

export type InfiniteQueryOptions<
  Data,
  Key extends QueryKey = any[],
> = UseInfiniteQueryOptions<Data, Error, Data, Key, number>;

// mutation query
export const useQueryMutation = <Data, Params, Cntx = any>({
  ...rest
}: MutationOptions<Data, Params, Cntx>) => {
  const { mutateAsync: rqMutateAsync, ...restMutate } = useRQMutation({
    gcTime: Infinity,
    ...rest,
    // to interupt request
    // data result manipulation
  });

  const mutateAsync = async (params: Params) => {
    return rqMutateAsync(params);
  };

  return { mutateAsync, ...rest, ...restMutate };
};

// query
export const useQuery = <Data, Key extends QueryKey = any[]>({
  ...rest
}: QueryOptions<Data, Key>) => {
  const result = useRQQuery({
    // staleTime: DEFAULTS.staleTime,
    // refetchInterval: DEFAULTS.staleTime,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...rest,
  });

  const key = rest.queryKey[0] as string;

  return { key, ...result };
};

// infinite query
export const useInfiniteQuery = <Data, Key extends QueryKey = any[]>({
  ...rest
}: InfiniteQueryOptions<Data, Key>) => {
  const result = useRQInfiniteQuery({
    ...rest,
  });
  const queryKey = rest.queryKey[0] as string;
  return { queryKey, ...result };
};
