import { apiClient } from "./client";

const endpoint = "/parts";

export const getPartById = (id) => apiClient.get(`${endpoint}/${id}`);

export const getTrackedParts = (id) =>
  apiClient.get(`${endpoint}/tracked/${id}`);

export const getUnTrackedParts = (id) =>
  apiClient.get(`${endpoint}/un-tracked/${id}`);

export const addPart = (id, data) =>
  apiClient.post(`${endpoint}/add/${id}`, data);

export const editPart = (id, data) =>
  apiClient.patch(`${endpoint}/edit/${id}`, data);

export const unTrackPart = (id) =>
  apiClient.patch(`${endpoint}/un-track/${id}`);

export const servicePart = (id) => apiClient.patch(`${endpoint}/service/${id}`);
