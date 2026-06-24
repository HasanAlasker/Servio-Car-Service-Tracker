import {
  confirmAppointment,
  markAppointmentCompleted,
  markAppointmentNoShow,
  rejectAppointment,
} from "../api/appointment";

export const handleCompletion = async (id) => {
  try {
    const response = await markAppointmentCompleted(id);
  } catch (error) {}
};

export const handleNoShow = async (id) => {
  try {
    const response = await markAppointmentNoShow(id);
  } catch (error) {}
};
