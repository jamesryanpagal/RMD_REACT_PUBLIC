import { useQueryClient } from "@tanstack/react-query";

export const useInvalidateQuery = () => {
  const queryClient = useQueryClient();

  const onInvalidate = (key?: any[]) => {
    if (!key) {
      queryClient.invalidateQueries();
      return;
    }
    queryClient.invalidateQueries({ queryKey: key });
  };

  return { onInvalidate };
};
