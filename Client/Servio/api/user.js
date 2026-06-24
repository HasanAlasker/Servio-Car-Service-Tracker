import { apiClient } from "./client";

const endpoint = "/users";

export const getAllUsers = () => apiClient.get(`${endpoint}/all`);

export const getDeletedUsers = () => apiClient.get(`${endpoint}/deleted`);

export const getMe = () => apiClient.get(`${endpoint}/me`);

export const countDocs = () => apiClient.get(`${endpoint}/count`);

export const adminCountDocs = () => apiClient.get(`${endpoint}/admin/count`);

export const shopCountDocs = () => apiClient.get(`${endpoint}/shopOwner/count`);

export const getUserProfile = (id) => apiClient.get(`${endpoint}/profile/${id}`);

export const getUserById = (id) => apiClient.get(`${endpoint}/${id}`);

export const registerUser = (data) =>
  apiClient.post(`${endpoint}/register`, data);

export const loginUser = (data) => apiClient.post(`${endpoint}/login`, data);

export const refreshToken = (id) =>
  apiClient.get(`${endpoint}/refreshToken/${id}`);

export const editUser = (id, data) =>
  apiClient.patch(`${endpoint}/edit/${id}`, data);

export const deleteUser = (id) => apiClient.patch(`${endpoint}/delete/${id}`);

export const undeleteUser = (id) =>
  apiClient.patch(`${endpoint}/un-delete/${id}`);

export const addPushToken = (token, platform) =>
  apiClient.post(`${endpoint}/push-token`, { token, platform });

export const removePushToken = (token) =>
  apiClient.delete(`${endpoint}/push-token/${token}`);
