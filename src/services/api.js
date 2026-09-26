import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:5000/api",
  timeout: 30000,
});

export async function getProducts() {
  const response = await api.get("/products");
  return response.data;
}

export async function searchProducts(query) {
  const response = await api.get("/products/search", {
    params: { q: query },
  });

  return response.data;
}

export async function getAnalyticsSummary() {
  const response = await api.get("/analytics/summary");
  return response.data;
}

export async function getTopDiscounts(limit = 5) {
  const response = await api.get("/analytics/top-discounts", {
    params: { limit },
  });

  return response.data;
}

export async function getRatings() {
  const response = await api.get("/analytics/ratings");
  return response.data;
}

export async function getStoreProducts(store) {
  const response = await api.get(
    `/analytics/stores/${encodeURIComponent(store)}`
  );

  return response.data;
}

export default api;