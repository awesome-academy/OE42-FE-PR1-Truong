const BASE_API_URL = "http://localhost:4000";

// Product
export const GET_ALL_PRODUCTS_API = BASE_API_URL + "/products";
export const GET_PRODUCT_API = BASE_API_URL + "/products/";

// Wine category
export const WINE_CATEGORY_URL = BASE_API_URL + "/wineCategories";

// Address
export const MAIN_ADDRESS_URL = BASE_API_URL + "/mainAddress";
export const SUB_ADDRESS_URL = BASE_API_URL + "/subAddresses";

// Order
export const ORDER_URL = BASE_API_URL + "/orders";

// Variables
export const DELIVERY_FEES = [
  { key: "2h_to_3h", value: 60000 },
  { key: "in_day", value: 45000 },
  { key: "standard", value: 18000 },
];
