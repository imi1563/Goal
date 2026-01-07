import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import PublicLayout from "@/layouts/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "react-hot-toast";
// Removed PWA components and context

// Public Pages
import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import TermsAndConditions from "@/pages/public/TermsAndConditions";
import PrivacyPolicy from "@/pages/public/PrivacyPolicy";
import Login from "@/pages/auth/Login";

// Dashboard Pages
import Dashboard from "@/pages/dashboard/Dashboard";
// import Analytics from "@/pages/dashboard/Analytics";
import Users from "@/pages/dashboard/Users";
import Settings from "@/pages/dashboard/Settings";
import MatchManagement from "@/pages/dashboard/match-management";
import LeagueManagement from "@/pages/dashboard/league-management";
import { ToastContainer } from "react-toastify";

// Utility Pages
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/terms-and-conditions"
            element={
              <PublicLayout>
                <TermsAndConditions />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <About />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <PublicLayout>
                <PrivacyPolicy />
              </PublicLayout>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Analytics page not implemented */}

          {/* <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </ProtectedRoute>
            }
          /> */}

          {/* <Route
            path="/dashboard/reports"
            element={
              <ProtectedRoute requiredRole="manager">
                <DashboardLayout>
                  <div className="text-center py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      Reports
                    </h1>
                    <p className="text-gray-600">
                      Reports functionality coming soon...
                    </p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/dashboard/match-management"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MatchManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/league-management"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout>
                  <LeagueManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/admin"
            element={
              // <ProtectedRoute requiredRole="admin">
              <DashboardLayout>
                <div className="text-center py-12">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Admin Panel
                  </h1>
                  <p className="text-gray-600">
                    Admin panel functionality coming soon...
                  </p>
                </div>
              </DashboardLayout>
              // </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/settings"
            element={
              // <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
              // </ProtectedRoute>
            }
          />

          {/* Utility Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* PWA removed */}
      </Router>
      <Toaster />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
