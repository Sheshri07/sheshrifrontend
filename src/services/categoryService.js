import { API } from "../utils/api";

export const getCategories = async () => {
    const res = await API.get("/categories");
    return res.data;
};

export const createCategory = async (formData) => {
    const res = await API.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const updateCategory = async (id, formData) => {
    const res = await API.put(`/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const deleteCategory = async (id) => {
    const res = await API.delete(`/categories/${id}`);
    return res.data;
};
