import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Added for the 404 button fix

import Home from "../pages/Home";
import About from "../pages/About"; // 🔥 NEW: MISSION PAGE
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateGig from "../pages/CreateGig";
import GigDetails from "../pages/GigDetails";
import Inbox from "../pages/Inbox";
import Chats from "../pages/Chats";
import ChatPage from "../pages/ChatPage";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";

// 🔥 GLOBAL LOADER (REUSABLE)
const Loader = () => (
  <div className="h-screen flex items-center justify-center text-white text-lg">
    Loading...
  </div>
);

// 🔒 PROTECTED ROUTE (LOGIN REQUIRED)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
};

// 🔒 ADMIN ONLY ROUTE
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// 🔓 PREVENT LOGGED-IN USERS FROM SEEING LOGIN/REGISTER
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} /> {/* 🔥 REGISTERED MISSION PAGE */}
      <Route path="/gig/:id" element={<GigDetails />} />

      {/* AUTH (BLOCK IF LOGGED IN) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chats"
        element={
          <ProtectedRoute>
            <Chats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:id"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      {/* Create Gig */}
      <Route
        path="/create-gig"
        element={
          <AdminRoute>
            <CreateGig />
          </AdminRoute>
        }
      />

      {/* 🔥 404 FALLBACK */}
      <Route
        path="*"
        element={
          <div className="h-screen flex flex-col items-center justify-center text-white bg-black">
            <h1 className="text-6xl font-black mb-4 text-amber-500">404</h1>
            <p className="text-gray-400 mb-6 tracking-widest uppercase text-xs">System Error: Page Not Found</p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 border border-white/20 hover:border-amber-500 hover:text-amber-500 transition-all text-xs font-bold uppercase tracking-widest"
            >
              Return to Nexus
            </button>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;