import { apiClient } from "./client";

const endpoint = "/suggestions";

export const getAllSuggestions = () => apiClient.get(`${endpoint}/all`);

export const makeSuggestion = (data) => apiClient.post(`${endpoint}/add`, data);

export const deleteSuggestion = (id) =>
  apiClient.delete(`${endpoint}/delete/${id}`);
