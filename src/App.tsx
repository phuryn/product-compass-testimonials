import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Embed from "@/pages/Embed";
import { AdminRoute } from "@/components/auth/AdminRoute";

// Create a client
const queryClient = new QueryClient();

// Define the router with all routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <Admin />
      </AdminRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/embed",
    element: <Embed />,
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <AuthProvider>
          {/* Router children will go here */}
        </AuthProvider>
      </RouterProvider>
    </QueryClientProvider>
  );
};

export default App;