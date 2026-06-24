import { apiClient } from "./client";

const endpoint = "/appointments";

export const getAllAppointments = () => apiClient.get(`${endpoint}/all`);

export const getPastAppointments = () => apiClient.get(`${endpoint}/past`);

export const getCompletedAppointmentsForUser = () =>
  apiClient.get(`${endpoint}/completed`);

export const getCallToAction = () =>
  apiClient.get(`${endpoint}/call-to-action`);

export const getCarHistory = (id) => apiClient.get(`${endpoint}/history/${id}`);

export const getUpcomingAppointments = () =>
  apiClient.get(`${endpoint}/upcoming`);

export const getConfirmedAppointments = (id) =>
  apiClient.get(`${endpoint}/confirmed/${id}`);

export const getPendingAppointments = (id) =>
  apiClient.get(`${endpoint}/pending/${id}`);

export const getCompletedAppointments = (id) =>
  apiClient.get(`${endpoint}/completed/${id}`);

export const bookAppointment = (data) =>
  apiClient.post(`${endpoint}/book`, data);

export const deleteAllAppointment = () =>
  apiClient.patch(`${endpoint}/delete-many`);

export const confirmAppointment = (id, data) =>
  apiClient.patch(`${endpoint}/confirm/${id}`, data);

export const rejectAppointment = (id) =>
  apiClient.patch(`${endpoint}/reject/${id}`);

export const markAppointmentCompleted = (id) =>
  apiClient.patch(`${endpoint}/mark-completed/${id}`);

export const markAppointmentNoShow = (id) =>
  apiClient.patch(`${endpoint}/no-show/${id}`);

export const cancelAppointment = (id) =>
  apiClient.patch(`${endpoint}/cancel/${id}`);

export const deleteAppointment = (id) =>
  apiClient.patch(`${endpoint}/delete/${id}`);
