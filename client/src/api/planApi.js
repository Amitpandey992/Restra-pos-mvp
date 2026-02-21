import apiClient from "./apiClient";

export const getPlans = () => apiClient.get("/plans");
