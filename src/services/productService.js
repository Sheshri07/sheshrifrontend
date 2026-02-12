import { API } from "../utils/api";

export const getAllProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const getProductCategories = async () => {
  const res = await API.get("/products/categories");
  return res.data;
};

export const getProductSubcategories = async () => {
  const res = await API.get("/products/subcategories");
  return res.data;
};
