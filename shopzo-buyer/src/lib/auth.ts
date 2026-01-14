import { apiRequest } from "./api";

export const getCurrentUser = async () => {
  return apiRequest("/api/me");
};