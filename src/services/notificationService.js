import { API } from '../utils/api';

// Get user's notifications
export const getUserNotifications = async () => {
    const { data } = await API.get('/notifications');
    return data;
};

// Get unread notification count
export const getUnreadCount = async () => {
    const { data } = await API.get('/notifications/unread/count');
    return data.count;
};

// Mark notification as read
export const markNotificationAsRead = async (id) => {
    const { data } = await API.put(`/notifications/${id}/read`);
    return data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
    const { data } = await API.put('/notifications/read-all');
    return data;
};

// Delete notification
export const deleteNotification = async (id) => {
    const { data } = await API.delete(`/notifications/${id}`);
    return data;
};
