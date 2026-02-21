import apiClient from "./apiClient";

export const createOrder = async (orderData) => {
  // orderData: { table_id, items: [{ menuItemId, quantity, notes }] }
  return await apiClient.post("/orders", orderData);
};

export const getOrders = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return await apiClient.get(`/orders?${params}`);
};

export const getOrder = async (id) => {
  return await apiClient.get(`/orders/${id}`);
};

export const updateOrderStatus = async (id, status) => {
  return await apiClient.put(`/orders/${id}/status`, { status });
};

export const checkoutOrder = async (id, paymentDetails) => {
  // paymentDetails: { payment_method }
  return await apiClient.post(`/orders/${id}/checkout`, paymentDetails);
};
