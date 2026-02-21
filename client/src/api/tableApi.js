import apiClient from "./apiClient";

export const getTables = async () => {
  return await apiClient.get("/tables");
};

export const createTable = async (data) => {
  return await apiClient.post("/tables", data);
};

export const updateTable = async (id, data) => {
  return await apiClient.put(`/tables/${id}`, data);
};

export const deleteTable = async (id) => {
  return await apiClient.delete(`/tables/${id}`);
};
