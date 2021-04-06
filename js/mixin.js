export function showToast(message, type) {
  document.querySelector(".toast-container").insertAdjacentHTML(
    "afterbegin",
    `
          <div class="toast toast-${type} show" role="alert" aria-live="assertive" aria-atomic="true">
              <div class="toast-header"><strong class="me-auto">${
                type === "success"
                  ? "Thành công"
                  : type === "fail"
                  ? "Thất bại"
                  : type === "warning"
                  ? "Cảnh báo"
                  : ""
              }</strong></div>
              <div class="toast-body">${message}</div>
          </div>
        `
  );
  setTimeout(() => {
    document.querySelector(".toast-container > .toast:first-of-type").remove();
  }, 3000);
}

export function formatCurrency(money) {
  const strNum = String(money);
  let str = "";
  for (let i = strNum.length - 1, j = 0; i >= 0; i--, j++) {
    str =
      i !== strNum.length - 1 && j % 3 === 0
        ? strNum[i] + "." + str
        : strNum[i] + str;
  }
  return str;
}

export function setConfirmTooltip(element, event, question, message) {
  const { id } = element.dataset;
  const popover = new bootstrap.Popover(element, {
    html: true,
    title: question,
    content: `
                  <span class="delete-tooltip-${id} btn btn-success btn-sm mx-1">Có, tôi muốn</span>
                  <span class="close-tooltip-${id} btn btn-danger btn-sm mx-1">Không</span>
              `,
  });
  element.addEventListener("shown.bs.popover", async () => {
    document
      .querySelector(`span.delete-tooltip-${id}`)
      .addEventListener("click", function () {
        popover.hide();
        showToast(message, "success");
        event();
      });
    document
      .querySelector(`span.close-tooltip-${id}`)
      .addEventListener("click", function () {
        popover.hide();
      });
  });
}

export const defaultOptions = (method, body = null) =>
  body
    ? {
        method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }
    : {
        method,
        headers: {
          "content-type": "application/json",
        },
      };
