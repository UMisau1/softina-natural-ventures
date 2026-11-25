/* Softina Supabase public client configuration. Never put service_role keys here. */
(function () {
  const SUPABASE_URL = "https://gqshkirrflsvmnpudtma.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wx8FdikkHSrE-Fjfv0PhTg_2UR5C988";

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Supabase JS library did not load.");
    return;
  }

  window.softinaSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );
})();
