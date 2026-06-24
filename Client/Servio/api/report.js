import { apiClient } from "./client";

const endpoint = "/reports";

export const getOpenReports = () => apiClient.get(`${endpoint}/open`);

export const getClosedReports = () => apiClient.get(`${endpoint}/closed`);

export const makeReport = (id, data) =>
  apiClient.post(`${endpoint}/create/${id}`, data);

export const closeReport = (id) => apiClient.patch(`${endpoint}/close/${id}`);
export const openReport = (id) => apiClient.patch(`${endpoint}/open/${id}`);
