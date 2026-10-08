/* =========================================
   SOFTINA NATURAL VENTURES
   PRODUCT DETAILS V2.1
   PRODUCT + SERVICE DETAILS
========================================= */

const whatsappNumber = "2347036270880";

const products = SOFTINA_PRODUCTS;


/* =========================================
   GET PRODUCT / SERVICE ID
========================================= */

const urlParams =
    new URLSearchParams(window.location.search);

const productId =
    Number(urlParams.get("id"));


/* =========================================
   FIND ITEM
========================================= */

const item =
    products.find(
        product => product.id === productId
    );


/* =========================================
   MAIN CONTAINER
========================================= */

const container =
    document.getElementById("productDetails");


/* =========================================
   IF ITEM NOT FOUND
========================================= */

if (!item) {

    container.innerHTML = `

        <div class="product-not-found">

            <i class="fa-solid fa-circle-exclamation"></i>

            <h2>
                Product or Service Not Found
            </h2>

            <p>
                The requested item could not be found.
            </p>

            <a href="products.html">
                <i class="fa-solid fa-arrow-left"></i>
                Back to Products
            </a>

        </div>

    `;

}


/* =========================================
   ITEM FOUND
========================================= */

else {

    const isProduct =
        item.type === "product";

    const isService =
        item.type === "service";


    /* =====================================
       PRICE
    ===================================== */

    let priceHTML = "";

    if (
        item.price !== null &&
        item.price !== undefined &&
        item.price !== ""
    ) {

        priceHTML = `

            <div class="detail-price">

                <strong>
                    ₦${Number(item.price).toLocaleString()}
                </strong>

                ${
                    item.oldPrice
                        ? `
                            <del>
                                ₦${Number(
                                    item.oldPrice
                                ).toLocaleString()}
                            </del>
                        `
                        : ""
                }

            </div>

        `;

    }

    else {

        priceHTML = `

            <div class="detail-price">

                <span>
                    Contact us for current price
                </span>

            </div>

        `;

    }


    /* =====================================
       BADGE
    ===================================== */

    let badgeHTML = "";

    if (item.isNew) {

        badgeHTML = `

            <span class="detail-badge">
                NEW
            </span>

        `;

    }


    /* =====================================
       TYPE LABEL
    ===================================== */

    const typeLabel =
        isProduct
            ? "Physical Product"
            : "Professional Service";


    /* =====================================
       META INFORMATION
    ===================================== */

    let metaHTML = "";


    if (isProduct) {

        metaHTML = `

            <div class="product-meta">

                ${
                    item.size
                        ? `
                            <div>
                                <i class="fa-solid fa-box"></i>
                                <strong>Size:</strong>
                                ${item.size}
                            </div>
                        `
                        : ""
                }

                <div>

                    <i class="fa-solid fa-circle-check"></i>

                    <strong>Status:</strong>

                    ${
                        item.available
                            ? "Available"
                            : "Currently Unavailable"
                    }

                </div>

                <div>

                    <i class="fa-solid fa-truck"></i>

                    <strong>Delivery:</strong>

                    Contact us for delivery information

                </div>

            </div>

        `;

    }


    if (isService) {

        metaHTML = `

            <div class="product-meta">

                <div>

                    <i class="fa-solid fa-user-doctor"></i>

                    <strong>Service Type:</strong>

                    ${typeLabel}

                </div>

                <div>

                    <i class="fa-solid fa-calendar-check"></i>

                    <strong>Booking:</strong>

                    Available by appointment

                </div>

                <div>

                    <i class="fa-solid fa-comments"></i>

                    <strong>Contact:</strong>

                    Online or physical consultation

                </div>

            </div>

        `;

    }


    /* =====================================
       ACTION AREA
    ===================================== */

    let actionHTML = "";


    /* =====================================
       PHYSICAL PRODUCT ACTIONS
    ===================================== */

    if (isProduct) {

        if (item.available) {

            actionHTML = `

                <div class="quantity-section">

                    <label>
                        Quantity
                    </label>

                    <div class="quantity-control">

                        <button
                            type="button"
                            id="decreaseQuantity"
                        >
                            −
                        </button>

                        <span id="quantity">
                            1
                        </span>

                        <button
                            type="button"
                            id="increaseQuantity"
                        >
                            +
                        </button>

                    </div>

                </div>


                <div class="detail-actions">

                    <button
                        type="button"
                        class="detail-cart-btn"
                        id="addToCartBtn"
                    >

                        <i class="fa-solid fa-cart-plus"></i>

                        Add to Order

                    </button>


                    <button
                        type="button"
                        class="detail-whatsapp-btn"
                        id="orderNowBtn"
                    >

                        <i class="fa-brands fa-whatsapp"></i>

                        Order Now

                    </button>

                </div>

            `;

        }

        else {

            actionHTML = `

                <div class="product-notice">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    This product is currently unavailable.

                    Please contact Softina Natural Ventures
                    for availability information.

                </div>

            `;

        }

    }


    /* =====================================
       SERVICE ACTIONS
    ===================================== */

    if (isService) {

        actionHTML = `

            <div class="detail-actions">

                <button
                    type="button"
                    class="detail-whatsapp-btn service-request-btn"
                    id="requestServiceBtn"
                >

                    <i class="fa-brands fa-whatsapp"></i>

                    Request Service

                </button>

            </div>

        `;

    }


    /* =====================================
       DISCLAIMER
    ===================================== */

    const noticeText =
        isProduct

            ? `
                Product information, availability,
                pricing and delivery arrangements
                should be confirmed with Softina Natural
                Ventures before placing an order.
            `

            : `
                Service information, consultation
                arrangements and applicable charges
                should be confirmed with Softina Natural
                Ventures before booking.
            `;


    /* =====================================
       RENDER PAGE
    ===================================== */

    container.innerHTML = `

        <div class="product-detail-image">

            ${badgeHTML}

            <img
                src="${item.image}"
                alt="${item.name}"
            >

        </div>


        <div class="product-detail-content">

            <span class="detail-category">

                ${item.categoryName}

            </span>


            <h1>
                ${item.name}
            </h1>


            <p class="detail-description">

                ${item.description}

            </p>


            ${priceHTML}


            ${metaHTML}


            ${actionHTML}


            <div class="product-notice">

                <i class="fa-solid fa-circle-info"></i>

                ${noticeText}

            </div>


            <a
                href="products.html"
                class="back-products"
            >

                <i class="fa-solid fa-arrow-left"></i>

                Back to Products

            </a>

        </div>

    `;


    /* =====================================
       PHYSICAL PRODUCT JAVASCRIPT
    ===================================== */

    if (isProduct && item.available) {

        let quantity = 1;


        const quantityDisplay =
            document.getElementById(
                "quantity"
            );


        const decreaseButton =
            document.getElementById(
                "decreaseQuantity"
            );


        const increaseButton =
            document.getElementById(
                "increaseQuantity"
            );


        const addToCartButton =
            document.getElementById(
                "addToCartBtn"
            );


        const orderNowButton =
            document.getElementById(
                "orderNowBtn"
            );


        /* ================================
           UPDATE QUANTITY
        ================================= */

        function updateQuantity() {

            quantityDisplay.textContent =
                quantity;

        }


        /* ================================
           DECREASE
        ================================= */

        decreaseButton.addEventListener(
            "click",
            () => {

                if (quantity > 1) {

                    quantity--;

                    updateQuantity();

                }

            }
        );


        /* ================================
           INCREASE
        ================================= */

        increaseButton.addEventListener(
            "click",
            () => {

                quantity++;

                updateQuantity();

            }
        );


        /* ================================
           ADD TO CART
        ================================= */

        addToCartButton.addEventListener(
            "click",
            () => {

                let cart =
                    JSON.parse(
                        localStorage.getItem(
                            "softinaCart"
                        )
                    ) || [];


                const existing =
                    cart.find(
                        cartItem =>
                            cartItem.id === item.id
                    );


                if (existing) {

                    existing.quantity +=
                        quantity;

                }

                else {

                    cart.push({

                        id: item.id,

                        name: item.name,

                        category:
                            item.categoryName,

                        image: item.image,

                        quantity: quantity

                    });

                }


                localStorage.setItem(
                    "softinaCart",
                    JSON.stringify(cart)
                );


                alert(
                    `${item.name} added to your order.`
                );


                window.location.href =
                    "cart.html";

            }
        );


        /* ================================
           ORDER NOW
        ================================= */

        orderNowButton.addEventListener(
            "click",
            () => {

                let message =

                    "Hello Softina Natural Ventures,%0A%0A" +

                    "*PRODUCT ORDER*%0A%0A" +

                    `Product: ${encodeURIComponent(
                        item.name
                    )}%0A` +

                    `Category: ${encodeURIComponent(
                        item.categoryName
                    )}%0A` +

                    `Quantity: ${quantity}%0A%0A` +

                    "Please confirm the current price, " +
                    "availability and delivery information.%0A%0A" +

                    "Thank you.";


                const whatsappURL =

                    `https://wa.me/${whatsappNumber}` +
                    `?text=${message}`;


                window.open(
                    whatsappURL,
                    "_blank"
                );

            }
        );

    }


    /* =====================================
       SERVICE REQUEST
    ===================================== */

    if (isService) {

        const requestButton =
            document.getElementById(
                "requestServiceBtn"
            );


        requestButton.addEventListener(
            "click",
            () => {

                const message =

                    "Hello Softina Natural Ventures,%0A%0A" +

                    "*SERVICE REQUEST*%0A%0A" +

                    `Service: ${encodeURIComponent(
                        item.name
                    )}%0A` +

                    `Category: ${encodeURIComponent(
                        item.categoryName
                    )}%0A%0A` +

                    "I would like to request more information " +
                    "about this service.%0A%0A" +

                    "Please provide the available " +
                    "appointment/booking options, " +
                    "service details and applicable charges.%0A%0A" +

                    "Thank you.";


                const whatsappURL =

                    `https://wa.me/${whatsappNumber}` +
                    `?text=${message}`;


                window.open(
                    whatsappURL,
                    "_blank"
                );

            }
        );

    }

}


/* =========================================
   FOOTER YEAR
========================================= */

const yearElement =
    document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}