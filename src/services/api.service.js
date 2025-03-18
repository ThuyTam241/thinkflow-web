import instance from "./axios.customize";

const registerUserApi = (email, password, first_name, last_name) => {
  const URL_BACKEND = "/auth/v1/register";
  const data = {
    email,
    password,
    first_name,
    last_name,
  }
  return instance.post(URL_BACKEND, data);
};

export { registerUserApi };
