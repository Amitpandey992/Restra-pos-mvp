import apiClient from "./apiClient";

export const getMenuItems = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return await apiClient.get(`/menu?${params}`);
};

export const createMenuItem = async (data) => {
  return await apiClient.post("/menu", data);
};

export const updateMenuItem = async (id, data) => {
  return await apiClient.put(`/menu/${id}`, data);
};

export const deleteMenuItem = async (id) => {
  return await apiClient.delete(`/menu/${id}`);
};
