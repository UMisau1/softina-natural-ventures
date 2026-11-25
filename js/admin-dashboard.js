
"use strict";

const ADMIN_PRODUCTS_KEY = "softinaAdminProducts";
let supabaseOrders = [];
let ordersLoadError = "";
const supabaseClient = window.softinaSupabase;

(async function verifyAdminAndStart() {
    if (!supabaseClient) {
        alert("Ba a samu haɗin Supabase ba. Duba js/supabase-config.js.");
        window.location.replace("admin-login.html");
        return;
    }

    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
    const user = sessionData && sessionData.session && sessionData.session.user;
    if (sessionError || !user) {
        window.location.replace("admin-login.html");
        return;
    }

    const { data: roleRow, error: roleError } = await supabaseClient
        .from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
    if (roleError || !roleRow || roleRow.role !== "admin") {
        await supabaseClient.auth.signOut();
        window.location.replace("admin-login.html");
        return;
    }

    initializeAdminDashboard();
})();

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
    const allowed = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    const match = allowed.find(status => status === String(value || "").toLowerCase());
    return match || "pending";
}

function normalizePaymentStatus(value) {
    const allowed = ["unpaid", "pending", "paid", "failed", "refunded"];
    const match = allowed.find(status => status === String(value || "").toLowerCase());
    return match || "unpaid";
}

function getAdminOrders() {
    return supabaseOrders;
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

    document.getElementById("logoutButton").addEventListener("click", async () => {
        const button = document.getElementById("logoutButton");
        button.disabled = true;
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error("Supabase sign-out failed:", error);
            button.disabled = false;
            alert("An kasa fita daga account. Sake gwadawa.");
            return;
        }
        window.location.replace("admin-login.html");
    });

    initializeProductManagement();
    initializeOrdersManagement();
    initializeSettings();

    document.getElementById("refreshDashboard").addEventListener("click", async () => {
        renderProducts();
        await loadSupabaseOrders();
        renderOverview();
    });

    renderOverview();
}

/* =========================
   PRODUCT MANAGEMENT
   ========================= */

function getAdminProducts() {
    // One shared catalogue key is used by Admin Dashboard and the public shop.
    const saved = readArray("softinaCatalogProducts");
    const source = saved.length
        ? saved
        : (Array.isArray(window.SOFTINA_PRODUCTS) ? window.SOFTINA_PRODUCTS : []);

    return source.map(p => ({
        ...p,
        id: String(p.id),
        category: p.categoryName || p.category || "Other",
        status: p.available === false || p.status === "Unavailable"
            ? "Unavailable" : "Available"
    }));
}

function saveAdminProducts(products) {
    // Save directly to the same catalogue read by products.html.
    const current = readArray("softinaCatalogProducts");
    const updated = products.map(p => {
        const previous = current.find(item => String(item.id) === String(p.id)) || {};
        const categoryValue = String(p.category || p.categoryName || "other");
        return {
            ...previous,
            ...p,
            id: p.id,
            name: p.name,
            type: p.type || previous.type || "product",
            category: p.categoryKey || previous.category || categoryValue.toLowerCase().replace(/\s+/g, "-"),
            categoryName: categoryValue,
            shortDescription: p.shortDescription || previous.shortDescription || p.description || "",
            description: p.description || "",
            price: p.price === "" ? null : (p.price ?? null),
            oldPrice: p.oldPrice ?? previous.oldPrice ?? null,
            size: p.size || previous.size || "",
            stockStatus: p.status === "Unavailable" ? "Out of Stock" : (p.stockStatus || "Available"),
            image: p.image || previous.image || "images/products/product-1.jpg",
            featured: Boolean(p.featured ?? previous.featured),
            isNew: Boolean(p.isNew ?? previous.isNew),
            available: p.status !== "Unavailable"
        };
    });
    return writeArray("softinaCatalogProducts", updated);
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
   ORDERS MANAGEMENT - SUPABASE
   ========================= */

function unwrapOrdersResponse(payload) {
    // Supabase JSONB RPCs may return an array directly or an object wrapping it.
    let value = payload;
    if (typeof value === "string") {
        try { value = JSON.parse(value); } catch (_) { /* keep original for error below */ }
    }
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
        const candidates = [value.orders, value.data, value.results, value.records];
        for (const candidate of candidates) {
            if (Array.isArray(candidate)) return candidate;
            if (typeof candidate === "string") {
                try {
                    const parsed = JSON.parse(candidate);
                    if (Array.isArray(parsed)) return parsed;
                } catch (_) { /* try next candidate */ }
            }
        }
        if (value.success === true && !candidates.some(Array.isArray)) return [];
    }
    throw new Error("Amsar Supabase ba ta ƙunshi jerin orders ba. Duba admin_list_softina_orders RPC.");
}

function normalizeSupabaseOrder(order) {
    const items = order.items ?? order.order_items ?? order.orderItems ?? [];
    return {
        ...order,
        id: String(order.id ?? order.order_id ?? ""),
        order_number: order.order_number ?? order.orderNumber ?? order.order_no ?? "—",
        customer_name: order.customer_name ?? order.customerName ?? order.full_name ?? "Customer not recorded",
        phone: order.phone ?? order.customer_phone ?? "",
        email: order.email ?? "",
        delivery_address: order.delivery_address ?? order.deliveryAddress ?? order.address ?? "",
        delivery_lga: order.delivery_lga ?? order.deliveryLga ?? order.lga ?? "",
        delivery_state: order.delivery_state ?? order.deliveryState ?? order.state ?? "",
        total: order.total ?? order.grand_total ?? 0,
        created_at: order.created_at ?? order.createdAt ?? order.order_date ?? "",
        status: normalizeStatus(order.status ?? order.order_status),
        payment_status: normalizePaymentStatus(order.payment_status ?? order.paymentStatus),
        items: Array.isArray(items) ? items.map(item => ({
            ...item,
            product_name: item.product_name ?? item.productName ?? item.name ?? "Item",
            quantity: item.quantity ?? 1
        })) : []
    };
}

async function loadSupabaseOrders() {
    const refreshButton = document.getElementById("refreshOrders");
    const body = document.getElementById("ordersTableBody");
    if (refreshButton) refreshButton.disabled = true;
    if (body) body.innerHTML = '<tr><td colspan="7">Ana ɗauko orders daga Supabase...</td></tr>';
    ordersLoadError = "";

    try {
        if (!supabaseClient) throw new Error("Ba a samu Supabase client ba. Duba js/supabase-config.js.");
        const { data, error } = await supabaseClient.rpc("admin_list_softina_orders");
        if (error) throw error;
        const rows = unwrapOrdersResponse(data);
        supabaseOrders = rows.map(normalizeSupabaseOrder);
        if (supabaseOrders.some(order => !order.id)) {
            throw new Error("Akwai order da bai dawo da ID ba. Duba tsarin admin_list_softina_orders.");
        }
    } catch (error) {
        console.error("Could not load Supabase orders:", error);
        ordersLoadError = error?.message || String(error) || "Unable to load orders from Supabase.";
        supabaseOrders = [];
    } finally {
        if (refreshButton) refreshButton.disabled = false;
    }

    renderOrders();
    renderOverview();
}

function initializeOrdersManagement() {
    const refreshButton = document.getElementById("refreshOrders");
    const filter = document.getElementById("orderStatusFilter");
    const body = document.getElementById("ordersTableBody");
    if (refreshButton) refreshButton.addEventListener("click", loadSupabaseOrders);
    if (filter) filter.addEventListener("change", renderOrders);

    if (body) body.addEventListener("change", async event => {
        const select = event.target.closest("select[data-order-id][data-order-field]");
        if (!select) return;

        const order = supabaseOrders.find(item => item.id === select.dataset.orderId);
        if (!order) {
            alert("Ba a sami wannan order ba. Za a sake ɗauko orders.");
            await loadSupabaseOrders();
            return;
        }

        const field = select.dataset.orderField;
        const previousValue = field === "status" ? order.status : order.payment_status;
        const nextStatus = field === "status" ? select.value : order.status;
        const nextPayment = field === "payment_status" ? select.value : order.payment_status;
        select.disabled = true;

        try {
            const { error } = await supabaseClient.rpc("admin_update_softina_order", {
                p_order_id: order.id,
                p_status: nextStatus,
                p_payment_status: nextPayment
            });
            if (error) throw error;

            // Re-read from Supabase to confirm that the change was actually saved.
            await loadSupabaseOrders();
            const saved = supabaseOrders.find(item => item.id === order.id);
            const savedValue = saved && (field === "status" ? saved.status : saved.payment_status);
            const expectedValue = field === "status" ? nextStatus : nextPayment;
            if (!saved || savedValue !== expectedValue) {
                throw new Error("Ba a tabbatar da sauyin a Supabase ba. Duba admin_update_softina_order.");
            }
        } catch (error) {
            console.error("Order update failed:", error);
            alert("An kasa sabunta order: " + (error?.message || "Sake gwadawa."));
            select.disabled = false;
            select.value = previousValue;
        }
    });

    loadSupabaseOrders();
}

function renderOrders() {
    const orders = getAdminOrders();
    const filter = document.getElementById("orderStatusFilter").value;
    const filtered = filter === "all" ? orders : orders.filter(order => order.status === filter);
    const body = document.getElementById("ordersTableBody");

    if (ordersLoadError) {
        body.innerHTML = `<tr><td colspan="7">Could not load orders: ${escapeHTML(ordersLoadError)}</td></tr>`;
    } else {
        body.innerHTML = filtered.map(order => {
            const itemNames = order.items.length
                ? order.items.map(item => `${escapeHTML(item.product_name || "Item")} × ${Number(item.quantity || 1)}`).join("<br>")
                : "Items not recorded";
            const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
                .map(status => `<option value="${status}" ${status === order.status ? "selected" : ""}>${status[0].toUpperCase() + status.slice(1)}</option>`).join("");
            const paymentOptions = ["unpaid", "pending", "paid", "failed", "refunded"]
                .map(status => `<option value="${status}" ${status === order.payment_status ? "selected" : ""}>${status[0].toUpperCase() + status.slice(1)}</option>`).join("");
            const customerDetails = [order.customer_name, order.phone, order.email].filter(Boolean).map(escapeHTML).join("<br>");
            const delivery = [order.delivery_address, order.delivery_lga, order.delivery_state].filter(Boolean).map(escapeHTML).join(", ");

            return `
                <tr>
                    <td><strong>${escapeHTML(order.order_number)}</strong><br><small>${escapeHTML(formatDate(order.created_at))}</small></td>
                    <td>${customerDetails || "—"}<br><small>${delivery}</small></td>
                    <td>${itemNames}</td>
                    <td>${formatNaira(order.total)}</td>
                    <td><select data-order-id="${escapeHTML(order.id)}" data-order-field="status" aria-label="Update order status">${statusOptions}</select></td>
                    <td><select data-order-id="${escapeHTML(order.id)}" data-order-field="payment_status" aria-label="Update payment status">${paymentOptions}</select></td>
                    <td>${escapeHTML(order.delivery_address || "—")}</td>
                </tr>
            `;
        }).join("");
    }

    document.getElementById("ordersEmptyMessage").classList.toggle("hidden", !!ordersLoadError || filtered.length > 0);
    if (ordersLoadError) {
        document.getElementById("ordersEmptyMessage").textContent = "Orders could not be loaded. Check the Supabase admin functions and refresh.";
    } else {
        document.getElementById("ordersEmptyMessage").textContent = "No orders found for this filter.";
    }
    renderRecentOrders(orders);
}

function renderRecentOrders(orders) {
    const body = document.getElementById("recentOrdersBody");
    const recent = [...orders].slice(0, 5);

    body.innerHTML = recent.map(order => `
        <tr>
            <td>${escapeHTML(order.order_number)}</td>
            <td>${escapeHTML(order.customer_name)}</td>
            <td>${escapeHTML(formatDate(order.created_at))}</td>
            <td><span class="status-badge ${escapeHTML(order.status)}">${escapeHTML(order.status)}</span></td>
        </tr>
    `).join("");

    if (recent.length === 0) {
        body.innerHTML = `<tr><td colspan="4" class="muted">${ordersLoadError ? "Orders could not be loaded." : "No orders have been received yet."}</td></tr>`;
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
        orders.filter(order => order.status === "pending").length;

    document.getElementById("statCompleted").textContent =
        orders.filter(order => order.status === "delivered").length;

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