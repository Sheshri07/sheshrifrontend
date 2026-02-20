import { API } from "../utils/api";

// Simple in-memory cache
const cache = new Map();

/**
 * Helper to get data from cache or fetch and store in cache
 * @param {string} key - Cache key
 * @param {Function} fetcher - Function that returns a promise with the data
 */
const withCache = async (key, fetcher) => {
  if (cache.has(key)) {
    // console.log(`Returning cached data for: ${key}`);
    return cache.get(key);
  }
  const data = await fetcher();
  cache.set(key, data);
  return data;
};

export const getAllProducts = async (params = {}) => {
  const cacheKey = `/products?${JSON.stringify(params)}`;
  return withCache(cacheKey, async () => {
    const res = await API.get("/products", { params });
    return res.data;
  });
};

export const getProductById = async (id) => {
  const cacheKey = `/products/${id}`;
  return withCache(cacheKey, async () => {
    const res = await API.get(`/products/${id}`);
    return res.data;
  });
};

export const getProductCategories = async () => {
  const cacheKey = "/products/categories";
  return withCache(cacheKey, async () => {
    const res = await API.get("/products/categories");
    return res.data;
  });
};

export const getProductSubcategories = async () => {
  const cacheKey = "/products/subcategories";
  return withCache(cacheKey, async () => {
    const res = await API.get("/products/subcategories");
    return res.data;
  });
};
