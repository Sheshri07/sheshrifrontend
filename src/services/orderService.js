import { API } from "../utils/api";

export const createOrder = async (orderData) => {
    const { data } = await API.post("/orders", orderData);
    return data;
};

export const getMyOrders = async () => {
    const { data } = await API.get("/orders/myorders");
    return data;
};

export const getOrderById = async (id) => {
    const { data } = await API.get(`/orders/${id}`);
    return data;
};

export const getAllOrders = async () => {
    const { data } = await API.get("/orders");
    return data;
};

export const cancelOrder = async (orderId) => {
    const { data } = await API.put(`/orders/${orderId}/cancel`);
    return data;
};

export const abandonOrder = async (orderId) => {
    const { data } = await API.put(`/orders/${orderId}/abandon`);
    return data;
};
