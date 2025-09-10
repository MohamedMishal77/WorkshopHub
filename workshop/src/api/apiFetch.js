// src/api/apiFetch.js
export default async function apiFetch(input, init = {}) {
  const baseUrl =
    import.meta.env.VITE_API_BASE || "http://localhost:5000"; // fallback

  const url = input.startsWith("http") ? input : baseUrl + input;

  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const defaultHeaders = { "Content-Type": "application/json" };

  // If iOS, try to read tokens from localStorage
  const accessToken = isiOS ? localStorage.getItem("accessToken") : null;

  const opts = {
    credentials: isiOS ? "omit" : "include", // omit cookies for iOS
    headers: {
      ...defaultHeaders,
      ...(init.headers || {}),
      ...(isiOS && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    ...init,
  };

  let res = await fetch(url, opts);

  // Token refresh logic for cookie flow only
  if (!isiOS && res.status === 401) {
    const refreshRes = await fetch(baseUrl + "/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      res = await fetch(url, opts);
    } else {
      console.warn("Refresh token failed. User needs to re-login.");
      return refreshRes;
    }
  }

  return res;
}
