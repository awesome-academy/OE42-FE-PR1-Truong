import { getPaginateProducts } from "./apis.js";
import {
  customTryCatch,
  formatCurrency,
  getParamFromUrl,
  setPagination,
} from "./mixin.js";

document.addEventListener("DOMContentLoaded", async () => {
  const currentPage = getParamFromUrl("page") || 1;
  let productsPromise = null;
  let totalPage = null;
  let products = null;
  let displayType = null;
  let limit = null;
  let mapFunc = null;
  if (location.href.includes("list-list.html")) {
    limit = 4;
    displayType = "list";
    mapFunc = (product) => {
      const { id, img, name, salePrice, description } = product;
      return `
          <div class="col-12 list-view-item">
              <div class="row listViewCard gx-0">
                  <div class="col-12 col-sm-3 px-2">
                      <a href="/detail.html?id=${id}"><img src="./../assets/products/${img}" alt="champagne"></a>
                  </div>
                  <div class="col-12 col-sm-9 px-2">
                      <div class="name"><a href="/detail.html?id=${id}">${name}</a></div>
                      <div class="price">
                        <span>${formatCurrency(salePrice)}</span>
                        <sup>đ</sup>
                      </div>
                      <p class="description">${description}</p>
                      <div class="action-product">
                          <a class="buttonText" href="/detail.html?id=${id}">ADD TO CART</a>
                      <div class="action-child"><i class="fa fa-heart"> </i><span>Yêu thích</span></div>
                      <div class="action-child"><i class="fa fa-compress"> </i><span>So sánh</span></div>
                      </div>
                  </div>
              </div>
          </div>
      `;
    };
  } else if (location.href.includes("list-table.html")) {
    limit = 9;
    displayType = "table";
    mapFunc = (product) => {
        const { id, img, name, originPrice, salePrice } = product;
        return `
            <div class="item">
                <div class="champagne-card">
                    <div class="img-container">
                        <a href="/detail.html?id=${id}">
                            <img src="./../assets/products/${img}" alt="champagne">
                        </a>
                        <div class="action"> 
                            <div class="action-item">
                                <i class="fa fa-heart"></i>
                                <span>Yêu thích</span>
                            </div>
                            <div class="action-item">
                                <i class="fa fa-bar-chart"></i>
                                <span>So sánh</span>
                            </div>
                            <div class="action-item">
                                <i class="fa fa-compress"></i>
                            </div>
                        </div>
                    </div>
                    <a class="name" href="/detail.html?id=${id}">${name}</a>
                    <div class="price">
                        <span class="originPrice">
                            <span>${originPrice}</span>
                            <sup>đ</sup>
                        </span>
                        <span>&nbsp;-&nbsp;</span>
                        <span class="salePrice">
                            <span>${salePrice}</span>
                            <sup>đ</sup>
                        </span>
                    </div>
                    <a href="/detail.html?id=${id}" class="buttonText">ADD TO CART</a>
                </div>
            </div>
        `;
      };
  }

  await customTryCatch(async () => {
    productsPromise = getPaginateProducts(currentPage, limit);
    totalPage = Math.ceil(
      (await productsPromise).headers.get("X-Total-Count") / limit
    );
    products = await productsPromise.then((res) => res.json());
  });

  document.querySelector(".list").innerHTML = products.map(product => mapFunc(product)).join("");
  setPagination(
    currentPage,
    totalPage,
    (page) => `/list-${displayType}.html?page=${page}`
  );

  // Set next, prev event
  document
    .querySelector(".pagi .fa-caret-left")
    .addEventListener("click", () => {
      if (currentPage > 1) {
        location.href = `http://localhost:3000/list-${displayType}.html?page=${
          +currentPage - 1
        }`;
      }
    });
  document
    .querySelector(".pagi .fa-caret-right")
    .addEventListener("click", () => {
      if (currentPage < totalPage) {
        location.href = `http://localhost:3000/list-${displayType}.html?page=${
          +currentPage + 1
        }`;
      }
    });
});
