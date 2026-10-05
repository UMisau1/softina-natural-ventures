// =====================================
// SOFTINA NATURAL VENTURES
// PRODUCTS CATALOG V1.0
// =====================================

// BUSINESS WHATSAPP NUMBER
const whatsappNumber = "2347036270880";

// PRODUCTS DATABASE
const products = [

    {
        id: 1,
        name: "Natural Supplement",
        category: "supplements",
        categoryName: "Natural Supplements",
        description: "Natural supplement from Softina Natural Ventures.",
        price: null,
        image: "images/products/product-1.jpg"
    },

    {
        id: 2,
        name: "Herbal Tea",
        category: "herbal-tea",
        categoryName: "Herbal Tea",
        description: "Herbal tea packaged for convenient preparation.",
        price: null,
        image: "images/products/product-2.jpg"
    },

    {
        id: 3,
        name: "Natural Cosmetics",
        category: "cosmetics",
        categoryName: "Natural Cosmetics",
        description: "Natural cosmetic products for personal care.",
        price: null,
        image: "images/products/product-3.jpg"
    },

    {
        id: 4,
        name: "Natural Oil",
        category: "oils",
        categoryName: "Natural Oils",
        description: "Natural extracted oils from Softina.",
        price: null,
        image: "images/products/product-4.jpg"
    }

];


// DISPLAY PRODUCTS
const productsGrid = document.getElementById("productsGrid");

function displayProducts(items) {

    productsGrid.innerHTML = "";

    document.getElementById("noProducts").hidden =
        items.length !== 0;

    items.forEach(product => {

        const priceText = product.price === null
            ? "Contact us for price"
            : "₦" + product.price.toLocaleString("en-NG");

        const message =
            `Hello Softina Natural Ventures,%0A` +
            `I am interested in ordering:%0A` +
            `Product: ${encodeURIComponent(product.name)}%0A` +
            `Please provide more information.`;

        const orderLink =
            `https://wa.me/${whatsappNumber}?text=${message}`;

        const card = document.createElement("article");

        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.onerror = function() {
            this.style.display = "none";
        };

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.categoryName;

        const title = document.createElement("h3");
        title.textContent = product.name;

        const description = document.createElement("p");
        description.textContent = product.description;

        const price = document.createElement("div");
        price.className = "product-price";
        price.textContent = priceText;

        const detailsButton = document.createElement("a");

detailsButton.className = "order-btn";

detailsButton.href =
    `product-details.html?id=${product.id}`;

detailsButton.innerHTML =
    '<i class="fa-solid fa-eye"></i> View Product';
        button.href = orderLink;
        button.target = "_blank";
        button.rel = "noopener noreferrer";
        button.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Order Now';

        info.append(category, title, description, price, button);
        info.append(
    category,
    title,
    description,
    price,
    detailsButton
);


// SEARCH PRODUCTS
const productSearch =
    document.getElementById("productSearch");

const categoryFilter =
    document.getElementById("categoryFilter");

function filterProducts() {

    const searchValue =
        productSearch.value.toLowerCase().trim();

    const selectedCategory =
        categoryFilter.value;

    const filtered = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.description.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    displayProducts(filtered);

}

productSearch.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);


// COPYRIGHT YEAR
document.getElementById("year").textContent =
    new Date().getFullYear();


// INITIAL DISPLAY
displayProducts(products);
updateCartCount();

// ==========================================
// ADD PRODUCT TO CART
// ==========================================

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;


    let cart = JSON.parse(
        localStorage.getItem("softinaCart")
    ) || [];


    const existingProduct =
        cart.find(item => item.id === productId);


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            id: product.id,
            name: product.name,
            category: product.categoryName,
            image: product.image,
            quantity: 1

        });

    }


    localStorage.setItem(
        "softinaCart",
        JSON.stringify(cart)
    );


    updateCartCount();

    alert(
        `${product.name} has been added to your order.`
    );

}


// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("softinaCart")
        ) || [];


    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const cartCount =
        document.getElementById("cartCount");


    if (cartCount) {

        cartCount.textContent = count;

    }

}
    const detailsButton =
    document.createElement("a");

detailsButton.className =
    "order-btn";

detailsButton.href =
    `product-details.html?id=${product.id}`;

detailsButton.innerHTML =
    '<i class="fa-solid fa-eye"></i> View Product';


const cartButton =
    document.createElement("button");

cartButton.className =
    "order-btn";

cartButton.style.marginTop =
    "8px";

cartButton.style.border =
    "none";

cartButton.style.width =
    "100%";

cartButton.style.cursor =
    "pointer";

cartButton.innerHTML =
    '<i class="fa-solid fa-cart-plus"></i> Add to Order';


cartButton.addEventListener(
    "click",
    () => addToCart(product.id)
);


info.append(
    category,
    title,
    description,
    price,
    detailsButton,
    cartButton
);