/* =========================================
   SOFTINA NATURAL VENTURES
   CHECKOUT + SUPABASE ORDER SUBMISSION
========================================= */

"use strict";

const whatsappNumber = "2347036270880";
const cartStorageKey = "softinaCart";

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Unable to read cart:", error);
        return [];
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[character]));
}

function updateCartCount() {
    const totalQuantity = getCart().reduce(
        (total, item) => total + Math.max(0, Number(item.quantity || 0)),
        0
    );

    document.querySelectorAll("#cartCount").forEach(element => {
        element.textContent = totalQuantity;
    });
}

function displayCheckout() {
    const container = document.getElementById("checkoutItems");
    const totalItems = document.getElementById("totalItems");
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-checkout">
                <i class="fa-solid fa-cart-shopping"></i>
                <h3>Your Order is Empty</h3>
                <p>Please select a product before proceeding.</p>
                <a href="products.html">
                    <i class="fa-solid fa-store"></i>
                    Browse Products
                </a>
            </div>
        `;
        if (totalItems) totalItems.textContent = "0";
        updateCartCount();
        return;
    }

    let totalQuantity = 0;
    container.innerHTML = cart.map(item => {
        const quantity = Math.max(0, Number(item.quantity || 0));
        totalQuantity += quantity;

        return `
            <div class="checkout-item">
                <img src="${escapeHTML(item.image || "images/products/product-1.jpg")}"
                     alt="${escapeHTML(item.name || "Product")}">
                <div class="checkout-item-info">
                    <h3>${escapeHTML(item.name || "Product")}</h3>
                    <p>${escapeHTML(item.category || "")}</p>
                    <strong>Quantity: ${quantity}</strong>
                </div>
            </div>
        `;
    }).join("");

    if (totalItems) totalItems.textContent = totalQuantity;
    updateCartCount();
}

function showCheckoutError(message) {
    alert(message);
}

function getFieldValue(id) {
    const field = document.getElementById(id);
    return field ? field.value.trim() : "";
}

function buildWhatsAppMessage(customer, deliveryMethod, notes, order) {
    const itemLines = (order.items || []).map((item, index) => {
        const lineTotal = Number(item.line_total || 0).toLocaleString("en-NG");
        const unitPrice = Number(item.unit_price || 0).toLocaleString("en-NG");

        return [
            `${index + 1}. ${item.product_name}`,
            `Quantity: ${item.quantity}`,
            `Unit Price: ₦${unitPrice}`,
            `Line Total: ₦${lineTotal}`
        ].join("\n");
    }).join("\n\n");

    const total = Number(order.total || 0).toLocaleString("en-NG");

    return [
        "Hello Softina Natural Ventures,",
        "",
        "NEW PRODUCT ORDER",
        `Order Number: ${order.order_number}`,
        "",
        "CUSTOMER INFORMATION",
        `Name: ${customer.full_name}`,
        `Phone: ${customer.phone}`,
        customer.email ? `Email: ${customer.email}` : "",
        `State: ${customer.state}`,
        `LGA: ${customer.lga}`,
        `Delivery Address: ${customer.address}`,
        `Delivery Method: ${deliveryMethod}`,
        "",
        "ORDER DETAILS",
        itemLines,
        "",
        `Order Total: ₦${total}`,
        "Delivery Fee: To be confirmed",
        "",
        notes ? `CUSTOMER NOTES\n${notes}\n` : "",
        "Please confirm this order and provide delivery arrangements.",
        "Thank you."
    ].filter(Boolean).join("\n");
}

async function submitCheckout(event) {
    event.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
        showCheckoutError("Your order is empty. Please select a product first.");
        return;
    }

    const customer = {
        full_name: getFieldValue("customerName"),
        phone: getFieldValue("phone"),
        state: getFieldValue("state"),
        lga: getFieldValue("lga"),
        address: getFieldValue("address"),
        email: getFieldValue("email") || null
    };

    const deliveryMethod = getFieldValue("deliveryMethod");
    const notes = getFieldValue("notes");

    if (!customer.full_name || !customer.phone || !customer.state ||
        !customer.lga || !customer.address || !deliveryMethod) {
        showCheckoutError("Please complete all required customer information.");
        return;
    }

    const items = cart.map(item => ({
        id: item.id,
        quantity: Number(item.quantity || 0)
    }));

    if (items.some(item => !item.id || !Number.isInteger(item.quantity) ||
        item.quantity < 1 || item.quantity > 99)) {
        showCheckoutError("Your cart contains an invalid item or quantity. Please review your cart.");
        return;
    }

    const supabase = window.softinaSupabase;
    if (!supabase || typeof supabase.rpc !== "function") {
        showCheckoutError("The order service is not connected. Please refresh the page and try again.");
        return;
    }

    const submitButton = checkoutForm.querySelector('button[type="submit"]');
    const originalButtonHTML = submitButton ? submitButton.innerHTML : "";

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Saving Order...";
    }

    // Open a temporary tab immediately to avoid browser popup blocking after the database request.
    const whatsappWindow = window.open("about:blank", "_blank");

    try {
        const { data, error } = await supabase.rpc("submit_softina_order", {
            p_customer: customer,
            p_items: items,
            p_delivery_method: deliveryMethod,
            p_customer_note: notes || null
        });

        if (error) throw error;
        if (!data || data.success !== true || !data.order_number) {
            throw new Error("The order could not be confirmed by the order service.");
        }

        const message = buildWhatsAppMessage(customer, deliveryMethod, notes, data);
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        if (whatsappWindow && !whatsappWindow.closed) {
            whatsappWindow.location.href = whatsappURL;
        } else {
            window.location.href = whatsappURL;
        }

        // Keep the cart intact so the customer can still review it after submitting.
    } catch (error) {
        console.error("Order submission failed:", error);

        if (whatsappWindow && !whatsappWindow.closed) {
            whatsappWindow.close();
        }

        let message = error && error.message ? error.message : "Unable to save your order.";
        if (message.includes("price has not yet been entered")) {
            message += "\n\nPlease contact Softina or choose another item whose price is available.";
        } else if (message.includes("currently unavailable")) {
            message += "\n\nPlease remove that item from your cart or contact Softina.";
        }

        showCheckoutError(`Order not saved.\n\n${message}`);
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
        }
    }
}

const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
    checkoutForm.addEventListener("submit", submitCheckout);
}

const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

updateCartCount();
displayCheckout();
