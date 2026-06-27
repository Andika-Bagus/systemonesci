import { ThemeProvider } from "@/components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { EmailSidebarProvider } from "./context/EmailSidebarContext";
import { LoadingProvider } from "./context/LoadingContext";
import { IsSubmittingContextProvider } from "./context/isSubmittingContext";
import { UserProvider } from "./context/UserContext";
import { router } from "./routes/AppRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <LoadingProvider>
        <IsSubmittingContextProvider>
          <EmailSidebarProvider>
            <UserProvider>
              <RouterProvider router={router} />
              <Toaster />
            </UserProvider>
          </EmailSidebarProvider>
        </IsSubmittingContextProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
