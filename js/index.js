import { getAllProducts } from "./apis.js";
import { formatCurrency } from "./mixin.js";

document.addEventListener("DOMContentLoaded", async () => {
  const products = await getAllProducts();
  const htmlStr = products
    .map(
      (product) => `
            <div class="item">
                <div class="champagne-card">
                    <div class="img-container">
                        <a href="/detail.html?id=${
                          product.id
                        }"><img src="./../assets/products/${
        product.img
      }" alt="champagne"></a>
                        <div class="action"> 
                            <div class="action-item"><i class="fa fa-heart"> </i><span>Yêu thích</span></div>
                            <div class="action-item"><i class="fa fa-bar-chart"> </i><span>So sánh</span></div>
                            <div class="action-item"><i class="fa fa-compress"></i></div>
                        </div>
                        ${
                          product.type === "none"
                            ? ""
                            : `
                            <div class="tag-anchor ${product.type}">
                                <div class="text">${
                                  product.type[0].toUpperCase() +
                                  product.type.slice(1)
                                }</div>
                            </div>
                        `
                        }
                    </div>
                    <a class="name" href="/detail.html?id=${product.id}">${
        product.name
      }</a>
                    <div class="price">
                        <span class="originPrice">
                            <span>${formatCurrency(product.originPrice)}</span>
                            <sup>đ</sup>
                        </span>
                        <span>&nbsp;-&nbsp;</span>
                        <span class="salePrice">
                            <span>${formatCurrency(product.salePrice)}</span>
                            <sup>đ</sup>
                        </span>
                    </div>
                    <a class="buttonText" href="/detail.html?id=${
                      product.id
                    }">ADD TO CART</a>
                </div>
            </div>
  `
    )
    .join("");
  document.querySelectorAll(".product-slider").forEach((slider) => {
    slider.querySelector(".item-container").innerHTML = htmlStr;
  });
});
