// src/api/apiFetch.js
export default async function apiFetch(input, init = {}) {
  const baseUrl =
    import.meta.env.VITE_API_BASE || "http://localhost:5000"; // fallback

  const url = input.startsWith("http") ? input : baseUrl + input;

  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const defaultHeaders = { "Content-Type": "application/json" };

  // 🔑 Get access token depending on platform
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

  // =========================
  // 🔄 TOKEN REFRESH LOGIC
  // =========================

  // ---- Cookie flow (Desktop/Android)
  if (!isiOS && res.status === 401) {
    const refreshRes = await fetch(baseUrl + "/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      res = await fetch(url, opts);
    } else {
      console.warn("Cookie refresh failed. User must re-login.");
      return refreshRes;
    }
  }

  // ---- LocalStorage flow (iOS)
  if (isiOS && res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.warn("No refresh token in localStorage. User must re-login.");
      return res;
    }

    const refreshRes = await fetch(baseUrl + "/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // Retry original request with new token
      const newAccessToken = localStorage.getItem("accessToken");
      const retryOpts = {
        ...opts,
        headers: {
          ...opts.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      };
      res = await fetch(url, retryOpts);
    } else {
      console.warn("LocalStorage refresh failed. User must re-login.");
      return refreshRes;
    }
  }

  return res;
}
