import { getParamFromUrl } from "./mixin.js";

document.addEventListener("DOMContentLoaded", () => {
  const products = JSON.parse(getParamFromUrl("orders"));
  document.querySelector(".products").innerHTML = products
    .map(
      (product) =>
        `<div class="common">${product.quantity} x ${product.name}</div>`
    )
    .join("");
});
