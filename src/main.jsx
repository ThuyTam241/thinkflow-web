import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from './pages/Login.jsx';
import RegisterPage from "./pages/Register.jsx";
import { Bounce, ToastContainer } from "react-toastify";
import Dashboard from './pages/Dashboard.jsx';

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Routes>
    <ToastContainer
      position="top-right"
      autoClose={5000}
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
  </BrowserRouter>,
);
