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
  const URL_BACKEND = "/media/v1/images";
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
  const URL_BACKEND = `/note/v1/notes?${nextCursor ? `cursor=${nextCursor}&` : ""}limit=10`;
  return instance.get(URL_BACKEND);
};

const getNoteApi = (noteId) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}`;
  return instance.get(URL_BACKEND);
};

const createNewNoteApi = (title) => {
  const URL_BACKEND = "/note/v1/notes";
  const data = {
    title,
  };
  return instance.post(URL_BACKEND, data);
};

const createNewTextNoteApi = (text_content, text_string, noteId) => {
  const URL_BACKEND = `/note/v1/texts/note/${noteId}`;
  const data = {
    text_content: [
      {
        body: text_content,
      },
    ],
    text_string: text_string,
  };
  return instance.post(URL_BACKEND, data);
};

const updateNoteApi = (updateNoteData, noteId) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}`;
  return instance.patch(URL_BACKEND, updateNoteData);
};

const updateTextNoteApi = (updateData, text_noteId) => {
  const URL_BACKEND = `/note/v1/texts/${text_noteId}`;
  return instance.patch(URL_BACKEND, updateData);
};

const uploadAttachmentApi = (file, noteId) => {
  const URL_BACKEND = "/media/v1/attachments";
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
  const URL_BACKEND = `/media/v1/attachments/${fileId}`;
  return instance.get(URL_BACKEND);
};

const getAllNoteAttachmentsApi = (noteId) => {
  const URL_BACKEND = `/media/v1/attachments/notes/${noteId}`;
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

const createNoteSummaryApi = (noteId) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}/summary`;
  return instance.post(URL_BACKEND);
};

const createTextNoteSummaryApi = (textNoteId) => {
  const URL_BACKEND = `/note/v1/texts/${textNoteId}/summary`;
  return instance.post(URL_BACKEND);
};

const updateSummaryApi = (summary_id, summary_text) => {
  const URL_BACKEND = `/gen/v1/gen/summaries/${summary_id}`;
  const data = {
    summary_text,
  };
  return instance.patch(URL_BACKEND, data);
};

const createAudioNoteSummaryApi = (audioId) => {
  const URL_BACKEND = `/media/v1/audios/${audioId}/summary`;
  return instance.post(URL_BACKEND);
};

const uploadAudioApi = (file, noteId) => {
  const URL_BACKEND = `/media/v1/audios/note/${noteId}`;
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
  const URL_BACKEND = `/media/v1/audios/${noteId}`;
  return instance.patch(URL_BACKEND, updateData);
};

const updateTranscriptApi = (updateData, transcriptId) => {
  const URL_BACKEND = `/gen/v1/gen/transcripts/${transcriptId}`;
  const data = {
    content: updateData,
  };
  return instance.patch(URL_BACKEND, data);
};

const deleteAudioApi = (audioId) => {
  const URL_BACKEND = `/media/v1/audios/${audioId}`;
  return instance.delete(URL_BACKEND);
};

const getAudioApi = (audioId) => {
  const URL_BACKEND = `/media/v1/audios/${audioId}`;
  return instance.get(URL_BACKEND);
};

const getAllAudioApi = (noteId) => {
  const URL_BACKEND = `/media/v1/audios?note-id=${noteId}&limit=100`;
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
  const URL_BACKEND = `/note/v1/notes/shared-with-me?${nextCursor ? `cursor=${nextCursor}&` : ""}limit=10`;
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

const createMindmapApi = (noteId) => {
  const URL_BACKEND = `/note/v1/notes/${noteId}/mindmap`;
  return instance.post(URL_BACKEND);
};

const searchNotesApi = (title, nextCursor) => {
  const URL_BACKEND = `/note/v1/notes?${nextCursor ? `cursor=${nextCursor}&` : ""}limit=10&title=${encodeURIComponent(title)}`;
  return instance.get(URL_BACKEND);
};

const updateMindmapApi = (mindmapId, mindmapData) => {
  const URL_BACKEND = `/gen/v1/gen/mindmaps/${mindmapId}`;
  const data = {
    mindmap_data: mindmapData,
  };
  return instance.patch(URL_BACKEND, data);
};

const getDashboardStatsApi = () => {
  const URL_BACKEND = "/user/v1/users/dashboard/stats";
  return instance.get(URL_BACKEND);
};

const getAllUsersApi = (page = 1, limit = 10) => {
  const URL_BACKEND = `/user/v1/users?page=${page}&limit=${limit}`;
  return instance.get(URL_BACKEND);
};

const deleteUserApi = (userId) => {
  const URL_BACKEND = `/user/v1/users/${userId}`;
  return instance.delete(URL_BACKEND);
};

const createUserApi = (userData) => {
  const URL_BACKEND = "/user/v1/users";
  return instance.post(URL_BACKEND, userData);
};

const deactivateUserApi = (userId) => {
  const URL_BACKEND = `/user/v1/users/${userId}/deactivate`;
  return instance.post(URL_BACKEND);

const getListNotificationsApi = () => {
  const URL_BACKEND = "/notification/v1/notifications";
  return instance.get(URL_BACKEND);
};

const markAsReadApi = (notiId) => {
  const URL_BACKEND = `/notification/v1/notifications/${notiId}/read`;
  return instance.patch(URL_BACKEND);
};

const markAllAsReadApi = () => {
  const URL_BACKEND = `/notification/v1/notifications/read-all`;
  return instance.patch(URL_BACKEND);
};

const deleteNotiApi = (notiId) => {
  const URL_BACKEND = `/notification/v1/notifications/${notiId}`;
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
  getNoteApi,
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
  createNoteSummaryApi,
  createTextNoteSummaryApi,
  updateSummaryApi,
  createAudioNoteSummaryApi,
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
  createMindmapApi,
  updateMindmapApi,
  searchNotesApi,
  updateTranscriptApi,
  getDashboardStatsApi,
  getAllUsersApi,
  deleteUserApi,
  createUserApi,
  deactivateUserApi,
  getListNotificationsApi,
  markAsReadApi,
  markAllAsReadApi,
  deleteNotiApi,

};
