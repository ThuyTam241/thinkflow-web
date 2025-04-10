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

const uploadImageApi = (file) => {
  const URL_BACKEND = "/media/v1/media/images";
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  };
  const bodyFormData = new FormData();
  bodyFormData.append("file",file)
  return instance.post(URL_BACKEND, bodyFormData, config);
};

const updateUserProfileApi = (
  first_name,
  last_name,
  gender,
  phone,
  email,
  avatar_id,
) => {
  const URL_BACKEND = "/user/v1/users/profile";
  const data = {
    first_name,
    last_name,
    gender,
    phone,
    email,
    avatar_id,
  };
  return instance.patch(URL_BACKEND, data);
};

const getAllUserNotes = (nextCursor) => {
  const URL_BACKEND = `/note/v1/notes?${nextCursor ? `cursor=${nextCursor}&` : ""}limit=8`;
  return instance.get(URL_BACKEND);
};

const createNewNoteApi = (title) => {
  const URL_BACKEND = "/note/v1/notes";
   const data = {
     title,
   };
  return instance.post(URL_BACKEND, data);
};

const createNewTextNoteApi = (text_content, noteId) => {
  const URL_BACKEND = `/note/v1/texts/note/${noteId}`;
  const data = {
    text_content,
  };
  return instance.post(URL_BACKEND, data);
};

const updateNewNoteApi = (title, noteId) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}`;
  const data = {
    title,
  };
  return instance.patch(URL_BACKEND, data);
};

const updateNewTextNoteApi = (text_content, text_noteId) => {
  const URL_BACKEND = `/note/v1/texts/${text_noteId}`;
  const data = {
    text_content,
  };
  return instance.patch(URL_BACKEND, data);
};

const getTextNoteApi = (noteId) => {
  const URL_BACKEND = `/note/v1/texts/note/${noteId}`;
  return instance.get(URL_BACKEND);
}

const archiveNoteApi = (noteId) => {
  const URL_BACKEND = `/note/v1/notes/archive/${noteId}`;
  return instance.patch(URL_BACKEND);
};

const unArchiveNoteApi = (noteId) => {
  const URL_BACKEND = `/note/v1/notes/unarchive/${noteId}`;
  return instance.patch(URL_BACKEND);
};

const deleteNoteApi = (noteId) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}`;
  return instance.patch(URL_BACKEND);
};

const getAllUserArchivedResources = (nextCursor, pageSize) => {
  const URL_BACKEND = `/note/v1/notes/archived?${nextCursor ? `cursor=${nextCursor}&` : ""}limit=${pageSize}`;
  return instance.get(URL_BACKEND);
};

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
  uploadImageApi,
  updateUserProfileApi,
  getAllUserNotes,
  createNewNoteApi,
  createNewTextNoteApi,
  updateNewNoteApi,
  updateNewTextNoteApi,
  getTextNoteApi,
  archiveNoteApi,
  unArchiveNoteApi,
  deleteNoteApi,
  getAllUserArchivedResources,
};
