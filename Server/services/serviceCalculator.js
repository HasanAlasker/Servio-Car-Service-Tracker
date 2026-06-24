export const calculateNextService = (part, currentCarMileage) => {
  const { lastChangeDate, lastChangeMileage, recommendedChangeInterval } = part;

  let nextServiceDate = null;
  let nextServiceMileage = null;

  if (recommendedChangeInterval.months) {
    const base = new Date(lastChangeDate);
    nextServiceDate = new Date(
      base.getFullYear(),
      base.getMonth() + recommendedChangeInterval.months,
      base.getDate(),
    );
  }

  if (recommendedChangeInterval.miles) {
    nextServiceMileage = lastChangeMileage + recommendedChangeInterval.miles;
  }

  const daysUntilDue = nextServiceDate
    ? Math.ceil((nextServiceDate - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const milesUntilDue =
    nextServiceMileage != null ? nextServiceMileage - currentCarMileage : null;

  return {
    partId: part._id,
    partName: part.name,
    nextServiceDate,
    nextServiceMileage,
    daysUntilDue,
    milesUntilDue,
  };
};

// check overdue → due → soon in the right order.
export const getServiceStatus = (daysUntilDue, milesUntilDue) => {
  const isOverdue =
    (daysUntilDue !== null && daysUntilDue < 0) ||
    (milesUntilDue !== null && milesUntilDue < 0);

  const isDue =
    (daysUntilDue !== null && daysUntilDue <= 7) ||
    (milesUntilDue !== null && milesUntilDue <= 100);

  const isSoon =
    (daysUntilDue !== null && daysUntilDue <= 30) ||
    (milesUntilDue !== null && milesUntilDue <= 500);

  if (isOverdue) return "overdue";
  if (isDue) return "due";
  if (isSoon) return "soon";
  return "not active";
};

const MILEAGE_GROUP_THRESHOLD = 500; // miles
const DATE_GROUP_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const groupServiceableParts = (partServices) => {
  // Separate dangerous parts (overdue/due) , they always get their own group
  const dangerous = partServices.filter((s) => {
    const status = getServiceStatus(s.daysUntilDue, s.milesUntilDue);
    return status === "overdue" || status === "due";
  });
  const normal = partServices.filter((s) => {
    const status = getServiceStatus(s.daysUntilDue, s.milesUntilDue);
    return status !== "overdue" && status !== "due";
  });

  const groups = [];

  // Dangerous parts collapsed into one group per car.
  if (dangerous.length > 0) {
    const earliestDate = dangerous.reduce((min, s) => {
      if (!s.nextServiceDate) return min;
      if (!min) return s.nextServiceDate;
      return s.nextServiceDate < min ? s.nextServiceDate : min;
    }, null);

    const lowestMileage = dangerous.reduce((min, s) => {
      if (s.nextServiceMileage == null) return min;
      if (min == null) return s.nextServiceMileage;
      return s.nextServiceMileage < min ? s.nextServiceMileage : min;
    }, null);

    groups.push({
      parts: dangerous.map((s) => s.partId),
      dueBy: { date: earliestDate, mileage: lowestMileage },
      isDangerous: true,
    });
  }

  // Normal parts: group when EITHER date OR mileage is close enough.
  const sorted = [...normal].sort((a, b) => {
    const da = a.nextServiceDate?.getTime() ?? Infinity;
    const db = b.nextServiceDate?.getTime() ?? Infinity;
    return da - db;
  });

  for (const service of sorted) {
    let addedToGroup = false;

    for (const group of groups) {
      if (group.isDangerous) continue;

      const dateClose =
        service.nextServiceDate != null &&
        group.dueBy.date != null &&
        Math.abs(service.nextServiceDate - group.dueBy.date) <=
          DATE_GROUP_THRESHOLD_MS;

      const mileageClose =
        service.nextServiceMileage != null &&
        group.dueBy.mileage != null &&
        Math.abs(service.nextServiceMileage - group.dueBy.mileage) <=
          MILEAGE_GROUP_THRESHOLD;

      if (dateClose || mileageClose) {
        group.parts.push(service.partId);
        if (
          service.nextServiceDate != null &&
          (group.dueBy.date == null ||
            service.nextServiceDate < group.dueBy.date)
        ) {
          group.dueBy.date = service.nextServiceDate;
        }
        if (
          service.nextServiceMileage != null &&
          (group.dueBy.mileage == null ||
            service.nextServiceMileage < group.dueBy.mileage)
        ) {
          group.dueBy.mileage = service.nextServiceMileage;
        }
        addedToGroup = true;
        break;
      }
    }

    if (!addedToGroup) {
      groups.push({
        parts: [service.partId],
        dueBy: {
          date: service.nextServiceDate,
          mileage: service.nextServiceMileage,
        },
      });
    }
  }

  return groups;
};
