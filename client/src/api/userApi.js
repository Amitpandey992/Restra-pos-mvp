import apiClient from "./apiClient";

export const getStaff = (params) => apiClient.get("/users", { params });
export const createStaff = (data) => apiClient.post("/users", data);
export const updateStaff = (id, data) => apiClient.put(`/users/${id}`, data);
export const deleteStaff = (id) => apiClient.delete(`/users/${id}`);

export const getRoles = () => apiClient.get("/roles");
