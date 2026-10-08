/* =========================================
   SOFTINA NATURAL VENTURES
   CHECKOUT SYSTEM V3.0
========================================= */

const whatsappNumber = "2347036270880";


/* =========================================
   GET CART
========================================= */

function getCart() {

    return JSON.parse(
        localStorage.getItem("softinaCart")
    ) || [];

}


/* =========================================
   UPDATE CART COUNT
========================================= */

function updateCartCount() {

    const cart = getCart();

    const totalQuantity = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    document
        .querySelectorAll("#cartCount")
        .forEach(element => {

            element.textContent =
                totalQuantity;

        });

}


/* =========================================
   DISPLAY CHECKOUT
========================================= */

function displayCheckout() {

    const container =
        document.getElementById(
            "checkoutItems"
        );

    const totalItems =
        document.getElementById(
            "totalItems"
        );

    if (!container) return;


    const cart = getCart();


    /* =====================================
       EMPTY CART
    ===================================== */

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-checkout">

                <i class="fa-solid fa-cart-shopping"></i>

                <h3>
                    Your Order is Empty
                </h3>

                <p>
                    Please select a product
                    before proceeding.
                </p>

                <a href="products.html">

                    <i class="fa-solid fa-store"></i>

                    Browse Products

                </a>

            </div>

        `;


        if (totalItems) {

            totalItems.textContent = "0";

        }


        updateCartCount();

        return;

    }


    /* =====================================
       DISPLAY PRODUCTS
    ===================================== */

    let html = "";

    let totalQuantity = 0;


    cart.forEach(
        item => {

            const quantity =
                Number(item.quantity || 0);


            totalQuantity += quantity;


            html += `

                <div class="checkout-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >


                    <div class="checkout-item-info">

                        <h3>
                            ${item.name}
                        </h3>


                        <p>
                            ${item.category || ""}
                        </p>


                        <strong>

                            Quantity:

                            ${quantity}

                        </strong>

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML = html;


    if (totalItems) {

        totalItems.textContent =
            totalQuantity;

    }


    updateCartCount();

}


/* =========================================
   FORM SUBMISSION
========================================= */

const checkoutForm =
    document.getElementById(
        "checkoutForm"
    );


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const cart =
                getCart();


            /* =============================
               CHECK CART
            ============================= */

            if (cart.length === 0) {

                alert(
                    "Your order is empty. Please select a product first."
                );

                return;

            }


            /* =============================
               CUSTOMER INFORMATION
            ============================= */

            const customerName =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "phone"
                    )
                    .value
                    .trim();


            const state =
                document
                    .getElementById(
                        "state"
                    )
                    .value
                    .trim();


            const lga =
                document
                    .getElementById(
                        "lga"
                    )
                    .value
                    .trim();


            const address =
                document
                    .getElementById(
                        "address"
                    )
                    .value
                    .trim();


            const deliveryMethod =
                document
                    .getElementById(
                        "deliveryMethod"
                    )
                    .value;


            const notes =
                document
                    .getElementById(
                        "notes"
                    )
                    .value
                    .trim();


            /* =============================
               VALIDATION
            ============================= */

            if (
                !customerName ||
                !phone ||
                !state ||
                !lga ||
                !address ||
                !deliveryMethod
            ) {

                alert(
                    "Please complete all required customer information."
                );

                return;

            }


            /* =============================
               ORDER DETAILS
            ============================= */

            let productMessage = "";


            cart.forEach(
                (item, index) => {

                    productMessage +=

                        `${index + 1}. *${item.name}*%0A` +

                        `Category: ${item.category || ""}%0A` +

                        `Quantity: ${item.quantity}%0A%0A`;

                }
            );


            /* =============================
               WHATSAPP MESSAGE
            ============================= */

            let message =

                "Hello Softina Natural Ventures,%0A%0A" +

                "*NEW PRODUCT ORDER*%0A%0A" +


                "*CUSTOMER INFORMATION*%0A%0A" +

                `Name: ${encodeURIComponent(
                    customerName
                )}%0A` +

                `Phone: ${encodeURIComponent(
                    phone
                )}%0A` +

                `State: ${encodeURIComponent(
                    state
                )}%0A` +

                `LGA: ${encodeURIComponent(
                    lga
                )}%0A` +

                `Delivery Address: ${encodeURIComponent(
                    address
                )}%0A` +

                `Delivery Method: ${encodeURIComponent(
                    deliveryMethod
                )}%0A%0A` +


                "*ORDER DETAILS*%0A%0A" +

                productMessage;


            /* =============================
               CUSTOMER NOTES
            ============================= */

            if (notes !== "") {

                message +=

                    "*CUSTOMER NOTES*%0A%0A" +

                    `${encodeURIComponent(
                        notes
                    )}%0A%0A`;

            }


            /* =============================
               FINAL MESSAGE
            ============================= */

            message +=

                "Please confirm product availability, " +

                "current price and delivery information.%0A%0A" +

                "Thank you.";


            /* =============================
               WHATSAPP URL
            ============================= */

            const whatsappURL =
                `https://wa.me/${whatsappNumber}?text=${message}`;


            /* =============================
               OPEN WHATSAPP
            ============================= */

            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

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


/* =========================================
   INITIALIZE
========================================= */

updateCartCount();

displayCheckout();