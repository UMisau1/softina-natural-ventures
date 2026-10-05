// ========================================
// SOFTINA NATURAL VENTURES
// PRODUCT DETAILS
// ========================================

const whatsappNumber = "2347036270880";


// PRODUCTS
const products = [

    {
        id: 1,
        name: "Natural Supplement",
        category: "Natural Supplements",
        description:
            "Natural supplement product from Softina Natural Ventures. Contact our team for complete product information, availability and usage guidance.",
        price: null,
        image: "images/products/product-1.jpg"
    },

    {
        id: 2,
        name: "Herbal Tea",
        category: "Herbal Tea",
        description:
            "Herbal tea prepared in a convenient tea-bag format. Contact Softina Natural Ventures for product information and availability.",
        price: null,
        image: "images/products/product-2.jpg"
    },

    {
        id: 3,
        name: "Natural Cosmetics",
        category: "Natural Cosmetics",
        description:
            "Natural cosmetic products designed for personal care. Contact us for product information and availability.",
        price: null,
        image: "images/products/product-3.jpg"
    },

    {
        id: 4,
        name: "Natural Oil",
        category: "Natural Oils",
        description:
            "Natural extracted oil from Softina Natural Ventures. Contact us for product information, availability and price.",
        price: null,
        image: "images/products/product-4.jpg"
    }

];


// GET PRODUCT ID
const urlParams = new URLSearchParams(window.location.search);

const productId = Number(urlParams.get("id"));


// FIND PRODUCT
const product = products.find(item => item.id === productId);


// PAGE ELEMENT
const container =
    document.getElementById("productDetails");


// IF PRODUCT DOES NOT EXIST
if (!product) {

    container.innerHTML = `
        <div class="details-card">
            <div class="details-info">
                <h1>Product Not Found</h1>

                <p>
                    Sorry, we could not find this product.
                </p>

                <br>

                <a href="products.html" class="back-products">
                    Back to Products
                </a>
            </div>
        </div>
    `;

}


// PRODUCT EXISTS
else {

    const priceText = product.price === null
        ? "Contact us for price"
        : "₦" + product.price.toLocaleString("en-NG");


    container.innerHTML = `

        <div class="details-card">

            <div class="details-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="details-info">

                <span class="details-category">
                    ${product.category}
                </span>


                <h1>
                    ${product.name}
                </h1>


                <p class="details-description">
                    ${product.description}
                </p>


                <div class="details-price">
                    ${priceText}
                </div>


                <label>
                    Quantity
                </label>


                <div class="quantity-box">

                    <button
                        type="button"
                        id="minusBtn">
                        -
                    </button>


                    <input
                        type="number"
                        id="quantity"
                        value="1"
                        min="1"
                    >


                    <button
                        type="button"
                        id="plusBtn">
                        +
                    </button>

                </div>


                <button
                    class="order-now"
                    id="orderButton">

                    <i class="fa-brands fa-whatsapp"></i>

                    Order via WhatsApp

                </button>


                <div class="notice">

                    <strong>Important:</strong>

                    Product information, availability,
                    price and appropriate usage should be
                    confirmed directly with Softina Natural
                    Ventures before purchase.

                </div>

            </div>

        </div>

    `;


    const quantity =
        document.getElementById("quantity");


    document
        .getElementById("plusBtn")
        .addEventListener("click", () => {

            quantity.value =
                Number(quantity.value) + 1;

        });


    document
        .getElementById("minusBtn")
        .addEventListener("click", () => {

            if (Number(quantity.value) > 1) {

                quantity.value =
                    Number(quantity.value) - 1;

            }

        });


    document
        .getElementById("orderButton")
        .addEventListener("click", () => {

            let qty = Number(quantity.value);

            if (!qty || qty < 1) {
                qty = 1;
            }


            const message =

`Hello Softina Natural Ventures,

I want to order a product.

Product: ${product.name}
Category: ${product.category}
Quantity: ${qty}

Please provide the current price, availability and delivery information.

Thank you.`;


            const whatsappURL =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


            window.open(
                whatsappURL,
                "_blank"
            );

        });

}


// YEAR
document.getElementById("year").textContent =
    new Date().getFullYear();