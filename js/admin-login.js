
"use strict";

const ADMIN_SESSION_KEY = "softinaAdminSession";

const loginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("loginMessage");

if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "true") {
    window.location.replace("admin-dashboard.html");
}

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value;

    // DEMO ONLY: these credentials are visible in browser JavaScript.
    // Replace this prototype login with backend authentication before launch.
    if (username === "admin" && password === "Softina2026!") {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
        window.location.href = "admin-dashboard.html";
        return;
    }

    loginMessage.textContent = "Invalid username or password. Please try again.";
    loginMessage.className = "form-message error";
    document.getElementById("adminPassword").value = "";
});