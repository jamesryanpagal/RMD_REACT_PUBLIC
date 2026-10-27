import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMultipleState } from "./useMultipleState";

type PagePathProps = {
  includeQueryParams?: boolean;
};

export const usePagePath = (props?: PagePathProps) => {
  const { includeQueryParams } = props || {};
  const { pathname, search } = useLocation();

  const [{ currPath, rawPath, hasUrlParams }, setPath] = useMultipleState({
    currPath: pathname.split("/").filter(v => !!v)[0],
    rawPath: includeQueryParams ? pathname + (search || "") : pathname,
    hasUrlParams: pathname.split("/").filter(v => !!v).length > 1,
  });

  useEffect(() => {
    setPath({
      currPath: pathname.split("/").filter(v => !!v)[0],
      rawPath: includeQueryParams ? pathname + (search || "") : pathname,
      hasUrlParams: pathname.split("/").filter(v => !!v).length > 1,
    });
  }, [setPath, pathname, search, includeQueryParams]);

  return { currPath, rawPath, hasUrlParams };
};
