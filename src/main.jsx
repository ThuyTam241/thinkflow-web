import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/auth/Login.jsx";
import RegisterPage from "./pages/auth/Register.jsx";
import { Bounce, ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ContextProvider from "./components/context/ContextProvider.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import RoleBasedRoute from "./components/routes/RoleBasedRoute.jsx";
import PublicRoute from "./components/routes/PublicRoute.jsx";
import Workspace from "./pages/Workspace.jsx";

createRoot(document.getElementById("root")).render(
  <ContextProvider>
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
          <Route path="workspace" element={<Workspace />} />
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
        theme="light"
        transition={Bounce}
      />
    </BrowserRouter>
  </ContextProvider>,
);
