const API_BASE_URL = "http://localhost:8000/api";

export const API_ENDPOINTS = {
  // auth

  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  CURRENT_USER: `${API_BASE_URL}/me`,

  // warehouse

  CREATE_WAREHOUSES: `${API_BASE_URL}/warehouse/create`,
  GET_WAREHOUSES: `${API_BASE_URL}/warehouse/list`,
};
