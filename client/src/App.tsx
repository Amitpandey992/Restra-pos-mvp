import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Tables from "./pages/Tables";
import Inventory from "./pages/Inventory";
import Menu from "./pages/Menu";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Rooms from "./pages/Rooms";
import Settings from "./pages/Settings";
import Team from "./pages/Team";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Signup from "./pages/Signup";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/team" element={<Team />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
