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

export async function getProductsPage({
  page = 1,
  perPage = 10,
  sort = "updated",
  order = "desc",
  q = "",
  store = "",
} = {}) {
  const response = await api.get("/products", {
    params: {
      page,
      per_page: perPage,
      sort,
      order,
      q: q || undefined,
      store: store || undefined,
    },
  });

  return response.data;
}

export async function searchProducts(query) {
  const response = await api.get("/products/search", {
    params: { q: query },
  });

  return response.data;
}

export async function getProduct(productId) {
  const response = await api.get(`/products/${productId}`);
  return response.data;
}

export async function getPriceHistory(productId) {
  const response = await api.get(
    `/products/${productId}/history`
  );

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

export async function getPriceDrops(limit = 20) {
  const response = await api.get("/analytics/price-drops", {
    params: { limit },
  });

  return response.data;
}

export async function getStoreSummaries() {
  const response = await api.get("/analytics/stores");
  return response.data;
}

export async function getLastUpdate() {
  const response = await api.get("/analytics/last-update");
  return response.data;
}

export async function getPriceTrends(days = 7) {
  const response = await api.get("/analytics/price-trends", {
    params: { days },
  });

  return response.data;
}

export default api;