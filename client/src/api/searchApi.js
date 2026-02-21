import apiClient from "./apiClient";

export const searchGlobal = async (query) => {
  return await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
};
