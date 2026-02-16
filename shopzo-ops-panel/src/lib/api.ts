const API_BASE_URL = "http://localhost:8000/api";

export const API_ENDPOINTS = {
  // auth

  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  CURRENT_USER: `${API_BASE_URL}/me`,

  // warehouse

  CREATE_WAREHOUSES: `${API_BASE_URL}/warehouse/create`,
  GET_WAREHOUSES: `${API_BASE_URL}/warehouse/list`,
  UPDATE_WAREHOUSES: `${API_BASE_URL}/warehouse/update`, // :id
  DELETE_WAREHOUSES: `${API_BASE_URL}/warehouse/delete`, // :id


  // users
  GET_OPS_USERS: `${API_BASE_URL}/auth/get-ops-users`,
  CREATE_OPS_USER: `${API_BASE_URL}/auth/create-ops-user`,
  UPDATE_OPS_USER: `${API_BASE_URL}/auth/update-ops-user`, // :id
  DELETE_OPS_USER: `${API_BASE_URL}/auth/delete-ops-user`, // :id
};
