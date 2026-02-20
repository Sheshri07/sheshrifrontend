import { API } from "../utils/api";

// Simple in-memory cache
const cache = new Map();

export const getCategories = async () => {
    const cacheKey = "/categories";
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }
    const res = await API.get("/categories");
    cache.set(cacheKey, res.data);
    return res.data;
};

export const createCategory = async (formData) => {
    const res = await API.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    cache.clear(); // Invalidate cache on change
    return res.data;
};

export const updateCategory = async (id, formData) => {
    const res = await API.put(`/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    cache.clear(); // Invalidate cache on change
    return res.data;
};

export const deleteCategory = async (id) => {
    const res = await API.delete(`/categories/${id}`);
    cache.clear(); // Invalidate cache on change
    return res.data;
};
