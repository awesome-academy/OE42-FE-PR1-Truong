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
export const customFetch = (url, method, body = null) =>
  fetch(url, method === "get" ? null : defaultOptions(method, body))
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });

export const getNextDateFromNow = (duration) => {
  const nextDate = new Date(Date.now() + duration);
  const day = nextDate.getDate();
  const month = nextDate.getMonth() + 1;
  const year = nextDate.getFullYear();
  return `${day < 10 ? "0" + day : day}/${month}/${year}`;
};

export const turnSpinner = (status) => {
  switch (status) {
    case "on":
      document.querySelector(".spinner").classList.add("active");
      break;
    case "off":
      document.querySelector(".spinner").classList.remove("active");
      break;
    default:
      break;
  }
};

export const customTryCatch = async (func) => {
  try {
    turnSpinner("on");
    await func();
  } catch {
    showToast("Đã xảy ra lỗi!", "fail");
  } finally {
    turnSpinner("off");
  }
};

export const getParamFromUrl = (param) =>
  new URL(location.href).searchParams.get(param);
