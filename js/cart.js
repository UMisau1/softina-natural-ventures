// ==========================================
// SOFTINA NATURAL VENTURES
// CART / ORDER SYSTEM
// ==========================================

const whatsappNumber = "2347036270880";


// GET CART
function getCart() {

    return JSON.parse(
        localStorage.getItem("softinaCart")
    ) || [];

}


// SAVE CART
function saveCart(cart) {

    localStorage.setItem(
        "softinaCart",
        JSON.stringify(cart)
    );

}


// DISPLAY CART
function displayCart() {

    const cartContainer =
        document.getElementById("cartContainer");

    const cart = getCart();


    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <h2>Your order is empty</h2>

                <p>
                    You have not selected any product yet.
                </p>

                <a
                    href="products.html"
                    class="continue-shopping">

                    Browse Products

                </a>


        `;

        return;

    }


    let html = `
        <div class="cart-items">
    `;


    cart.forEach((item, index) => {

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
                        ${item.category}
                    </p>


                    <div class="cart-quantity">

                        <button
                            onclick="decreaseQuantity(${index})">
                            -
                        </button>

                        <strong>
                            ${item.quantity}
                        </strong>

                        <button
                            onclick="increaseQuantity(${index})">
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="remove-btn"
                    onclick="removeItem(${index})">

                    <i class="fa-solid fa-trash"></i>

                    Remove

                </button>

            </div>

        `;

    });


    html += `
        </div>

        <div class="cart-summary">

            <h2>
                Order Summary
            </h2>

            <p>
                <strong>
                    ${cart.length}
                </strong>
                product(s) selected.
            </p>


            <button
                class="whatsapp-order"
                onclick="sendOrder()">

                <i class="fa-brands fa-whatsapp"></i>

                Send Order via WhatsApp

            </button>


            <a
                href="products.html"
                class="continue-shopping">

                <i class="fa-solid fa-arrow-left"></i>

                Continue Shopping

            </a>

        </div>
    `;


    cartContainer.innerHTML = html;

}


// INCREASE
function increaseQuantity(index) {

    const cart = getCart();

    cart[index].quantity++;

    saveCart(cart);

    displayCart();

}


// DECREASE
function decreaseQuantity(index) {

    const cart = getCart();

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    }

    saveCart(cart);

    displayCart();

}


// REMOVE
function removeItem(index) {

    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    displayCart();

}


// SEND ORDER
function sendOrder() {

    const cart = getCart();

    if (cart.length === 0) {

        alert("Your order is empty.");

        return;

    }


    let message =
        "Hello Softina Natural Ventures,%0A%0A" +
        "I would like to place an order:%0A%0A";


    cart.forEach((item, index) => {

        message +=
            `${index + 1}. ${item.name}%0A` +
            `Category: ${item.category}%0A` +
            `Quantity: ${item.quantity}%0A%0A`;

    });


    message +=
        "Please confirm availability, current price and delivery information.%0A%0A" +
        "Thank you.";


    const url =
        `https://wa.me/${whatsappNumber}?text=${message}`;


    window.open(
        url,
        "_blank"
    );

}


// YEAR
document.getElementById("year").textContent =
    new Date().getFullYear();


// INITIALIZE
displayCart();
