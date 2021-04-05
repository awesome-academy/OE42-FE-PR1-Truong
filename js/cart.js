import { showToast, formatCurrency } from "./mixin.js";

document.addEventListener("DOMContentLoaded", async () => {
  const orders = JSON.parse(localStorage.getItem("orders"));
  if (orders) {
    document.querySelector("tbody").innerHTML = await orders
      .map(
        (order) => `
        <tr class="row-id-${order.id}">
            <td><img src="${order.imgLink}" alt="wine" /></td>
            <td>${order.name}</td>
            <td class="money">
                <span>${formatCurrency(order.price)}</span>
                <sup>đ</sup>
            </td>
            <td class="change-status quantity-col">
                <span>${order.quantity}</span>
                <input type="number" value="${order.quantity}" max="${
          order.inventoryQty
        }" />
            </td>
            <td class="total money">
                <span>${formatCurrency(order.price * order.quantity)}</span>
                <sup>đ</sup>
            </td>
            <td class="change-status edit-action">
                <i data-id="${order.id}" data-max="${
          order.inventoryQty
        }" class="edit-btn fa fa-pencil-square-o text-primary"></i>
                <i data-id="${
                  order.id
                }" class="save-btn fa fa-file-text text-success"></i>
            </td>
            <td><i data-id="${
              order.id
            }" class="delete-btn fa fa-trash text-danger"></i></td>
        </tr>
      `
      )
      .join("");

    // Edit
    document.querySelectorAll("i.edit-btn").forEach((editBtn) => {
      const { id } = editBtn.dataset;
      editBtn.addEventListener("click", () => {
        document
          .querySelectorAll(`tr.row-id-${id} > td.change-status`)
          .forEach((col) => col.classList.add("editable"));
      });
    });

    document.querySelectorAll("i.save-btn").forEach((saveBtn) => {
      const { id } = saveBtn.dataset;
      saveBtn.addEventListener("click", () => {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const qty = document.querySelector(
          `tr.row-id-${id} > td.quantity-col > input`
        ).value;
        document.querySelector(
          `tr.row-id-${id} > td.quantity-col > span`
        ).textContent = qty;
        document.querySelector(
          `tr.row-id-${id} > td.total > span`
        ).textContent = formatCurrency(
          qty * orders.find((order) => order.id === id).price
        );
        document
          .querySelectorAll(`tr.row-id-${id} > td.change-status`)
          .forEach((col) => col.classList.add("editable"));
        localStorage.setItem(
          "orders",
          JSON.stringify(
            orders.map((order) =>
              order.id === id ? { ...order, quantity: +qty } : order
            )
          )
        );
        document
          .querySelectorAll(`tr.row-id-${id} > td.change-status`)
          .forEach((col) => col.classList.remove("editable"));
      });
    });

    // Delete
    document.querySelectorAll("i.delete-btn").forEach((deleteBtn) => {
      const { id } = deleteBtn.dataset;
      const popover = new bootstrap.Popover(deleteBtn, {
        html: true,
        title: "Bạn có muốn xóa đơn hàng?",
        content: `
                  <span class="delete-tooltip-${id} btn btn-success btn-sm mx-1">Có, tôi muốn</span>
                  <span class="close-tooltip-${id} btn btn-danger btn-sm mx-1">Không</span>
              `,
      });
      deleteBtn.addEventListener("shown.bs.popover", async () => {
        document
          .querySelector(`span.delete-tooltip-${id}`)
          .addEventListener("click", function () {
            popover.hide();
            showToast("Đã xóa đơn hàng ra khỏi giỏ hàng!", "success");
            document.querySelector(`.row-id-${id}`).remove();
            localStorage.setItem(
              "orders",
              JSON.stringify(
                JSON.parse(localStorage.getItem("orders"))?.filter(
                  (order) => order.id !== id
                )
              )
            );
          });
        document
          .querySelector(`span.close-tooltip-${id}`)
          .addEventListener("click", function () {
            popover.hide();
          });
      });
    });
  }
});
