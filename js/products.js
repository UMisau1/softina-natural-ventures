/* =========================================================
   SOFTINA NATURAL VENTURES
   PRODUCTS SYSTEM V4.0
========================================================= */

const products = SOFTINA_PRODUCTS;


/* =========================================================
   DISPLAY PRODUCTS
========================================================= */

function displayProducts(productList) {

    const productsGrid =
        document.getElementById("productsGrid");

    if (!productsGrid) return;

    productsGrid.innerHTML = "";

    if (!productList || productList.length === 0) {

        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fa-solid fa-box-open"></i>
                <h3>No products found</h3>
                <p>
                    We could not find anything in this category.
                </p>
            </div>
        `;

        return;
    }


    productList.forEach(product => {

        const card =
            document.createElement("article");

        card.className = "product-card";


        /* =================================================
           IMAGE
        ================================================= */

        const image =
            product.image
                ? product.image
                : "images/products/product-1.jpg";


        /* =================================================
           TYPE
        ================================================= */

        const isProduct =
            product.type === "product";


        const typeLabel =
            isProduct
                ? "Product"
                : "Service";


        /* =================================================
           PRICE
        ================================================= */

        let priceHTML = "";

        if (isProduct) {

            if (product.price) {

                priceHTML = `
                    <div class="product-price">

                        <strong>
                            ₦${Number(product.price)
                                .toLocaleString()}
                        </strong>

                        ${
                            product.oldPrice
                            ? `
                                <del>
                                    ₦${Number(product.oldPrice)
                                        .toLocaleString()}
                                </del>
                            `
                            : ""
                        }

                    </div>
                `;

            } else {

                priceHTML = `
                    <div class="contact-price">
                        Price on request
                    </div>
                `;
            }

        } else {

            priceHTML = `
                <div class="contact-price">
                    Contact us for details
                </div>
            `;
        }


        /* =================================================
           BADGES
        ================================================= */

        let badges = "";

        if (product.isNew) {

            badges += `
                <span class="product-badge new-badge">
                    New
                </span>
            `;
        }


        if (
            product.oldPrice &&
            product.price &&
            Number(product.oldPrice) >
            Number(product.price)
        ) {

            const discount =
                Math.round(
                    (
                        1 -
                        Number(product.price) /
                        Number(product.oldPrice)
                    ) * 100
                );

            badges += `
                <span class="product-badge discount-badge">
                    -${discount}%
                </span>
            `;
        }


        /* =================================================
           SIZE
        ================================================= */

        let sizeHTML = "";

        if (product.size) {

            sizeHTML = `
                <span class="product-size">
                    <i class="fa-solid fa-box"></i>
                    ${product.size}
                </span>
            `;
        }


        /* =================================================
           STOCK
        ================================================= */

        let stockHTML = "";

        if (isProduct) {

            if (product.available !== false) {

                stockHTML = `
                    <div class="stock available">
                        <i class="fa-solid fa-circle-check"></i>
                        Available
                    </div>
                `;

            } else {

                stockHTML = `
                    <div class="stock unavailable">
                        <i class="fa-solid fa-circle-xmark"></i>
                        Currently unavailable
                    </div>
                `;
            }
        }


        /* =================================================
           MAIN ACTION
        ================================================= */

        let actionHTML = "";

        if (isProduct) {

            if (product.available !== false) {

                actionHTML = `
                    <button
                        class="product-action"
                        onclick="addProductToCart(${product.id})"
                    >
                        <i class="fa-solid fa-cart-plus"></i>
                        Add to Order
                    </button>
                `;

            } else {

                actionHTML = `
                    <button
                        class="product-action disabled"
                        disabled
                    >
                        <i class="fa-solid fa-ban"></i>
                        Unavailable
                    </button>
                `;
            }

        } else {

            actionHTML = `
                <button
                    class="product-action service-action"
                    onclick="requestProductService(${product.id})"
                >
                    <i class="fa-brands fa-whatsapp"></i>
                    Request Service
                </button>
            `;
        }


        /* =================================================
           CARD
        ================================================= */

        card.innerHTML = `

            <div class="product-image">

                ${badges}

                <img
                    src="${image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>


            <div class="product-content">

                <span class="product-category">
                    ${product.category || typeLabel}
                </span>


                <h3>
                    ${product.name}
                </h3>


                <p>
                    ${
                        product.shortDescription ||
                        product.description ||
                        ""
                    }
                </p>


                ${priceHTML}

                ${sizeHTML}

                ${stockHTML}


                <div class="product-buttons">

                    <a
                        href="product-details.html?id=${product.id}"
                        class="details-button"
                    >
                        <i class="fa-solid fa-eye"></i>

                        ${
                            isProduct
                            ? "View Product"
                            : "View Service"
                        }

                    </a>


                    ${actionHTML}

                </div>

            </div>
        `;


        productsGrid.appendChild(card);

    });
}


/* =========================================================
   ADD PRODUCT TO CART
========================================================= */

function addProductToCart(productId) {

    const product =
        products.find(
            item =>
                Number(item.id) === Number(productId)
        );


    if (!product) {
        alert("Product not found.");
        return;
    }


    if (product.type !== "product") {

        alert(
            "This item is a service. Please use Request Service."
        );

        return;
    }


    if (product.available === false) {

        alert(
            "This product is currently unavailable."
        );

        return;
    }


    if (typeof addSoftinaToCart === "function") {

        addSoftinaToCart(product);

    } else {

        /* Fallback */

        let cart = [];

        try {
            cart =
                JSON.parse(
                    localStorage.getItem("softinaCart")
                ) || [];
        } catch (error) {
            cart = [];
        }


        const existing =
            cart.find(
                item =>
                    Number(item.id) ===
                    Number(product.id)
            );


        if (existing) {

            existing.quantity =
                Number(existing.quantity || 0) + 1;

        } else {

            cart.push({
                id: product.id,
                name: product.name,
                category: product.category,
                image: product.image,
                price: product.price || null,
                quantity: 1
            });
        }


        localStorage.setItem(
            "softinaCart",
            JSON.stringify(cart)
        );
    }


    updateSoftinaCartCount();
}


/* =========================================================
   REQUEST SERVICE
========================================================= */

function requestProductService(productId) {

    const service =
        products.find(
            item =>
                Number(item.id) === Number(productId)
        );


    if (!service) {

        alert("Service not found.");

        return;
    }


    if (
        typeof requestSoftinaService ===
        "function"
    ) {

        requestSoftinaService(service);

        return;
    }


    const whatsappNumber =
        "2347036270880";


    const message =
`Hello Softina Natural Ventures,

I would like to request the following service:

Service: ${service.name}

Please provide me with more information about the service, availability and charges.

Thank you.`;


    const url =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


    window.open(url, "_blank");
}


/* =========================================================
   SEARCH PRODUCTS
========================================================= */

function searchProducts() {

    const searchInput =
        document.getElementById("productSearch");

    if (!searchInput) return;


    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const filtered =
        products.filter(product => {

            const name =
                (product.name || "")
                    .toLowerCase();

            const category =
                (product.category || "")
                    .toLowerCase();

            const description =
                (
                    product.description ||
                    product.shortDescription ||
                    ""
                ).toLowerCase();


            return (
                name.includes(searchTerm) ||
                category.includes(searchTerm) ||
                description.includes(searchTerm)
            );
        });


    displayProducts(filtered);
}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function filterProducts() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (!categoryFilter) return;


    const selected =
        categoryFilter.value;


    if (
        !selected ||
        selected === "all"
    ) {

        displayProducts(products);

        return;
    }


    const filtered =
        products.filter(
            product =>
                product.category === selected
        );


    displayProducts(filtered);
}


/* =========================================================
   APPLY CATEGORY FROM URL
========================================================= */

function applyCategoryFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category");


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (!category) {

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        displayProducts(products);

        return;
    }


    const categoryExists =
        products.some(
            product =>
                product.category === category
        );


    if (!categoryExists) {

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        displayProducts(products);

        return;
    }


    if (categoryFilter) {
        categoryFilter.value = category;
    }


    const filtered =
        products.filter(
            product =>
                product.category === category
        );


    displayProducts(filtered);
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const searchInput =
            document.getElementById(
                "productSearch"
            );


        const categoryFilter =
            document.getElementById(
                "categoryFilter"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchProducts
            );
        }


        if (categoryFilter) {

            categoryFilter.addEventListener(
                "change",
                filterProducts
            );
        }


        applyCategoryFromURL();


        if (
            typeof updateSoftinaCartCount ===
            "function"
        ) {

            updateSoftinaCartCount();
        }

    }
);