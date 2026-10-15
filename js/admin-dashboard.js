
"use strict";

const ADMIN_SESSION_KEY = "softinaAdminSession";
const ADMIN_PRODUCTS_KEY = "softinaAdminProducts";
const ORDERS_KEY = "softinaOrders";

if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== "true") {
    window.location.replace("admin-login.html");
} else {
    initializeAdminDashboard();
}

function readArray(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
    } catch (error) {
        console.error(`Could not read ${key}:`, error);
        return [];
    }
}

function writeArray(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Could not save ${key}:`, error);
        alert("An kasa ajiye bayanan. Duba browser storage space.");
        return false;
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function formatNaira(value) {
    if (value === null || value === undefined || value === "") {
        return "Price on request";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "Price on request";
    }

    return "₦" + number.toLocaleString("en-NG", {
        maximumFractionDigits: 2
    });
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-GB");
}

function normalizeStatus(value) {
    const allowed = ["Pending", "Processing", "Completed", "Cancelled"];
    const match = allowed.find(status =>
        status.toLowerCase() === String(value || "").toLowerCase()
    );

    return match || "Pending";
}

function normalizeOrder(order, index) {
    const items = Array.isArray(order.items)
        ? order.items
        : Array.isArray(order.cart)
            ? order.cart
            : [];

    return {
        ...order,
        _adminId: String(order.id ?? order.orderId ?? order._id ?? `local-${index}`),
        _adminCustomer: String(
            order.customerName ??
            order.customer?.name ??
            order.name ??
            order.customer ??
            "Customer not recorded"
        ),
        _adminDate: order.date ?? order.createdAt ?? order.orderDate ?? "",
        _adminItems: items,
        _adminStatus: normalizeStatus(order.status)
    };
}

function initializeAdminDashboard() {
    const sections = document.querySelectorAll(".admin-section");
    const navLinks = document.querySelectorAll("[data-section]");

    function showSection(sectionId) {
        const target = document.getElementById(sectionId);

        if (!target || !target.classList.contains("admin-section")) {
            return;
        }

        sections.forEach(section => {
            section.classList.toggle("active", section.id === sectionId);
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.dataset.section === sectionId
            );
        });

        if (history.replaceState) {
            history.replaceState(null, "", `#${sectionId}`);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            showSection(link.dataset.section);
        });
    });

    document.querySelectorAll("[data-go]").forEach(button => {
        button.addEventListener("click", () => {
            showSection(button.dataset.go);
        });
    });

    const initialSection = window.location.hash.slice(1);
    showSection(
        document.getElementById(initialSection)?.classList.contains("admin-section")
            ? initialSection
            : "overview"
    );

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    document.getElementById("logoutButton").addEventListener("click", () => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.replace("admin-login.html");
    });

    initializeProductManagement();
    initializeOrdersManagement();
    initializeSettings();

    document.getElementById("refreshDashboard").addEventListener("click", () => {
        renderOverview();
        renderProducts();
        renderOrders();
    });

    renderOverview();
}

/* =========================
   PRODUCT MANAGEMENT
   ========================= */

function getAdminProducts() {
    return readArray(ADMIN_PRODUCTS_KEY);
}

function saveAdminProducts(products) {
    return writeArray(ADMIN_PRODUCTS_KEY, products);
}

function initializeProductManagement() {
    const form = document.getElementById("productForm");
    const search = document.getElementById("productSearch");

    document.getElementById("showProductForm").addEventListener("click", () => {
        resetProductForm();
        form.classList.remove("hidden");
        document.getElementById("productName").focus();
    });

    document.getElementById("cancelProductForm").addEventListener("click", () => {
        resetProductForm();
        form.classList.add("hidden");
    });

    search.addEventListener("input", renderProducts);

    form.addEventListener("submit", event => {
        event.preventDefault();

        const existingId = document.getElementById("productId").value;
        const name = document.getElementById("productName").value.trim();
        const category = document.getElementById("productCategory").value.trim();
        const priceText = document.getElementById("productPrice").value;
        const image = document.getElementById("productImage").value.trim();
        const description = document.getElementById("productDescription").value.trim();
        const status = document.getElementById("productStatus").value;

        if (!name || !category) {
            showProductMessage("Product name and category are required.", "error");
            return;
        }

        const price = priceText === "" ? null : Number(priceText);

        if (price !== null && (!Number.isFinite(price) || price < 0)) {
            showProductMessage("Enter a valid price.", "error");
            return;
        }

        const products = getAdminProducts();
        const productId = existingId || (
            "softina-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7)
        );

        const product = {
            id: productId,
            name,
            category,
            price,
            image,
            description,
            status,
            updatedAt: new Date().toISOString()
        };

        const index = products.findIndex(item =>
            String(item.id) === String(productId)
        );

        if (index >= 0) {
            products[index] = { ...products[index], ...product };
        } else {
            products.unshift(product);
        }

        if (!saveAdminProducts(products)) {
            showProductMessage("Could not save product.", "error");
            return;
        }

        showProductMessage(
            index >= 0 ? "Product updated successfully." : "Product added successfully.",
            "success"
        );

        renderProducts();
        renderOverview();

        window.setTimeout(() => {
            form.classList.add("hidden");
            resetProductForm();
        }, 700);
    });

    document.getElementById("productsTableBody").addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;
        const products = getAdminProducts();
        const product = products.find(item => String(item.id) === id);

        if (!product) return;

        if (action === "edit") {
            document.getElementById("productId").value = product.id;
            document.getElementById("productName").value = product.name || "";
            document.getElementById("productCategory").value = product.category || "";
            document.getElementById("productPrice").value =
                product.price ?? "";
            document.getElementById("productImage").value = product.image || "";
            document.getElementById("productDescription").value =
                product.description || "";
            document.getElementById("productStatus").value =
                product.status === "Unavailable" ? "Unavailable" : "Available";

            document.getElementById("productFormTitle").textContent = "Edit Product";
            document.getElementById("saveProductButton").textContent = "Update Product";
            document.getElementById("productForm").classList.remove("hidden");
            document.getElementById("productForm").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        if (action === "delete") {
            const confirmed = window.confirm(
                `Delete "${product.name}" from the local admin records?`
            );

            if (!confirmed) return;

            const updated = products.filter(item => String(item.id) !== id);

            if (saveAdminProducts(updated)) {
                renderProducts();
                renderOverview();
            }
        }
    });

    renderProducts();
}

function resetProductForm() {
    const form = document.getElementById("productForm");
    form.reset();

    document.getElementById("productId").value = "";
    document.getElementById("productFormTitle").textContent = "Add New Product";
    document.getElementById("saveProductButton").textContent = "Save Product";
    document.getElementById("productFormMessage").textContent = "";
    document.getElementById("productFormMessage").className = "form-message";
}

function showProductMessage(message, type) {
    const element = document.getElementById("productFormMessage");
    element.textContent = message;
    element.className = `form-message ${type}`;
}

function renderProducts() {
    const products = getAdminProducts();
    const query = document.getElementById("productSearch").value
        .trim()
        .toLowerCase();

    const filtered = products.filter(product =>
        String(product.name || "").toLowerCase().includes(query) ||
        String(product.category || "").toLowerCase().includes(query)
    );

    const body = document.getElementById("productsTableBody");
    const emptyMessage = document.getElementById("productsEmptyMessage");

    body.innerHTML = filtered.map(product => {
        const status = product.status === "Unavailable"
            ? "Unavailable"
            : "Available";

        const imageMarkup = product.image
            ? `<img src="${escapeHTML(product.image)}"
                    alt=""
                    loading="lazy"
                    onerror="this.style.display='none'">`
            : "";

        return `
            <tr>
                <td>
                    <div class="table-product">
                        ${imageMarkup}
                        <div>
                            <strong>${escapeHTML(product.name)}</strong>
                            <small>${escapeHTML(product.id)}</small>
                        </div>
                    </div>
                </td>
                <td>${escapeHTML(product.category || "—")}</td>
                <td>${escapeHTML(formatNaira(product.price))}</td>
                <td>
                    <span class="status-badge ${status.toLowerCase()}">
                        ${status}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button type="button" class="btn btn-secondary"
                            data-action="edit" data-id="${escapeHTML(product.id)}">
                            Edit
                        </button>
                        <button type="button" class="btn btn-danger"
                            data-action="delete" data-id="${escapeHTML(product.id)}">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    emptyMessage.classList.toggle("hidden", filtered.length > 0);

    if (products.length === 0) {
        emptyMessage.textContent =
            "No product records yet. Click Add Product to create the first record.";
    } else if (filtered.length === 0) {
        emptyMessage.textContent = "No products match your search.";
    }
}

/* =========================
   ORDERS MANAGEMENT
   ========================= */

function getAdminOrders() {
    return readArray(ORDERS_KEY).map(normalizeOrder);
}

function initializeOrdersManagement() {
    document.getElementById("refreshOrders").addEventListener("click", () => {
        renderOrders();
        renderOverview();
    });

    document.getElementById("orderStatusFilter").addEventListener("change", renderOrders);

    document.getElementById("ordersTableBody").addEventListener("change", event => {
        const select = event.target.closest("select[data-order-id]");

        if (!select) return;

        const id = select.dataset.orderId;
        const orders = readArray(ORDERS_KEY);

        const index = orders.findIndex((order, i) => {
            const normalized = normalizeOrder(order, i);
            return normalized._adminId === id;
        });

        if (index === -1) {
            alert("Order not found in local storage.");
            renderOrders();
            return;
        }

        orders[index].status = select.value;

        if (writeArray(ORDERS_KEY, orders)) {
            renderOrders();
            renderOverview();
        }
    });

    renderOrders();
}

function renderOrders() {
    const orders = getAdminOrders();
    const filter = document.getElementById("orderStatusFilter").value;

    const filtered = filter === "all"
        ? orders
        : orders.filter(order => order._adminStatus === filter);

    const body = document.getElementById("ordersTableBody");

    body.innerHTML = filtered.map(order => {
        const itemNames = order._adminItems.length
            ? order._adminItems.map(item =>
                `${item.name || item.productName || "Item"} × ${Number(item.quantity || 1)}`
            ).join(", ")
            : "Items not recorded";

        const statusOptions = ["Pending", "Processing", "Completed", "Cancelled"]
            .map(status => `
                <option value="${status}"
                    ${status === order._adminStatus ? "selected" : ""}>
                    ${status}
                </option>
            `).join("");

        return `
            <tr>
                <td>${escapeHTML(order._adminId)}</td>
                <td>${escapeHTML(order._adminCustomer)}</td>
                <td>${escapeHTML(itemNames)}</td>
                <td>${escapeHTML(formatDate(order._adminDate))}</td>
                <td>
                    <span class="status-badge ${order._adminStatus.toLowerCase()}">
                        ${escapeHTML(order._adminStatus)}
                    </span>
                </td>
                <td>
                    <select data-order-id="${escapeHTML(order._adminId)}"
                        aria-label="Update order ${escapeHTML(order._adminId)} status">
                        ${statusOptions}
                    </select>
                </td>
            </tr>
        `;
    }).join("");

    document.getElementById("ordersEmptyMessage").classList.toggle(
        "hidden",
        filtered.length > 0
    );

    renderRecentOrders(orders);
}

function renderRecentOrders(orders) {
    const body = document.getElementById("recentOrdersBody");
    const recent = [...orders].slice(0, 5);

    body.innerHTML = recent.map(order => `
        <tr>
            <td>${escapeHTML(order._adminId)}</td>
            <td>${escapeHTML(order._adminCustomer)}</td>
            <td>${escapeHTML(formatDate(order._adminDate))}</td>
            <td>
                <span class="status-badge ${order._adminStatus.toLowerCase()}">
                    ${escapeHTML(order._adminStatus)}
                </span>
            </td>
        </tr>
    `).join("");

    if (recent.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="4" class="muted">
                    No local orders found. Orders are not connected to the dashboard yet.
                </td>
            </tr>
        `;
    }
}

/* =========================
   DASHBOARD OVERVIEW
   ========================= */

function renderOverview() {
    const products = getAdminProducts();
    const orders = getAdminOrders();

    document.getElementById("statProducts").textContent = products.length;
    document.getElementById("statOrders").textContent = orders.length;

    document.getElementById("statPending").textContent =
        orders.filter(order => order._adminStatus === "Pending").length;

    document.getElementById("statCompleted").textContent =
        orders.filter(order => order._adminStatus === "Completed").length;

    renderRecentOrders(orders);
}

/* =========================
   SETTINGS / EXPORT
   ========================= */

function initializeSettings() {
    document.getElementById("exportProducts").addEventListener("click", () => {
        const products = getAdminProducts();
        const data = JSON.stringify(products, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "softina-admin-products.json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        document.getElementById("settingsMessage").textContent =
            "Product records export requested.";
        document.getElementById("settingsMessage").className =
            "form-message success";
    });
}