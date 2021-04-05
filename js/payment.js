import {
  customTryCatch,
  formatCurrency,
  getNextDateFromNow,
  showToast,
} from "./mixin.js";
import { DELIVERY_FEES } from "./vars.js";
import { postOrder } from "./apis.js";

document.addEventListener("DOMContentLoaded", () => {
  const orders = JSON.parse(localStorage.getItem("orders"));
  if (orders && orders.length !== 0) {
    // Set main table orders
    document.querySelector(".orders-container").innerHTML = orders
      .map((order) => {
        const { imgLink, name, price, quantity } = order;
        return `
            <div class="order-item">
                <div class="img"><img src="${imgLink}" alt=""></div>
                <div class="order-info"> 
                    <div class="order-name">${name}</div>
                    <div class="order-description">
                        <div class="order-quantity">Số lượng: X${quantity}</div>
                        <div class="order-price"><span>${formatCurrency(
                          price * quantity
                        )}</span><sup>đ</sup></div>
                    </div>
                </div>
            </div>
        `;
      })
      .join("");

    // Set sub orders
    document.querySelector(
      ".orders-info > .order-items-bound"
    ).innerHTML = orders
      .map((order) => {
        const { name, price, quantity } = order;
        return `
          <div class="order-item">
            <div class="order-quantity">${quantity} X</div>
            <div class="order-name">${name}</div>
            <div class="order-price">
              <span>${formatCurrency(price * quantity)}</span>
              <sup>đ</sup>
            </div>
          </div>
        `;
      })
      .join("");

    // Set total money (without delivery fee)
    const total = orders.reduce(
      (total, order) => (total += order.price * order.quantity),
      0
    );
    document.querySelector(
      ".order-payment-value > span"
    ).textContent = formatCurrency(total);

    document.querySelectorAll('input[name="delivery"]').forEach((radio) =>
      radio.addEventListener("change", function () {
        // Set delivery fee
        const feeObj = DELIVERY_FEES.find((fee) => fee.key === this.value);
        document.querySelector(
          ".order-fee-value > span"
        ).textContent = formatCurrency(feeObj.value);
        document.querySelector(
          ".order-total-price > .total-price > span"
        ).textContent = formatCurrency(feeObj.value + total);

        // Set delivery time
        document.querySelector(
          ".time-delivered"
        ).textContent = getDeliveryTimeText(feeObj.key);
      })
    );
  } else {
    document.querySelector(".orders-container").innerHTML =
      '<div class="text-center text-danger my-3"><i class="fa fa-ban"></i> <span>Không có mặt hàng nào</span></div>';
  }

  const addressInfo = JSON.parse(localStorage.getItem("address"));
  if (addressInfo) {
    const {
      firstName,
      lastName,
      company,
      address,
      city,
      nation,
      zipCode,
      phone,
    } = addressInfo;
    document.querySelector(".address-info").innerHTML = `
        <div class="name">${lastName + " " + firstName}</div>
        <div class="small-text">${`Địa chỉ: ${company}, ${address}, ${city}, ${nation}`}</div>
        <div class="small-text">Điện thoại: ${phone}</div>
        <div class="small-text">Zip code: ${zipCode}</div>
    `;
  }

  // Submit form
  document.querySelector("form#pay-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const delivery = getRadioValue("delivery");
    const payment = getRadioValue("payment");
    if (delivery && payment && orders && orders.length !== 0) {
      const shortProps = orders.map((order) => ({
        name: order.name,
        quantity: order.quantity,
      }));
      customTryCatch(async () => {
        await postOrder({ delivery, payment, products: orders });
        localStorage.removeItem("orders");
        location.href = `http://localhost:3000/success-order.html?orders=${JSON.stringify(
          shortProps
        )}`;
      });
    } else if (orders === null || orders.length === 0) {
      showToast("Vui lòng chọn mặt hàng cần mua!", "warning");
    } else {
      showToast(
        "Vui lòng chọn đầy đủ hình thức giao hàng và thanh toán!",
        "warning"
      );
    }
  });
});

function getRadioValue(name) {
  const radioChecked = Array.from(
    document.querySelectorAll(`input[name="${name}"]`)
  ).find((radio) => radio.checked);
  return radioChecked ? radioChecked.value : null;
}

function getDeliveryTimeText(type) {
  const date = new Date();
  switch (type) {
    case "2h_to_3h":
      const hour =
        date.getMinutes() < 30 ? date.getHours() + 3 : date.getHours() + 4;
      return `Giao hàng trước ${hour}h ${
        hour < 12 ? "sáng" : hour === 12 ? "trưa" : hour < 18 ? "chiều" : "tối"
      } nay`;
    case "in_day":
      return "Giao hàng trong hôm nay";
    case "standard":
      return `Giao hàng trong khoảng từ ${getNextDateFromNow(
        4 * 24 * 60 * 60 * 1000
      )} đến ${getNextDateFromNow(7 * 24 * 60 * 60 * 1000)}`;
    default:
      return "";
  }
}
