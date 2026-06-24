export const capFirstLetter = (word) => {
  if (!word) return null;
  return word
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};
