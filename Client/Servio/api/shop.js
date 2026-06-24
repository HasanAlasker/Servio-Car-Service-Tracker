import { apiClient } from "./client";

const endpoint = "/shops";

export const getVerifiedShops = () => apiClient.get(`${endpoint}/verified`);

export const getNearbyShops = (location) => {
  if (!location?.lat || !location?.lng)
    return Promise.resolve({ data: { data: [] } });

  const query = new URLSearchParams({
    lat: location.lat,
    lng: location.lng,
    city: location.city,
  }).toString();

  return apiClient.get(`${endpoint}/nearby?${query}`);
};

export const getUnVerifiedShops = () =>
  apiClient.get(`${endpoint}/un-verified`);

export const getMyShops = () => apiClient.get(`${endpoint}/mine`);

export const getDeletedShops = () => apiClient.get(`${endpoint}/deleted`);

export const getShopById = (id) => apiClient.get(`${endpoint}/${id}`);

export const openShop = async (data) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("phone", data.phone);
  formData.append("link", data.link);
  formData.append("address[city]", data.address.city);
  formData.append("address[area]", data.address.area);
  formData.append("address[street]", data.address.street);
  formData.append("lat", data?.lat);
  formData.append("lng", data?.lng);

  // Handle services array
  if (data.services && Array.isArray(data.services)) {
    data.services.forEach((service, index) => {
      formData.append(`services[${index}][name]`, service.name);
    });
  }

  // Handle openHours array
  if (data.openHours && Array.isArray(data.openHours)) {
    data.openHours.forEach((hour, index) => {
      formData.append(`openHours[${index}][day]`, hour.day);
      formData.append(`openHours[${index}][dayName]`, hour.dayName);
      formData.append(`openHours[${index}][isOpen]`, hour.isOpen);
      if (hour.isOpen) {
        formData.append(`openHours[${index}][from]`, hour.from);
        formData.append(`openHours[${index}][to]`, hour.to);
      }
    });
  }

  // Handle image upload
  if (data.image) {
    const imageUri = data.image;

    if (imageUri.startsWith("blob:")) {
      // Web: fetch the blob and convert to a File
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = `upload_${Date.now()}.${blob.type.split("/")[1] || "jpg"}`;
      const file = new File([blob], filename, { type: blob.type });
      formData.append("image", file);
    } else {
      // Native: use the file URI directly
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";
      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: type,
      });
    }
  }

  return apiClient.post(`${endpoint}/openShop`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editShop = async (id, data) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("phone", data.phone);
  formData.append("link", data.link);
  formData.append("address[city]", data.address.city);
  formData.append("address[area]", data.address.area);
  formData.append("address[street]", data.address.street);
  formData.append("lng", data?.lng);
  formData.append("lat", data?.lat);

  // Handle services array
  if (data.services && Array.isArray(data.services)) {
    data.services.forEach((service, index) => {
      formData.append(`services[${index}][name]`, service.name);
    });
  }

  // Handle openHours array
  if (data.openHours && Array.isArray(data.openHours)) {
    data.openHours.forEach((hour, index) => {
      formData.append(`openHours[${index}][day]`, hour.day);
      formData.append(`openHours[${index}][dayName]`, hour.dayName);
      formData.append(`openHours[${index}][isOpen]`, hour.isOpen);
      if (hour.isOpen) {
        formData.append(`openHours[${index}][from]`, hour.from);
        formData.append(`openHours[${index}][to]`, hour.to);
      }
    });
  }

  // Handle image upload
  if (data.image) {
    if (data.image.startsWith("blob:")) {
      // Web: fetch the blob and convert to a File
      const response = await fetch(data.image);
      const blob = await response.blob();
      const filename = `upload_${Date.now()}.${blob.type.split("/")[1] || "jpg"}`;
      const file = new File([blob], filename, { type: blob.type });
      formData.append("image", file);
    } else if (
      data.image.startsWith("file://") ||
      data.image.startsWith("content://")
    ) {
      // Native: new image picked from device
      const imageUri = data.image;
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";
      formData.append("image", { uri: imageUri, name: filename, type });
    } else {
      // Existing remote URL — send as-is
      formData.append("image", data.image);
    }
  }

  if (data.imagePublicId) {
    formData.append("imagePublicId", data.imagePublicId);
  }

  return apiClient.patch(`${endpoint}/edit/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteShop = (id) => apiClient.patch(`${endpoint}/delete/${id}`);

export const undeleteShop = (id) =>
  apiClient.patch(`${endpoint}/un-delete/${id}`);

export const verifyShop = (id) => apiClient.patch(`${endpoint}/verify/${id}`);

export const rateShop = (id, data) =>
  apiClient.patch(`${endpoint}/rate/${id}`, data);
