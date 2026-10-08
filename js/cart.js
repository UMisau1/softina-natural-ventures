/* =========================================
   SOFTINA NATURAL VENTURES
   CART SYSTEM V3.0
========================================= */


/* =========================================
   GET CART
========================================= */

function getCart() {

    return JSON.parse(
        localStorage.getItem("softinaCart")
    ) || [];

}


/* =========================================
   SAVE CART
========================================= */

function saveCart(cart) {

    localStorage.setItem(
        "softinaCart",
        JSON.stringify(cart)
    );

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

            element.textContent = totalQuantity;

        });

}


/* =========================================
   DISPLAY CART
========================================= */

function displayCart() {

    const cartContainer =
        document.getElementById("cartContainer");

    if (!cartContainer) return;


    const cart = getCart();


    /* =====================================
       EMPTY CART
    ===================================== */

    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <h2>
                    Your Order is Empty
                </h2>

                <p>
                    You have not selected any
                    product yet.
                </p>

                <a
                    href="products.html"
                    class="continue-shopping"
                >
                    <i class="fa-solid fa-store"></i>
                    Browse Products
                </a>

            </div>

        `;

        updateCartCount();

        return;

    }


    /* =====================================
       CART ITEMS
    ===================================== */

    let html = `

        <div class="cart-items">

    `;


    cart.forEach(
        (item, index) => {

            html += `

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >


                    <div>

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ${item.category || ""}
                        </p>


                        <div class="cart-quantity">

                            <button
                                onclick="decreaseQuantity(${index})"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>


                            <strong>
                                ${item.quantity}
                            </strong>


                            <button
                                onclick="increaseQuantity(${index})"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        class="remove-btn"
                        onclick="removeItem(${index})"
                    >

                        <i class="fa-solid fa-trash"></i>

                        Remove

                    </button>

                </div>

            `;

        }
    );


    html += `

        </div>


        <div class="cart-summary">

            <h2>
                Order Summary
            </h2>


            <p>

                <strong>
                    ${getTotalQuantity(cart)}
                </strong>

                item(s) selected.

            </p>


            <a
                href="checkout.html"
                class="whatsapp-order checkout-button"
            >

                <i class="fa-solid fa-arrow-right"></i>

                Proceed to Checkout

            </a>


            <a
                href="products.html"
                class="continue-shopping"
            >

                <i class="fa-solid fa-arrow-left"></i>

                Continue Shopping

            </a>

        </div>

    `;


    cartContainer.innerHTML = html;


    updateCartCount();

}


/* =========================================
   TOTAL QUANTITY
========================================= */

function getTotalQuantity(cart) {

    return cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

}


/* =========================================
   INCREASE QUANTITY
========================================= */

function increaseQuantity(index) {

    const cart = getCart();


    if (!cart[index]) return;


    cart[index].quantity =
        Number(cart[index].quantity || 0) + 1;


    saveCart(cart);


    displayCart();

}


/* =========================================
   DECREASE QUANTITY
========================================= */

function decreaseQuantity(index) {

    const cart = getCart();


    if (!cart[index]) return;


    const currentQuantity =
        Number(cart[index].quantity || 0);


    if (currentQuantity > 1) {

        cart[index].quantity =
            currentQuantity - 1;

    }


    saveCart(cart);


    displayCart();

}


/* =========================================
   REMOVE ITEM
========================================= */

function removeItem(index) {

    const cart = getCart();


    if (!cart[index]) return;


    const itemName =
        cart[index].name;


    const confirmRemove =
        confirm(
            `Remove "${itemName}" from your order?`
        );


    if (!confirmRemove) return;


    cart.splice(
        index,
        1
    );


    saveCart(cart);


    displayCart();

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

displayCart();