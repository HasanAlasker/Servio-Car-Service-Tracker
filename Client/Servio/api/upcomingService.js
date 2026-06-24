import { apiClient } from "./client";

const endpoint = "/upcomingServices";

export const getUpcomingServices = () => apiClient.get(`${endpoint}/`);

export const isServerAwake = () => apiClient.get(`${endpoint}/wake-up`);

export const dontRemind = (id) =>
  apiClient.patch(`${endpoint}/dont-remind/${id}`);

export const remind = (id) => apiClient.patch(`${endpoint}/remind/${id}`);
