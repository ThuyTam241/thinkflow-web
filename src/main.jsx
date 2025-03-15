import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Routes>
  </BrowserRouter>,
);
