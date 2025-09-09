// src/utils/auth.js
import apiFetch from "../api/apiFetch";

// Check if user is authenticated (via accessToken cookie)
export const isAuthenticated = async () => {
  try {
    const res = await apiFetch("/api/auth/validate", { method: "GET" });
    if (!res.ok) return false;

    const data = await res.json();
    return data.valid ? data.user : false;
  } catch (err) {
    console.error("Auth check failed:", err);
    return false;
  }
};

// Optional: logout helper
export const logout = async () => {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
    return true;
  } catch (err) {
    console.error("Logout failed:", err);
    return false;
  }
};
