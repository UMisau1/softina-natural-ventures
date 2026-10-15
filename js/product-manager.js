"use strict";

/* ==========================================
   SOFTINA PRODUCT MANAGER V2.0
   ========================================== */

const CATALOG_KEY = "softinaCatalogProducts";
const LEGACY_KEYS = ["softinaProducts", "softinaCartProducts"];

const DEFAULT_CATALOG = Array.isArray(window.SOFTINA_PRODUCTS)
    ? window.SOFTINA_PRODUCTS
    : [];

const $ = id => document.getElementById(id);

function safe(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[c]);
}

function cloneProducts(products) {
    return products.map(p => ({ ...p }));
}

function normalizeProduct(product, index = 0) {
    return {
        id: product.id ?? index + 1,
        name: String(product.name || "Unnamed Product"),
        type: product.type === "service" ? "service" : "product",
        category: String(product.category || "other"),
        categoryName: String(product.categoryName || product.category || "Other"),
        shortDescription: String(product.shortDescription || ""),
        description: String(product.description || ""),
        price: product.price === "" || product.price == null
            ? null
            : Number(product.price),
        oldPrice: product.oldPrice === "" || product.oldPrice == null
            ? null
            : Number(product.oldPrice),
        discount: product.discount ?? null,
        size: String(product.size || ""),
        stockStatus: String(product.stockStatus || "Available"),
        image: String(product.image || "images/products/product-1.jpg"),
        featured: Boolean(product.featured),
        isNew: Boolean(product.isNew),
        available: product.available !== false
    };
}

function readSavedCatalog() {
    try {
        const raw = localStorage.getItem(CATALOG_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) return null;

        return parsed.map(normalizeProduct);
    } catch (error) {
        console.error("Could not read saved catalogue:", error);
        return null;
    }
}

function loadCatalog() {
    const saved = readSavedCatalog();

    if (saved && saved.length > 0) {
        const savedIds = new Set(saved.map(p => String(p.id)));
        const missingDefaults = DEFAULT_CATALOG
            .map(normalizeProduct)
            .filter(p => !savedIds.has(String(p.id)));

        return [...saved, ...missingDefaults];
    }

    return cloneProducts(DEFAULT_CATALOG.map(normalizeProduct));
}

let catalog = loadCatalog();

function saveCatalog() {
    try {
        localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
        return true;
    } catch (error) {
        console.error("Could not save catalogue:", error);
        toast("Could not save data in this browser.", true);
        return false;
    }
}

function categoryName(value) {
    const select = $("productCategory");
    if (!select) return String(value || "Other");

    const option = Array.from(select.options).find(
        item => item.value === String(value)
    );

    return option ? option.textContent.trim() : String(value || "Other");
}

function toast(message, error = false) {
    const el = $("toast");

    if (!el) {
        alert(message);
        return;
    }

    el.textContent = message;
    el.classList.add("show");
    el.style.background = error ? "#9b1c1c" : "#176b45";

    window.setTimeout(() => el.classList.remove("show"), 2800);
}

function resetForm() {
    $("productForm")?.reset();

    if ($("productId")) $("productId").value = "";
    if ($("formTitle")) $("formTitle").textContent = "Add New Product";

    $("productFormSection")?.classList.remove("active");
}

function showForm(item = null) {
    resetForm();

    if (item) {
        $("formTitle").textContent = "Edit Product / Service";
        $("productId").value = item.id;
        $("productName").value = item.name || "";
        $("productType").value = item.type || "product";
        $("productCategory").value = item.category || "supplements";
        $("productPrice").value = item.price ?? "";
        $("productOldPrice").value = item.oldPrice ?? "";
        $("productSize").value = item.size || "";
        $("stockStatus").value = item.stockStatus || "Available";
        $("productImage").value = item.image || "";
        $("shortDescription").value = item.shortDescription || "";
        $("productDescription").value = item.description || "";
        $("productAvailable").checked = item.available !== false;
        $("productFeatured").checked = Boolean(item.featured);
        $("productNew").checked = Boolean(item.isNew);
    }

    $("productFormSection")?.classList.add("active");
    $("productFormSection")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function render() {
    const tableBody = $("productsTableBody");
    if (!tableBody) return;

    const query = ($("searchProduct")?.value || "").trim().toLowerCase();

    const filtered = catalog.filter(p =>
        [p.name, p.categoryName, p.shortDescription]
            .some(value => String(value || "").toLowerCase().includes(query))
    );

    tableBody.innerHTML = filtered.map(p => `
        <tr>
            <td>${safe(p.id)}</td>
            <td>
                <img class="manager-product-image"
                     src="${safe(p.image)}"
                     alt=""
                     onerror="this.style.display='none'">
            </td>
            <td>${safe(p.name)}</td>
            <td>${safe(p.categoryName || p.category)}</td>
            <td>${p.type === "service" ? "Service" : "Product"}</td>
            <td>${p.price == null ? "Price on request" : "₦" + p.price.toLocaleString("en-NG")}</td>
            <td>${p.available === false ? "Unavailable" : safe(p.stockStatus)}</td>
            <td>
                <button type="button" data-edit="${safe(p.id)}">Edit</button>
                <button type="button" data-delete="${safe(p.id)}">Delete</button>
            </td>
        </tr>
    `).join("");

    if ($("totalProducts")) {
        $("totalProducts").textContent = catalog.length;
    }

    if ($("totalPhysicalProducts")) {
        $("totalPhysicalProducts").textContent =
            catalog.filter(p => p.type !== "service").length;
    }

    if ($("totalServices")) {
        $("totalServices").textContent =
            catalog.filter(p => p.type === "service").length;
    }

    if ($("totalFeatured")) {
        $("totalFeatured").textContent =
            catalog.filter(p => p.featured).length;
    }
}

function nextId() {
    return catalog.reduce((max, p) => {
        const id = Number(p.id);
        return Number.isFinite(id) ? Math.max(max, id) : max;
    }, 0) + 1;
}

function downloadJSON() {
    const blob = new Blob(
        [JSON.stringify(catalog, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "softina-products.json";
    a.click();

    URL.revokeObjectURL(url);
}

function downloadJS() {
    const source =
        '"use strict";\n\nconst SOFTINA_PRODUCTS = ' +
        JSON.stringify(catalog, null, 4) +
        ';\n\nif (typeof window !== "undefined") {\n    window.SOFTINA_PRODUCTS = SOFTINA_PRODUCTS;\n}\n';

    const blob = new Blob([source], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "products-data-export.js";
    a.click();

    URL.revokeObjectURL(url);
    toast("Catalogue JavaScript exported.");
}

$("addProductBtn")?.addEventListener("click", () => showForm());
$("closeFormBtn")?.addEventListener("click", resetForm);
$("cancelProductBtn")?.addEventListener("click", resetForm);
$("searchProduct")?.addEventListener("input", render);
$("exportJsonBtn")?.addEventListener("click", downloadJSON);
$("generateJsBtn")?.addEventListener("click", downloadJS);

$("importJsonInput")?.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const parsed = JSON.parse(await file.text());

        if (!Array.isArray(parsed)) {
            throw new Error("JSON must contain an array.");
        }

        if (!confirm(`Replace the current demo catalogue with ${parsed.length} imported records?`)) {
            return;
        }

        catalog = parsed.map(normalizeProduct);

        if (saveCatalog()) {
            render();
            toast("Catalogue imported.");
        }
    } catch (error) {
        toast("Import failed: " + error.message, true);
    }

    event.target.value = "";
});

$("productForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const idValue = $("productId").value;
    const name = $("productName").value.trim();
    const category = $("productCategory").value;
    const priceText = $("productPrice").value.trim();
    const oldPriceText = $("productOldPrice").value.trim();

    const price = priceText === "" ? null : Number(priceText);
    const oldPrice = oldPriceText === "" ? null : Number(oldPriceText);

    if (!name) {
        toast("Enter a product or service name.", true);
        return;
    }

    if (
        (price !== null && (!Number.isFinite(price) || price < 0)) ||
        (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice < 0))
    ) {
        toast("Enter valid non-negative prices.", true);
        return;
    }

    const old = catalog.find(p => String(p.id) === String(idValue));

    const item = normalizeProduct({
        id: old ? old.id : nextId(),
        name,
        type: $("productType").value,
        category,
        categoryName: categoryName(category),
        shortDescription: $("shortDescription").value.trim(),
        description: $("productDescription").value.trim(),
        price,
        oldPrice,
        discount: null,
        size: $("productSize").value.trim(),
        stockStatus: $("stockStatus").value,
        image: $("productImage").value.trim() || "images/products/product-1.jpg",
        featured: $("productFeatured").checked,
        isNew: $("productNew").checked,
        available: $("productAvailable").checked
    });

    if (old) {
        catalog = catalog.map(p =>
            String(p.id) === String(idValue) ? item : p
        );
    } else {
        catalog.push(item);
    }

    if (saveCatalog()) {
        render();
        resetForm();
        toast(old ? "Item updated." : "Item added.");
    }
});

$("productsTableBody")?.addEventListener("click", event => {
    const edit = event.target.closest("[data-edit]");
    const del = event.target.closest("[data-delete]");

    if (edit) {
        const item = catalog.find(p => String(p.id) === edit.dataset.edit);
        if (item) showForm(item);
    }

    if (del) {
        const item = catalog.find(p => String(p.id) === del.dataset.delete);

        if (
            item &&
            confirm(`Delete "${item.name}" from the local demo catalogue?`)
        ) {
            catalog = catalog.filter(
                p => String(p.id) !== del.dataset.delete
            );

            if (saveCatalog()) {
                render();
                toast("Item deleted.");
            }
        }
    }
});

render();