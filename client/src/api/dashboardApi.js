import apiClient from "./apiClient";

export const getDashboardStats = async () => {
  return await apiClient.get("/dashboard/stats");
};

export const getTopSellingItems = async () => {
  return await apiClient.get("/dashboard/top-items");
};

export const getSalesChart = async () => {
  return await apiClient.get("/dashboard/sales-chart");
};
