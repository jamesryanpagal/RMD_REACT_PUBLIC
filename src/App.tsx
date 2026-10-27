import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./components/context/theme-provider";
import RootRoutes from "./routes/root-routes";
import AuthProvider from "./components/context/auth-provider";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <RootRoutes />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Toaster />
    </>
  );
};

export default App;
