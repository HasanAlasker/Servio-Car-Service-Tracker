export const getTimeFromDate = (
  dateInput,
  locale = "en-US",
  timeZone = "Asia/Amman",
) => {
  const date = new Date(dateInput);
  if (isNaN(date)) return "Invalid time";

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...(timeZone && { timeZone }),
  }).format(date);
};
