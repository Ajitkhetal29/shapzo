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
  GET_OPS_USERS: `${API_BASE_URL}/user/list`,
  CREATE_OPS_USER: `${API_BASE_URL}/user/create`,
  UPDATE_OPS_USER: `${API_BASE_URL}/user/update`, // :id
  DELETE_OPS_USER: `${API_BASE_URL}/user/delete`, // :id

  // departments
  GET_DEPARTMENTS: `${API_BASE_URL}/department/list`,
  CREATE_DEPARTMENT: `${API_BASE_URL}/department/create`,
  UPDATE_DEPARTMENT: `${API_BASE_URL}/department/update`, // :id
  DELETE_DEPARTMENT: `${API_BASE_URL}/department/delete`, // :id
  GET_DEPARTMENT_BY_ID: `${API_BASE_URL}/department`,  // get by id




  // roles
  GET_ROLES: `${API_BASE_URL}/role/list`,
  CREATE_ROLE: `${API_BASE_URL}/role/create`,
  UPDATE_ROLE: `${API_BASE_URL}/role/update`, // :id
  DELETE_ROLE: `${API_BASE_URL}/role/delete`, // :id
  GET_ROLE_BY_ID: `${API_BASE_URL}/role`,  // get by id



  // vendor
  GET_VENDORS: `${API_BASE_URL}/vendor/list`,
  CREATE_VENDOR: `${API_BASE_URL}/vendor/create`,
  UPDATE_VENDOR: `${API_BASE_URL}/vendor/update`, // :id
  DELETE_VENDOR: `${API_BASE_URL}/vendor/delete`, // :id
  GET_VENDOR_BY_ID: `${API_BASE_URL}/vendor`,  // get by id

};
