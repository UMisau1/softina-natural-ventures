"use strict";

const loginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("loginMessage");
const supabaseClient = window.softinaSupabase;

function showLoginMessage(message, type = "error") {
  loginMessage.textContent = message;
  loginMessage.className = `form-message ${type}`;
}

if (!supabaseClient) {
  showLoginMessage("Ba a samu haɗin Supabase ba. Duba internet da Supabase configuration.");
  loginForm.querySelector('button[type="submit"]').disabled = true;
} else {
  supabaseClient.auth.getSession().then(async ({ data, error }) => {
    if (error || !data.session) return;
    const { data: roleRow, error: roleError } = await supabaseClient
      .from("user_roles").select("role").eq("user_id", data.session.user.id).maybeSingle();
    if (!roleError && roleRow && roleRow.role === "admin") {
      window.location.replace("admin-dashboard.html");
    } else {
      await supabaseClient.auth.signOut();
    }
  });
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) return;

  const button = loginForm.querySelector('button[type="submit"]');
  const email = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value;
  button.disabled = true;
  button.textContent = "Signing in...";
  showLoginMessage("", "");

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: roleRow, error: roleError } = await supabaseClient
      .from("user_roles").select("role").eq("user_id", data.user.id).maybeSingle();
    if (roleError) throw roleError;
    if (!roleRow || roleRow.role !== "admin") {
      await supabaseClient.auth.signOut();
      throw new Error("Wannan account ba shi da izinin Admin.");
    }

    showLoginMessage("Login successful. Ana buɗe Admin Dashboard...", "success");
    window.location.href = "admin-dashboard.html";
  } catch (error) {
    showLoginMessage(error.message || "An kasa shiga. Duba email da password.");
    document.getElementById("adminPassword").value = "";
  } finally {
    button.disabled = false;
    button.textContent = "Sign In";
  }
});
