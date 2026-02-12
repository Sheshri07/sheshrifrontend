import { API } from "../utils/api";

export const getWishlist = async () => {
    const res = await API.get("/wishlist");
    return res.data;
};

export const addToWishlist = async (productId) => {
    const res = await API.post("/wishlist", { productId });
    return res.data;
};

export const removeFromWishlist = async (productId) => {
    const res = await API.delete(`/wishlist/${productId}`);
    return res.data;
};
