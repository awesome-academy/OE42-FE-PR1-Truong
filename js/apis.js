import * as url from "./vars.js";
import { customFetch } from "./mixin.js";

// Product
export const getAllProducts = async () =>
  customFetch(url.GET_ALL_PRODUCTS_API, "get");

export const getProduct = async (id) =>
  customFetch(url.GET_PRODUCT_API + id, "get");

export const getPaginateProducts = async (page, limit, typeId) =>
  fetch(
    `${url.GET_ALL_PRODUCTS_API}?_page=${page}&_limit=${limit}${
      typeId && "&wineCategoryId=" + typeId
    }`
  );

// Wine category
export const getWineCategories = async () =>
  customFetch(url.WINE_CATEGORY_URL, "get");

// Address
export const getMainAddress = async () =>
  customFetch(url.MAIN_ADDRESS_URL, "get");

export const putMainAddress = async (address) =>
  customFetch(url.MAIN_ADDRESS_URL, "put", address);

export const getSubAddresses = async () =>
  customFetch(url.SUB_ADDRESS_URL, "get");

export const postSubAddress = async (address) =>
  customFetch(url.SUB_ADDRESS_URL, "post", address);

export const putSubAddress = async (address) =>
  customFetch(url.SUB_ADDRESS_URL + "/" + address.id, "put", address);

export const deleteSubAddress = async (id) =>
  customFetch(url.SUB_ADDRESS_URL + "/" + id, "delete");

// Order
export const postOrder = async (order) =>
  customFetch(url.ORDER_URL, "post", order);
