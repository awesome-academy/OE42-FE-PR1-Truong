import * as url from "./vars.js";

export const getAllProducts = async () =>
  fetch(url.GET_ALL_PRODUCTS_API)
    .then((res) => res.json())
    .catch((err) => console.log(err));

export const getProduct = async (id) =>
  fetch(url.GET_PRODUCT_API + id)
    .then((res) => res.json())
    .catch((err) => console.log(err));
