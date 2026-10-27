import { useContext } from "react";
import { ThemeContext } from "@/components/context/theme-provider";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("Theme context is not provided.");
  }

  return context;
};
