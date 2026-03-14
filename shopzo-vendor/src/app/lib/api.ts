const API_BASE_URL = "http://localhost:8000/api";

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/vendor/login`,
    LOGOUT: `${API_BASE_URL}/vendor/logout`,
    CURRENT_USER: `${API_BASE_URL}/vendor/me`,
    GET_CATEGORIES: `${API_BASE_URL}/category/list`,
    GET_SUBCATEGORIES: `${API_BASE_URL}/subcategory/list`,
    GET_PRODUCTS: `${API_BASE_URL}/product/list`,
    GET_PRODUCT_BY_ID: `${API_BASE_URL}/product`,
    CREATE_PRODUCT: `${API_BASE_URL}/product/add`,
    UPDATE_PRODUCT: `${API_BASE_URL}/product/update`,
};