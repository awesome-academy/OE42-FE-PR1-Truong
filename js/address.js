import {
  getMainAddress,
  getSubAddresses,
  putMainAddress,
  postSubAddress,
  putSubAddress,
  deleteSubAddress,
} from "./apis.js";
import {
  customTryCatch,
  getParamFromUrl,
  setConfirmTooltip,
  showToast,
} from "./mixin.js";

// Global variables
var mainAddress = null;
var subAddresses = null;

document.addEventListener("DOMContentLoaded", () => {
  customTryCatch(async () => {
    mainAddress = await getMainAddress();
    setFormValue("main-address-form", mainAddress);
    subAddresses = await getSubAddresses();
    document.querySelector(
      ".sub-address-container"
    ).innerHTML = subAddresses
      .map((addressInfo) => setSubAddress(addressInfo))
      .join("");

    document.querySelectorAll(".edit-container").forEach((container) => {
      setEditableEvent(container);
    });

    // Set payment section
    if (Boolean(getParamFromUrl("payment"))) {
      document.querySelector(".progress-container").style.display = "flex";
      document.querySelector(".select-address-container").style.display =
        "flex";

      // Main address
      setAddressPicker(mainAddress, 0);

      // Sub addresses
      document.querySelector(".select-address-container").insertAdjacentHTML(
        "beforeend",
        subAddresses
          .map((addr) => {
            const {
              id,
              firstName,
              lastName,
              company,
              address,
              city,
              nation,
              zipCode,
              phone,
            } = addr;
            return `
                <div class="address-item" id="address-item-${id}">
                  <div class="address-bound">
                    <div class="full-name">${lastName + " " + firstName}</div>
                    <div class="address-info address">${`Địa chỉ: ${company}, ${address}, ${city}, ${nation}`}</div>
                    <div class="address-info phone">${
                      "Điện thoại: " + phone
                    }</div>
                    <div class="address-info zip-code">${
                      "Zip code: " + zipCode
                    }</div>
                    <button class="address-btn" data-id="${id}">Giao đến địa chỉ này</button>
                  </div>
                </div>
              `;
          })
          .join("")
      );

      // Set address button event
      document
        .querySelectorAll("button.address-btn")
        .forEach((btn) => pickAddressEvent(btn));
    }
  });
});

document.querySelector("#main-address-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const addressInfo = getFormValue("main-address-form");
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
  if (
    firstName &&
    lastName &&
    company &&
    address &&
    city &&
    nation &&
    zipCode &&
    phone
  ) {
    mainAddress = { ...addressInfo };
    customTryCatch(async () => {
      await putMainAddress(addressInfo);
      await resetDefaultAddress(0);
      setAddressPicker(addressInfo, 0);
      showToast("Đã lưu thông tin địa chỉ của bạn!", "success");
    });
  } else {
    showToast("Vui lòng nhập đầy đủ thông tin!", "warning");
  }
});

document.querySelector("#add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const addressValue = getFormValue("add-form");
  const id = +subAddresses[subAddresses.length - 1].id + 1 + "";
  const addressInfo = { ...addressValue, id };
  customTryCatch(async () => {
    await postSubAddress(addressInfo);
    subAddresses = [...subAddresses, addressInfo];
    document
      .querySelector(".sub-address-container")
      .insertAdjacentHTML("beforeend", "<hr>" + setSubAddress(addressInfo));
    document.querySelector("#add-form").reset();
    if (addressValue.isDefault) {
      await resetDefaultAddress(id);
    }
    setEditableEvent(document.querySelector(`#edit-container-${id}`));

    // Set address picker
    const {
      firstName,
      lastName,
      company,
      address,
      city,
      nation,
      zipCode,
      phone,
    } = addressValue;
    document.querySelector(".select-address-container").insertAdjacentHTML(
      "beforeend",
      `
        <div class="address-item" id="address-item-${id}">
          <div class="address-bound">
            <div class="full-name">${lastName + " " + firstName}</div>
            <div class="address-info address">${`Địa chỉ: ${company}, ${address}, ${city}, ${nation}`}</div>
            <div class="address-info phone">${"Điện thoại: " + phone}</div>
            <div class="address-info zip-code">${"Zip code: " + zipCode}</div>
            <button data-id="${id}">Giao đến địa chỉ này</button>
          </div>
        </div>
      `
    );
    pickAddressEvent(document.querySelector(`#address-item-${id} button`));
    showToast("Đã thêm mới địa chỉ thành công!", "success");
  });
});

function setAddressView(addressObj) {
  const {
    id,
    firstName,
    lastName,
    company,
    city,
    nation,
    address,
    zipCode,
    phone,
    isDefault,
  } = addressObj;
  const addressContainer = document.querySelector(`#edit-container-${id}`);
  addressContainer.querySelector(
    ".text-item:nth-of-type(1) > div:last-of-type"
  ).textContent = firstName;
  addressContainer.querySelector(
    ".text-item:nth-of-type(2) > div:last-of-type"
  ).textContent = lastName;
  addressContainer.querySelector(
    ".text-item:nth-of-type(3) > div:last-of-type"
  ).textContent = company;
  addressContainer.querySelector(
    ".text-item:nth-of-type(4) > div:last-of-type"
  ).textContent = city;
  addressContainer.querySelector(
    ".text-item:nth-of-type(5) > div:last-of-type"
  ).textContent = nation;
  addressContainer.querySelector(
    ".text-item:nth-of-type(6) > div:last-of-type"
  ).textContent = address;
  addressContainer.querySelector(
    ".text-item:nth-of-type(7) > div:last-of-type"
  ).textContent = zipCode;
  addressContainer.querySelector(
    ".text-item:nth-of-type(8) > div:last-of-type"
  ).textContent = phone;
  addressContainer.querySelector(
    ".text-item:nth-of-type(9) > div:last-of-type"
  ).textContent = isDefault ? "Có" : "Không";
}

function setFormValue(formId, valueObj) {
  const {
    firstName,
    lastName,
    company,
    city,
    nation,
    address,
    zipCode,
    phone,
    isDefault,
  } = valueObj;
  document.querySelector(
    `#${formId} input[name="first-name"]`
  ).value = firstName;
  document.querySelector(`#${formId} input[name="last-name"]`).value = lastName;
  document.querySelector(`#${formId} input[name="company"]`).value = company;
  document.querySelector(`#${formId} input[name="address"]`).value = address;
  document
    .querySelector(`#${formId} select[name="city"] > option[value="${city}"]`)
    .setAttribute("selected", true);
  document
    .querySelector(
      `#${formId} select[name="nation"] > option[value="${nation}"]`
    )
    .setAttribute("selected", true);
  document.querySelector(`#${formId} input[name="zip-code"]`).value = zipCode;
  document.querySelector(`#${formId} input[name="phone"]`).value = phone;
  document.querySelector(
    `#${formId} input[name="default-address"]`
  ).checked = isDefault;
}

function getFormValue(formId) {
  const firstName = document
    .querySelector(`#${formId} input[name="first-name"]`)
    .value?.trim();
  const lastName = document
    .querySelector(`#${formId} input[name="last-name"]`)
    .value?.trim();
  const company = document
    .querySelector(`#${formId} input[name="company"]`)
    .value?.trim();
  const address = document
    .querySelector(`#${formId} input[name="address"]`)
    .value?.trim();
  const city = document
    .querySelector(`#${formId} select[name="city"] > option:checked`)
    .value?.trim();
  const nation = document
    .querySelector(`#${formId} select[name="nation"] > option:checked`)
    .value?.trim();
  const zipCode = document
    .querySelector(`#${formId} input[name="zip-code"]`)
    .value?.trim();
  const phone = document
    .querySelector(`#${formId} input[name="phone"]`)
    .value?.trim();
  const isDefault = document.querySelector(
    `#${formId} input[name="default-address"]`
  ).checked;
  return {
    firstName,
    lastName,
    company,
    address,
    city,
    nation,
    zipCode,
    phone,
    isDefault,
  };
}

function setSubAddress(addressInfo) {
  const {
    id,
    firstName,
    lastName,
    company,
    address,
    city,
    nation,
    zipCode,
    phone,
    isDefault,
  } = addressInfo;
  return `
    <div class="edit-container" id="edit-container-${id}" data-id="${id}">
      <hr>
      <form id="edit-form-${id}" method="put" data-id="${id}">
        <div class="input-item row">
          <div class="input-title col-12 col-md-3"><span>Tên</span><span>*</span></div>
          <div class="input col-12 col-md-9">
            <input name="first-name" type="text" value="">
          </div>
        </div>
        <div class="input-item row">
          <div class="input-title col-12 col-md-3"><span>Họ &amp; tên đệm</span><span>*</span></div>
          <div class="input col-12 col-md-9">
            <input name="last-name" type="text" value="">
          </div>
        </div>
        <div class="input-item row">
          <div class="input-title col-12 col-md-3"><span>Công ty</span><span>*</span></div>
          <div class="input col-12 col-md-9">
            <input name="company" type="text" value="">
          </div>
        </div>
        <div class="input-item row">
          <div class="input-title col-12 col-md-3"><span>Địa chỉ</span><span>*</span></div>
          <div class="input col-12 col-md-9">
            <input name="address" type="text" value="">
          </div>
        </div>
        <div class="input-item row">
          <div class="input-title col-12 col-md-3"><span>Thành phố</span><span>*</span></div>
          <div class="input col-12 col-md-9">
            <select name="city">
              <option value="Nha Trang">Nha Trang</option>
              <option value="Hà Nội" selected="">Hà Nội</option>
              <option value="Đà Nẵng" selected="true">Đà Nẵng</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            </select>
          </div>
        </div>
        <div class="input-item row">
          <div class="input-title col-12 col-md-3"><span>Quốc tịch</span><span>*</span></div>
          <div class="input col-12 col-md-9">
            <select name="nation">
              <option value="Mỹ">Mỹ</option>
              <option value="Trung Quốc">Trung Quốc</option>
              <option value="Nhật Bản">Nhật Bản</option>
              <option value="Việt Nam" selected="true">Việt Nam</option>
            </select>
          </div>
        </div>
        <div class="input-item row">
          <div class="input-title col-12 col-md-3"><span>Postal/Zip Code</span><span>*</span></div>
          <div class="input col-12 col-md-9">
            <input name="zip-code" type="text" value="">
          </div>
        </div>
        <div class="input-item row">
          <div class="input-title col-12 col-md-3"><span>Phone</span><span>*</span></div>
          <div class="input col-12 col-md-9">
            <input name="phone" type="text" value="">
          </div>
        </div>
        <div class="input-item row">
          <div class="input col-12 col-md-9 offset-md-3">
            <input name="default-address" type="checkbox" checked="" id="default-address-${id}">
            <label for="default-address-${id}">Đặt làm địa chỉ mặc định?</label>
          </div>
        </div>
        <div class="row"> 
          <div class="button-group col-12">
            <button type="submit">Chỉnh sửa địa chỉ</button>
            <button type="button" class="delete-btn" data-id="${id}">Xóa</button>
            <button type="button" class="cancel-btn" data-id="${id}">Thoát</button>
          </div>
        </div>
      </form>
      <div class="address-item">
        <div class="text-item row"> 
            <div class="col-4">Tên</div>
            <div class="col-8">${firstName}</div>
        </div>
        <div class="text-item row"> 
            <div class="col-4">Họ &amp; tên đệm</div>
            <div class="col-8">${lastName}</div>
        </div>
        <div class="text-item row"> 
            <div class="col-4">Công ty</div>
            <div class="col-8">${company}</div>
        </div>
        <div class="text-item row"> 
            <div class="col-4">Địa chỉ</div>
            <div class="col-8">${address}</div>
        </div>
        <div class="text-item row"> 
            <div class="col-4">Thành phố</div>
            <div class="col-8">${city}</div>
        </div>
        <div class="text-item row"> 
            <div class="col-4">Quốc tịch</div>
            <div class="col-8">${nation}</div>
        </div>
        <div class="text-item row"> 
            <div class="col-4">Postal/Zip Code</div>
            <div class="col-8">${zipCode}</div>
        </div>
        <div class="text-item row"> 
            <div class="col-4">Phone</div>
            <div class="col-8">${phone}</div>
        </div>
        <div class="text-item row"> 
            <div class="col-4">Mặc định</div>
            <div class="col-8">${isDefault ? "Có" : "Không"}</div>
        </div>
        <div class="edit-address-link col-12"><a href="" data-id="${id}">Chỉnh sửa địa chỉ</a></div>
      </div>
    </div>
    `;
}

function setEditableEvent(container) {
  const { id } = container.dataset;

  // Show edit form
  container
    .querySelector(".address-item .edit-address-link > a")
    .addEventListener("click", (e) => {
      e.preventDefault();
      setFormValue(
        `edit-form-${id}`,
        subAddresses.find((addr) => addr.id === id)
      );
      document.querySelector(`#edit-container-${id}`).classList.add("editing");
    });

  // Submit edit form
  container.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formValue = { ...getFormValue(`edit-form-${id}`), id };
    customTryCatch(async () => {
      await putSubAddress(formValue);
      setAddressView(formValue);
      subAddresses = subAddresses.map((addr) =>
        addr.id === id ? formValue : addr
      );
      if (formValue.isDefault) {
        await resetDefaultAddress(id);
      }
      document
        .querySelector(`#edit-container-${id}`)
        .classList.remove("editing");
      setAddressPicker(formValue, id);
      showToast("Cập nhật địa chỉ thành công!", "success");
    });
  });

  // Cancel edit
  container
    .querySelector("form button.cancel-btn")
    .addEventListener("click", () => {
      document
        .querySelector(`#edit-container-${id}`)
        .classList.remove("editing");
    });

  setConfirmTooltip(
    container.querySelector("form button.delete-btn"),
    () => {
      customTryCatch(async () => {
        await deleteSubAddress(id);
        container.remove();
        document.querySelector(`#address-item-${id}`).remove();
      });
    },
    "Bạn có chắc chắn muốn xóa?",
    "Đã xóa địa chỉ thành công!"
  );
}

async function resetDefaultAddress(id) {
  if (id !== 0 && mainAddress.isDefault) {
    await putMainAddress({ ...mainAddress, isDefault: false });
    document.querySelector(
      '#main-address-form input[name="default-address"]'
    ).checked = false;
  }
  if (
    subAddresses
      .filter((subAddr) => subAddr.id !== id)
      .map((subAddr) => subAddr.isDefault)
      .includes(true)
  ) {
    const editAddr = subAddresses.find(
      (addr) => addr.isDefault && addr.id !== id
    );
    editAddr.isDefault = false;
    await putSubAddress(editAddr);
    document.querySelector(
      `#edit-container-${editAddr.id} .address-item .text-item:nth-of-type(9) > div:last-of-type`
    ).textContent = "Không";
  }
}

function setAddressPicker(addressInfo, id) {
  const addressContainer =
    id === 0
      ? document.querySelector("#main-address-item")
      : document.querySelector(`#address-item-${id}`);
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
  addressContainer.querySelector(".full-name").textContent =
    lastName + " " + firstName;
  addressContainer.querySelector(
    ".address"
  ).textContent = `Địa chỉ: ${company}, ${address}, ${city}, ${nation}`;
  addressContainer.querySelector(".phone").textContent = "Điện thoại: " + phone;
  addressContainer.querySelector(".zip-code").textContent =
    "Zip code: " + zipCode;
}

function pickAddressEvent(btn) {
  btn.addEventListener("click", () => {
    const { id } = btn.dataset;
    localStorage.setItem(
      "address",
      id === "0"
        ? JSON.stringify(mainAddress)
        : JSON.stringify(subAddresses.find((addr) => addr.id === id))
    );
    location.href = "http://localhost:3000/payment.html";
  });
}
