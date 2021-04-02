import { getProduct } from "./apis.js";
import { formatCurrency, showToast } from "./mixin.js";

document.querySelector("#minus-btn").addEventListener("click", () => {
  const inputQty = document.querySelector('input[name="qty"]');
  if (inputQty.value == 1) return;
  inputQty.value = +inputQty.value - 1;
});

document.querySelector("#plus-btn").addEventListener("click", () => {
  const inputQty = document.querySelector('input[name="qty"]');
  const maxQty = document
    .querySelector('input[name="qty"]')
    .getAttribute("max");
  if (+inputQty.value >= maxQty) return;
  inputQty.value = +inputQty.value + 1;
});

document.querySelector("form#add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const orders = localStorage.getItem("orders");
  const productId = document.querySelector('input[name="id"]').value;
  if (
    JSON.parse(orders)
      ?.map((order) => order.id)
      .includes(productId)
  ) {
    showToast("Đơn hàng đà tồn tại trong giỏ hàng!", "fail");
    return;
  }
  const order = {
    id: productId,
    imgLink: document.querySelector(".photo > img").getAttribute("src"),
    name: document.querySelector(".info-container .title").textContent,
    price: +document
      .querySelector(".info-container .price > span:first-of-type")
      .textContent.replace(".", ""),
    color: document.querySelector('input[name="color"]:checked').value,
    size: document.querySelector('select[name="size"]').value,
    quantity: +document.querySelector('input[name="qty"]').value,
    inventoryQty: +document
      .querySelector('input[name="qty"]')
      .getAttribute("max"),
  };
  localStorage.setItem(
    "orders",
    orders
      ? JSON.stringify([...JSON.parse(orders), order])
      : JSON.stringify([order])
  );
  showToast("Đơn hàng đà được lưu lại!", "success");
});

document.addEventListener("DOMContentLoaded", async () => {
  const id = new URL(window.location.href).searchParams.get("id");
  const product = await getProduct(id);
  document.querySelector('input[name="id"]').value = id;
  document.querySelector(".info-container .title").textContent = product.name;
  document
    .querySelector(".info-container input[name='qty']")
    .setAttribute("max", product.quantity);
  document.querySelector(
    ".info-container .price > span:first-of-type"
  ).textContent = formatCurrency(product.salePrice);
  document
    .querySelector(".photo > img")
    .setAttribute("src", `./../assets/products/${product.img}`);
  document.querySelector(".info-container p.description").textContent =
    product.description;
  document.querySelector("#pills-highlight").textContent =
    product.outstandingFeature;
  document.querySelector("#pills-information").textContent =
    product.infoProduct;
  document.querySelector("#pills-review").textContent = product.review;
  document.querySelector(".spinner").remove("active");
});
