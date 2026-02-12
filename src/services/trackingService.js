import { API } from '../utils/api';

// Get order tracking information
export const getOrderTracking = async (orderId) => {
    const { data } = await API.get(`/tracking/${orderId}`);
    return data;
};

// Update order tracking (admin only)
export const updateOrderTracking = async (orderId, trackingData) => {
    const { data } = await API.put(`/tracking/${orderId}`, trackingData);
    return data;
};

// Get all orders tracking (admin only)
export const getAllOrdersTracking = async () => {
    const { data } = await API.get('/tracking');
    return data;
};
