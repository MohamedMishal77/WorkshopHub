// src/api/apiFetch.js
// central fetch helper that always includes credentials and attempts one refresh on 401
export default async function apiFetch(input, init = {}) {
  // Use relative /api path so Netlify proxy handles it
  const baseUrl = import.meta.env.VITE_API_BASE || "/api";

  const url = input.startsWith("http") ? input : baseUrl + input;

  console.log("API Base:", import.meta.env.VITE_API_BASE);

  const defaultOpts = {
    credentials: "include", // ensures cookies are sent
    headers: {
      "Content-Type": "application/json",
    },
  };

  const opts = {
    ...defaultOpts,
    ...init,
    headers: { ...(defaultOpts.headers || {}), ...(init.headers || {}) },
  };

  // First attempt
  let res = await fetch(url, opts);

  if (res.status === 401) {
    // try refresh
    const refreshRes = await fetch(baseUrl + "/auth/refresh", {
      method: "POST",
      credentials: "include", // ensure refresh cookies are sent
    });

    if (refreshRes.ok) {
      // Refresh succeeded -> retry original request with fresh cookie
      res = await fetch(url, opts);
    } else {
      // Refresh failed -> force logout scenario
      console.warn("Refresh token failed. User needs to re-login.");
      return refreshRes;
    }
  }

  return res;
}
