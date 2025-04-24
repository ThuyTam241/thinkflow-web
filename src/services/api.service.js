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
};

const uploadImageApi = (file) => {
  const URL_BACKEND = "/media/v1/media/images";
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
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

const getAllUserNotesApi = (nextCursor) => {
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

const updateNoteApi = (title, noteId) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}`;
  const data = {
    title,
  };
  return instance.patch(URL_BACKEND, data);
};

const updateTextNoteApi = (updateData, text_noteId) => {
  const URL_BACKEND = `/note/v1/texts/${text_noteId}`;
  return instance.patch(URL_BACKEND, updateData);
};

const uploadAttachmentApi = (file, noteId) => {
  const URL_BACKEND = "/media/v1/media/attachments";
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  bodyFormData.append("note-id", noteId);
  return instance.post(URL_BACKEND, bodyFormData, config);
};

const deleteAttachmentApi = (attachmentId) => {
  const URL_BACKEND = `media/v1/media/attachments/${attachmentId}`;
  return instance.delete(URL_BACKEND);
};

const getAttachmentApi = (fileId) => {
  const URL_BACKEND = `/media/v1/media/attachments/${fileId}`;
  return instance.get(URL_BACKEND);
};

const getAllNoteAttachmentsApi = (noteId) => {
  const URL_BACKEND = `/media/v1/media/attachments/notes/${noteId}`;
  return instance.get(URL_BACKEND);
};

const getTextNoteByNoteIdApi = (noteId) => {
  const URL_BACKEND = `/note/v1/texts/note/${noteId}`;
  return instance.get(URL_BACKEND);
};

const getTextNoteApi = (text_noteId) => {
  const URL_BACKEND = `/note/v1/texts/${text_noteId}`;
  return instance.get(URL_BACKEND);
};

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
  return instance.delete(URL_BACKEND);
};

const getAllUserArchivedResourcesApi = (page, pageSize) => {
  const URL_BACKEND = `/note/v1/notes/archived?${page ? `page=${page}&` : ""}limit=${pageSize}`;
  return instance.get(URL_BACKEND);
};

const createSummaryApi = (summary_text) => {
  const URL_BACKEND = "gen/v1/gen/summaries";
  const data = {
    summary_text,
  };
  return instance.post(URL_BACKEND, data);
};

const updateSummaryApi = (summary_id, summary_text) => {
  const URL_BACKEND = `/gen/v1/gen/summaries/${summary_id}`;
  const data = {
    summary_text,
  };
  return instance.patch(URL_BACKEND, data);
};

const uploadAudioApi = (file, noteId) => {
  const URL_BACKEND = `/media/v1/media/audios/${noteId}`;
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  return instance.post(URL_BACKEND, bodyFormData, config);
};

const updateAudioApi = (updateData, noteId) => {
  const URL_BACKEND = `/media/v1/media/audios/${noteId}`;
  return instance.patch(URL_BACKEND, updateData);
};

const deleteAudioApi = (audioId) => {
  const URL_BACKEND = `/media/v1/media/audios/${audioId}`;
  return instance.delete(URL_BACKEND);
};

const getAudioApi = (audioId) => {
  const URL_BACKEND = `/media/v1/media/audios/${audioId}`;
  return instance.get(URL_BACKEND);
};

const getAllAudioApi = (noteId) => {
  const URL_BACKEND = `/media/v1/media/audios?note-id=${noteId}&limit=100`;
  return instance.get(URL_BACKEND);
};

const createNoteShareLinkApi = (noteId, permission) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}/share/link`;
  const data = {
    permission,
  };
  return instance.post(URL_BACKEND, data);
};

const shareLinkToEmailApi = (noteId, email, permission) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}/share/email`;
  const data = {
    email,
    permission,
  };
  return instance.post(URL_BACKEND, data);
};

const getNoteMemberApi = (noteId) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}/members?limit=100`;
  return instance.get(URL_BACKEND);
};

const acceptSharedNoteApi = (token) => {
  const URL_BACKEND = `/note/v1/notes/accept/${token}`;
  return instance.post(URL_BACKEND);
};

const getAllUserSharedNotesApi = (nextCursor) => {
  const URL_BACKEND = `/note/v1/notes/shared-with-me?${nextCursor ? `cursor=${nextCursor}&` : ""}limit=8`;
  return instance.get(URL_BACKEND);
};

const updatePermissionApi = (noteId, userId, permission) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}/members/${userId}`;
  const data = {
    permission,
  };
  return instance.patch(URL_BACKEND, data);
};

const deletePermissionApi = (noteId, userId) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}/members/${userId}`;
  return instance.delete(URL_BACKEND);
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
  getAllUserNotesApi,
  createNewNoteApi,
  createNewTextNoteApi,
  updateNoteApi,
  updateTextNoteApi,
  uploadAttachmentApi,
  deleteAttachmentApi,
  getAttachmentApi,
  getAllNoteAttachmentsApi,
  getTextNoteByNoteIdApi,
  getTextNoteApi,
  archiveNoteApi,
  unArchiveNoteApi,
  deleteNoteApi,
  getAllUserArchivedResourcesApi,
  createSummaryApi,
  updateSummaryApi,
  uploadAudioApi,
  updateAudioApi,
  deleteAudioApi,
  getAudioApi,
  getAllAudioApi,
  createNoteShareLinkApi,
  shareLinkToEmailApi,
  getNoteMemberApi,
  acceptSharedNoteApi,
  getAllUserSharedNotesApi,
  updatePermissionApi,
  deletePermissionApi,
};
