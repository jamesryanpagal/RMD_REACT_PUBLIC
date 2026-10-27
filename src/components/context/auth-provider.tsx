import {
  createContext,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { USER_ROLE } from "@/utils/type";
import { onGetLocalStorage, onRemoveLocalStorage } from "../../utils/helper";
import { STORAGE_KEY } from "../../utils/constants";
import { httpRequest } from "../../api/base-request.api";
import type { MODULE_ACCESS, User } from "@/api/query-fn.api";

export type AuthContextProps = {
  userDetails: User | null;
  token: string | null;
  role: USER_ROLE | null;
  moduleAccess: MODULE_ACCESS[];
  setUserDetails: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setRole: React.Dispatch<React.SetStateAction<USER_ROLE | null>>;
  setModuleAccess: React.Dispatch<React.SetStateAction<MODULE_ACCESS[]>>;
  onClearState: () => void;
};

export const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const httpInstance = useRef(httpRequest());
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<USER_ROLE | null>(
    (onGetLocalStorage(STORAGE_KEY.ROLE) as USER_ROLE) || null,
  );
  const [moduleAccess, setModuleAccess] = useState<MODULE_ACCESS[]>(
    (JSON.parse(
      onGetLocalStorage(STORAGE_KEY.MODULE_ACCESS) || "[]",
    ) as MODULE_ACCESS[]) || [],
  );

  useLayoutEffect(() => {
    const authInterceptors = httpInstance.current.interceptors.request.use(
      config => {
        config.headers.Authorization =
          !(config as any)._retry && token
            ? `Bearer ${token}`
            : config.headers.Authorization;

        return config;
      },
    );

    return () => {
      httpInstance.current.interceptors.request.eject(authInterceptors);
    };
  }, [token]);

  const onClearState = useCallback(() => {
    onRemoveLocalStorage(STORAGE_KEY.ROLE);
    onRemoveLocalStorage(STORAGE_KEY.MODULE_ACCESS);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        setUserDetails,
        token,
        setToken,
        role,
        setRole,
        moduleAccess,
        setModuleAccess,
        onClearState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
