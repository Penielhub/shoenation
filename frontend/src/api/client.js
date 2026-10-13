// Talks to the FastAPI backend. Set VITE_API_URL in frontend/.env.local to point somewhere else.
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

const TOKENS_KEY = "shoenation.tokens";

export class ApiError extends Error {
  constructor(status, detail) {
    super(describeDetail(detail));
    this.status = status;
    this.detail = detail;
  }
}

// FastAPI sends `detail` as a string, a list of validation errors, or (for stock problems) an object
function describeDetail(detail) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(". ");
  if (detail?.message) return detail.message;
  return "Something went wrong";
}

export function getTokens() {
  try {
    return JSON.parse(localStorage.getItem(TOKENS_KEY));
  } catch {
    return null;
  }
}

export function setTokens(tokens) {
  try {
    if (tokens) localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
    else localStorage.removeItem(TOKENS_KEY);
  } catch {
    // storage blocked (private mode): the user just stays logged in until the tab closes
  }
}

async function send(path, { method = "GET", body, form, token } = {}) {
  const headers = {};
  let payload;
  if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = new URLSearchParams(form);
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError(0, "Can't reach the server. Is the backend running?");
  }
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data?.detail);
  return data;
}

// several requests can hit an expired token at once; they all wait on the same refresh
let refreshing = null;

async function refreshTokens() {
  const tokens = getTokens();
  if (!tokens?.refresh_token) return null;
  refreshing ??= send("/auth/refresh", { method: "POST", body: { refresh_token: tokens.refresh_token } })
    .then((fresh) => {
      setTokens(fresh);
      return fresh;
    })
    .catch(() => {
      setTokens(null);
      return null;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

// for endpoints that need a logged-in user: retries once with fresh tokens if the access token expired
async function sendAuthed(path, options = {}) {
  const tokens = getTokens();
  if (!tokens) throw new ApiError(401, "Please sign in");
  try {
    return await send(path, { ...options, token: tokens.access_token });
  } catch (err) {
    if (err.status !== 401) throw err;
    const fresh = await refreshTokens();
    if (!fresh) throw new ApiError(401, "Your session expired. Please sign in again.");
    return send(path, { ...options, token: fresh.access_token });
  }
}

export const api = {
  login: (email, password) => send("/auth/login", { method: "POST", form: { username: email, password } }),
  register: (email, password) => send("/auth/register", { method: "POST", body: { email, password } }),
  me: () => sendAuthed("/auth/me"),

  listProducts: (params) => send(`/products?${new URLSearchParams(clean(params))}`),
  getProduct: (id) => send(`/products/${id}`),

  placeOrder: (items) => sendAuthed("/orders", { method: "POST", body: { items } }),
  listOrders: (params) => sendAuthed(`/orders?${new URLSearchParams(clean(params))}`),
  cancelOrder: (id) => sendAuthed(`/orders/${id}/cancel`, { method: "POST" }),
};

// drops empty filters so they aren't sent as "?size=&q="
function clean(params = {}) {
  return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""));
}
