export const formatServices = (services) => {
  if (!services || typeof services !== "string") return [];

  return services
    .split(",")
    .map((service) => ({
      name: service.trim(),
    }))
    .filter((service) => service.name.length > 0);
};

export const revertServices = (services) => {
  if (!services) return "";

  return services.map((service) => service.name + " ").toString();
};
