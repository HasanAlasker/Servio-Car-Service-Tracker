export const formatDateTime = (
  dateInput,
  locale = "en-US",
  timeZone = "Asia/Amman",
) => {
  const date = new Date(dateInput);

  if (isNaN(date)) return "Invalid date";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(date);
};
