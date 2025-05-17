import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/auth/Login.jsx";
import RegisterPage from "./pages/auth/Register.jsx";
import { Bounce, ToastContainer } from "react-toastify";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ContextProvider from "./components/context/ContextProvider.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import RoleBasedRoute from "./routes/RoleBasedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import Workspace from "./pages/user/Workspace.jsx";
import MyNotes from "./pages/user/MyNotes.jsx";
import SharedNotes from "./pages/user/SharedNotes.jsx";
import { useContext } from "react";
import { ThemeContext } from "./components/context/ThemeContext.jsx";
import Settings from "./pages/Settings.jsx";
import ArchivedResources from "./pages/user/ArchivedResources.jsx";
import AcceptSharedNote from "./pages/user/AcceptSharedNote.jsx";
import Notifications from "./components/ui/Notifications.jsx";

const RootApp = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route element={<PublicRoute />}>
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<RoleBasedRoute isAllowed={["user"]} />}>
          <Route path="workspace" element={<Workspace />}>
            <Route index element={<Navigate to="notes/my-notes" replace />} />
            <Route path="notes/my-notes" element={<MyNotes />} />
            <Route path="notes/shared-notes" element={<SharedNotes />} />
            <Route path="archived" element={<ArchivedResources />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="share/:token" element={<AcceptSharedNote />} />
        </Route>
        <Route element={<RoleBasedRoute isAllowed={["admin"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        transition={Bounce}
      />
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <RootApp />
  </ContextProvider>,
);
