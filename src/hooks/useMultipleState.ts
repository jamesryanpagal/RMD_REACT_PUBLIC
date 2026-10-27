import { useReducer } from "react";

export const useMultipleState = <T>(initialState: T) => {
  const reducer = (state: T, setter: Partial<T>) => ({
    ...state,
    ...setter,
  });
  const [state, dispatch] = useReducer(reducer, initialState);

  return [state, dispatch] as const;
};
