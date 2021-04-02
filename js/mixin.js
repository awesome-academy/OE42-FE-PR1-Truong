export function showToast(message, type) {
  document.querySelector(".toast-container").insertAdjacentHTML(
    "afterbegin",
    `
          <div class="toast toast-${type} show" role="alert" aria-live="assertive" aria-atomic="true">
              <div class="toast-header"><strong class="me-auto">${
                type === "success" ? "Thành công" : "Thất bại"
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
  console.log(strNum);
  let str = "";
  for (let i = strNum.length - 1, j = 0; i >= 0; i--, j++) {
    str =
      i !== strNum.length - 1 && j % 3 === 0
        ? strNum[i] + "." + str
        : strNum[i] + str;
  }
  console.log(str);
  return str;
}
