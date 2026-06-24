export const addOneHour = (dateInput) => {
  const date = new Date(dateInput);
  date.setHours(date.getHours() + 1);
  return date;
};

export const addThirtyMinutes = (dateInput) => {
  const date = new Date(dateInput);
  date.setMinutes(date.getMinutes() + 30);
  return date;
};

export const to24Hour = (time12) => {
  // Remove any type of whitespace/special space characters
  const trimmed = time12.replace(/\s+/g, " ").trim();
  const parts = trimmed.split(" ");
  const time = parts[0];
  const modifier = parts[1];

  let [hours, minutes] = time.split(":");
  hours = parseInt(hours);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};
