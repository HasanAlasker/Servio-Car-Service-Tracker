import { apiClient } from "./client";

const endPoint = "/slots";

export const getSlots = (
  id,
  date, //YYYY-MM-DD
) => apiClient.get(`${endPoint}/${id}?date=${date}`);

export const checkSlot = (id, data) =>
  apiClient.post(`${endPoint}/checkSlot/${id}`, data);
