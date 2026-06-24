import { capFirstLetter } from "./CapFirstLetterOfWord";

export const formatOpenDays = (days) => {
  let result = [];
  let group = [days[0]];

  for (let i = 1; i < days.length; i++) {
    let cur = days[i];
    let prev = days[i - 1];

    if (cur.from === prev.from && cur.to === prev.to) {
      group.push(cur);
    } else {
      result.push(group);
      group = [cur];
    }
  }
  result.push(group);
  return result;
};

export const formatDayRange = (group) => {
  if (group.length === 1) {
    return capFirstLetter(group[0].day);
  }

  return `${capFirstLetter(group[0].day)} - ${capFirstLetter(
    group[group.length - 1].day,
  )}`;
};
