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

const resendEmailCodeApi = (email) => {
  const URL_BACKEND = "/auth/v1/verify-email/send-otp";
  const data = { email };
  return instance.post(URL_BACKEND, data);
};

export {
  registerUserApi,
  loginApi,
  forgotPasswordApi,
  resetPasswordApi,
  resendEmailCodeApi,
};
