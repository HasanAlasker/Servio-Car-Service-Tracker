import { apiClient } from "./client";

const endpoint = "/cars";

export const getAllCars = () => apiClient.get(`${endpoint}/all`);

export const getMakeAndModels = () => apiClient.get(`${endpoint}/car-makes`);

export const getMyCars = () => apiClient.get(`${endpoint}/mine`);

export const getCarById = (id) => apiClient.get(`${endpoint}/${id}`);

export const addCar = async (data) => {
  const formData = new FormData();

  formData.append("make", data.make);
  formData.append("name", data.name);
  formData.append("model", data.model);
  formData.append("color", data.color);
  formData.append("plateNumber", data.plateNumber);
  formData.append("mileage", data.mileage);
  formData.append("unit", data.unit);

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

  if (data.imagePublicId) {
    formData.append("imagePublicId", data.imagePublicId);
  }

  return apiClient.post(`${endpoint}/add`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editCar = async (id, data) => {
  const formData = new FormData();

  formData.append("make", data.make);
  formData.append("name", data.name);
  formData.append("model", data.model);
  formData.append("color", data.color);
  formData.append("plateNumber", data.plateNumber);
  formData.append("mileage", data.mileage);
  formData.append("unit", data.unit);

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

export const updateMileage = (id, data) =>
  apiClient.patch(`${endpoint}/mileage/${id}`, data);

export const deleteCar = (id) => apiClient.patch(`${endpoint}/delete/${id}`);
