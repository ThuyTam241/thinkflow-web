import instance from "./axios.customize";

const registerUserApi = (email, password, first_name, last_name) => {
  const URL_BACKEND = "/auth/v1/register";
  const data = {
    email,
    password,
    first_name,
    last_name,
  };
  return instance.post(URL_BACKEND, data);
};

const loginApi = (email, password) => {
  const URL_BACKEND = "/auth/v1/authenticate";
  const data = {
    email,
    password,
  };
  return instance.post(URL_BACKEND, data);
};

const forgotPasswordApi = (email) => {
  const URL_BACKEND = "/auth/v1/forgot-password";
  const data = { email };
  return instance.post(URL_BACKEND, data);
};

const resetPasswordApi = (email, otp, new_password) => {
  const URL_BACKEND = "/auth/v1/reset-password";
  const data = { email, otp, new_password };
  return instance.post(URL_BACKEND, data);
};

const verifyEmailApi = (email, otp) => {
  const URL_BACKEND = "/auth/v1/verify-email";
  const data = { email, otp };
  return instance.post(URL_BACKEND, data);
};

const resendEmailCodeApi = (email) => {
  const URL_BACKEND = "/auth/v1/verify-email/send-otp";
  const data = { email };
  return instance.post(URL_BACKEND, data);
};

const getUserProfileApi = () => {
  const URL_BACKEND = "/user/v1/users/profile";
  return instance.get(URL_BACKEND);
};

const loginFacebookApi = () => {
  window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/v1/facebook/login`);
};

const loginGoogleApi = () => {
  window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/v1/google/login`);
};

const logoutApi = () => {
  const URL_BACKEND = "/auth/v1/logout";
  return instance.post(URL_BACKEND);
}

export {
  registerUserApi,
  loginApi,
  forgotPasswordApi,
  resetPasswordApi,
  verifyEmailApi,
  resendEmailCodeApi,
  getUserProfileApi,
  loginFacebookApi,
  loginGoogleApi,
  logoutApi,
};
