import React, { useState, useEffect } from 'react';
import { Bell, X, Package, CreditCard, Truck, Info } from 'lucide-react';
import { getUserNotifications, markNotificationAsRead, getUnreadCount, markAllAsRead } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

const NotificationBell = ({ iconSize = 20, buttonClassName = "p-2" }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();

        // Listen for real-time updates
        const handleUpdate = () => {
            fetchNotifications();
            fetchUnreadCount();
        };

        window.addEventListener('notificationUpdate', handleUpdate);

        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        return () => {
            clearInterval(interval);
            window.removeEventListener('notificationUpdate', handleUpdate);
        };
    }, []);

    // Refresh notifications when dropdown is opened to ensure fresh data
    useEffect(() => {
        if (showDropdown) {
            fetchNotifications();
        }
    }, [showDropdown]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getUserNotifications();
            setNotifications(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const count = await getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.read) {
                await markNotificationAsRead(notification._id);
                fetchNotifications();
                fetchUnreadCount();
            }

            if (notification.link) {
                navigate(notification.link);
                setShowDropdown(false);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'order':
                return <Package size={18} className="text-blue-600" />;
            case 'payment':
                return <CreditCard size={18} className="text-green-600" />;
            case 'tracking':
                return <Truck size={18} className="text-purple-600" />;
            default:
                return <Info size={18} className="text-gray-600" />;
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now - notifDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notifDate.toLocaleDateString();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`relative hover:bg-gray-100 rounded-full transition-colors ${buttonClassName}`}
            >
                <Bell size={iconSize} className="text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown */}
                    <div className="fixed top-14 left-4 right-4 md:absolute md:top-full md:right-0 md:left-auto md:w-96 md:mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[60vh] md:max-h-[500px] flex flex-col">
                        {/* Header */}
                        <div className="p-3 md:p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3">
                                <h3 className="font-bold text-sm md:text-lg">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-[10px] md:text-xs text-primary-600 hover:text-primary-700 font-medium hover:underline"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={16} className="md:w-5 md:h-5" />
                            </button>
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {loading ? (
                                <div className="p-6 md:p-8 text-center">
                                    <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-6 md:p-8 text-center">
                                    <Bell size={20} className="mx-auto text-gray-300 mb-2 md:mb-3 md:w-12 md:h-12" />
                                    <p className="text-gray-500 text-xs md:text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map(notif => (
                                        <div
                                            key={notif._id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`p-3 md:p-4 cursor-pointer transition-colors ${notif.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                                                }`}
                                        >
                                            <div className="flex gap-2 md:gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getIcon(notif.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-xs md:text-sm text-gray-900 mb-0.5 md:mb-1 leading-tight">
                                                        {notif.title}
                                                    </p>
                                                    <p className="text-[10px] md:text-xs text-gray-600 mb-1 leading-normal">
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-[9px] md:text-[10px] text-gray-400">
                                                        {formatTime(notif.createdAt)}
                                                    </p>
                                                </div>
                                                {!notif.read && (
                                                    <div className="flex-shrink-0">
                                                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        navigate('/orders');
                                        setShowDropdown(false);
                                    }}
                                    className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    View All Orders
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
