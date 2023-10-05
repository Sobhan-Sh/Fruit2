const AddToCart = (id, message) => {
    $.ajax({
        url: "/Product/Command/AddToCart",
        data: {
            "id": id,
            "code": "s" + id
        },
        success: function (result) {
            if (result.success) {
                if (message.length > 0 || message != "") toastr.success(message);
                else toastr.success(result.message);
                toastr.options.timeOut = 3000;
                if (result.count == 1) {
                    $(".cart-product-grid").append($(`<li title="${result.data.coverTitle}" class="single-cart-product ${result.code}">
                            <div class="cart-product-info d-flex align-items-center">
                                <div class="product-img">
                                    <img src="${result.urlImage + result.data.cover}" alt="${result.data.coverAlt}" class="img-fluid">
                                </div>
                                <div class="product-info">
                                    <a href="product-details.html">
                                        <h5 class="product-title">${result.data.productTitle}</h5>
                                    </a>
                                    <p class="product-price">
                                        <span>
                                            ${result.count}
                                        </span> x <span class="p-price"> تومان ${addCommasToNumber(result.discountPrice)}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="cart-product-delete-btn">
                                <a onclick="MinusItemCart(${id},'${result.code}',${result.discountPrice},'',false)"><i class="flaticon-letter-x"></i></a>
                            </div>
                        </li>`));
                    $(".cart-sidebar-wrappper").removeClass("d-none");
                    var countCart = document.querySelectorAll(".cart-count span");
                    for (var i = 0; i < countCart.length; i++) {
                        countCart[i].innerHTML = parseInt(countCart[i].innerHTML) + 1;
                    }
                    var sumPrice = document.querySelector(".subPrice").innerHTML;
                    sumPrice = sumPrice.replace(",", "");
                    sumPrice = sumPrice.replace(",", "");
                    if (Number(sumPrice) > 0) {
                        document.querySelector(".subPrice").innerHTML = addCommasToNumber(Number(sumPrice) + result.discountPrice);
                    }
                    else {
                        document.querySelector(".subPrice").innerHTML = addCommasToNumber(result.discountPrice);
                    }
                }
                else {
                    var sumPrice = document.querySelector(".subPrice").innerHTML;
                    $(`.${result.code} .product-price span:first-of-type`).html(result.count);
                    $(`.${result.code} .cart-product-delete-btn a`).remove();
                    $(`.${result.code} .cart-product-delete-btn`).append($(`<a onclick="MinusItemCart(${id},'${result.code}',${result.discountPrice},'',false)"><i class="flaticon-letter-x"></i></a>`));
                    sumPrice = sumPrice.replace(",", "");
                    sumPrice = sumPrice.replace(",", "");
                    document.querySelector(".subPrice").innerHTML = addCommasToNumber((Number(sumPrice) - result.data.inventory[0].unitPrice * (result.count > 2 ? result.count - 1 : 1)) + result.discountPrice);
                }
            }
            else {
                if (result.message === "این تعداد از کالا در انبار وجود ندارد")
                    toastr.warning(result.message);
                else
                    toastr.error(result.message);
            }
        }
    });
}
const MinusItemCart = (id, code, price, message, isBasket) => {
    $.ajax({
        url: "/Product/Command/MinusItemCart",
        data: {
            "id": id
        },
        success: function (result) {
            if (result.success) {
                if (isBasket == true) {
                    var sumPrice = document.querySelector(".subPriceProductBasket").innerHTML;
                    sumPrice = sumPrice.replace(",", "");
                    sumPrice = sumPrice.replace(",", "");
                    var sumP = Number(sumPrice) - price;
                    document.querySelector(".subPriceProductBasket").innerHTML = addCommasToNumber(sumP);
                    // TODO: عدد استاتیک فقط برای تست
                    document.querySelector(".subPriceBasket").innerHTML = addCommasToNumber(sumP + 350000);
                    sumPrice = addCommasToNumber(sumP);
                } else {
                    toastr.success(result.message);
                    toastr.options.timeOut = 3000;
                    var sumPrice = document.querySelector(".subPrice").innerHTML;
                    sumPrice = sumPrice.replace(",", "");
                    sumPrice = sumPrice.replace(",", "");
                    document.querySelector(".subPrice").innerHTML = addCommasToNumber(Number(sumPrice) - price);
                }

                var countCart = document.querySelectorAll(".cart-count span");
                for (var i = 0; i < countCart.length; i++) {
                    countCart[i].innerHTML = parseInt(countCart[i].innerHTML) - 1;
                }
                $(`.${code}`).hide('slow');
            }
            else {
                toastr.error(result.message);
            }
        }
    });
}
const plusItemCart = (id) => {
    $.ajax({
        url: "/Product/Command/PlusItemCart",
        data: {
            "id": id,
        },
        success: function (result) {
            if (result.success) {
                toastr.success(result.message);
                toastr.options.timeOut = 3000;
                $(`.s${id} .total-col`).html(`${addCommasToNumber(result.total)} تومان`);
                var sumPrice = document.querySelector(".subPriceProductBasket").innerHTML;
                sumPrice = sumPrice.replace(",", "");
                sumPrice = sumPrice.replace(",", "");
                var sumP = (Number(sumPrice) - ((result.discountPrice != 0 ? result.discountPrice : result.price) * (result.count > 2 ? result.count - 1 : 1))) + result.total;
                document.querySelector(".subPriceProductBasket").innerHTML = addCommasToNumber(sumP);
                document.querySelector(".subPrice").innerHTML = addCommasToNumber(sumP);
                document.querySelector(".subPriceBasket").innerHTML = addCommasToNumber(sumP + 350000);
                sumPrice = addCommasToNumber(sumP);
                $(`.s${id} .product-price span:first-of-type`).html(result.count)
            }
            else {
                if (result.message === "این تعداد از کالا در انبار وجود ندارد") {
                    toastr.warning(result.message);
                    $(`.s${id} .quantity input:first-of-type`).val(result.count)
                }
                else
                    toastr.error(result.message);
            }
        }
    });
}
const minItemCart = (id) => {
    $.ajax({
        url: "/Product/Command/MinItemCart",
        data: {
            "id": id,
        },
        success: function (result) {
            if (result.success) {
                toastr.success(result.message);
                toastr.options.timeOut = 3000;
                $(`.s${id} .total-col`).html(`${addCommasToNumber(result.total)} تومان`);
                var sumPrice = document.querySelector(".subPriceProductBasket").innerHTML;
                sumPrice = sumPrice.replace(",", "");
                sumPrice = sumPrice.replace(",", "");
                var sumP = parseInt((Number(sumPrice) - result.minPrice).toString().replace("-", ""));
                document.querySelector(".subPriceProductBasket").innerHTML = addCommasToNumber(sumP);
                document.querySelector(".subPrice").innerHTML = addCommasToNumber(sumP);
                document.querySelector(".subPriceBasket").innerHTML = addCommasToNumber(sumP + 350000);
                sumPrice = addCommasToNumber(sumP);
                $(`.s${id} .product-price span:first-of-type`).html(result.count)
            }
            else {
                if (result.message === "از این کالا حداقل یکی را باید انتخاب کنید") {
                    toastr.warning(result.message);
                    $(`.s${id} .quantity input:first-of-type`).val(result.count)
                }
                else
                    toastr.error(result.message);
            }
        }
    });
}
function addCommasToNumber(number) {
    var numberString = number.toString();
    if (numberString === "0") {
        return "0";
    }
    var result = "";
    var count = 0;
    for (var i = numberString.length - 1; i >= 0; i--) {
        result = numberString[i] + result;
        count++;
        if ((count % 3 === 0 || i === 0) && number >= 0) {
            if (i !== 0) {
                result = "," + result;
            }
            count = 0;
        }
    }

    return result;
}