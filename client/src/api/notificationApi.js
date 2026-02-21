import apiClient from "./apiClient";

export const getNotifications = async ({
  page = 1,
  limit = 20,
  unreadOnly = false,
}) => {
  return apiClient.get(
    `/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`,
  );
};

export const markAsRead = async (id) => {
  return apiClient.put(`/notifications/${id}/read`);
};

export const markAllAsRead = async () => {
  return apiClient.put(`/notifications/read-all`);
};
