import apiClient from "./apiClient";

export const getInventoryItems = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return await apiClient.get(`/inventory?${params}`);
};

export const addIngredient = async (data) => {
  // data: { name, unit, min_stock_level, cost_per_unit }
  return await apiClient.post("/inventory", data);
};

export const adjustStock = async (data) => {
  // data: { ingredientId, quantity, type, reason }
  return await apiClient.post("/inventory/adjust", data); // This matches server route /adjust
};
