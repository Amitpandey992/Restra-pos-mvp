import apiClient from "./apiClient";

export const login = async (email, password) => {
  return await apiClient.post("/auth/login", { email, password });
};

export const register = async (userData) => {
  return await apiClient.post("/auth/register", userData);
};

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("refreshToken");
};

export const getUserProfile = async () => {
  return await apiClient.get("/auth/me");
};

export const verifyOtp = async (email, otp) => {
  return await apiClient.post("/auth/verify-otp", { email, otp });
};

export const resendOtp = async (email) => {
  return await apiClient.post("/auth/resend-otp", { email });
};
