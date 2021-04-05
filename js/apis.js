import * as url from "./vars.js";
import { defaultOptions } from "./mixin.js";

// Product
export const getAllProducts = async () =>
  fetch(url.GET_ALL_PRODUCTS_API).then((res) => res.json());

export const getProduct = async (id) =>
  fetch(url.GET_PRODUCT_API + id).then((res) => res.json());

// Address
export const getMainAddress = async () =>
  fetch(url.MAIN_ADDRESS_URL).then((res) => res.json());

export const putMainAddress = async (address) =>
  fetch(url.MAIN_ADDRESS_URL, defaultOptions("put", address)).then((res) =>
    res.json()
  );

export const getSubAddresses = async () =>
  fetch(url.SUB_ADDRESS_URL).then((res) => res.json());

export const postSubAddress = async (address) =>
  fetch(url.SUB_ADDRESS_URL, defaultOptions("post", address)).then((res) =>
    res.json()
  );

export const putSubAddress = async (address) =>
  fetch(
    url.SUB_ADDRESS_URL + "/" + address.id,
    defaultOptions("put", address)
  ).then((res) => res.json());

export const deleteSubAddress = async (id) =>
  fetch(url.SUB_ADDRESS_URL + "/" + id, defaultOptions("delete")).then((res) =>
    res.json()
  );
