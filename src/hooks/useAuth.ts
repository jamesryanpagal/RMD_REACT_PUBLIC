import { useContext } from "react";
import { AuthContext } from "@/components/context/auth-provider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("There is no context for authentication.");
  }
  return context;
};
