import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../utils/api";
import {
    Search, Eye, CheckCircle, XCircle, Clock, Package,
    TrendingUp, RefreshCw, Calendar, User
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const toast = useToast();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/orders");
            setOrders(data);
            setFilteredOrders(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            toast.error("Failed to fetch orders");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        let filtered = orders;

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter === "delivered") {
            filtered = filtered.filter(order => order.isDelivered);
        } else if (statusFilter === "pending") {
            filtered = filtered.filter(order => !order.isDelivered);
        } else if (statusFilter === "paid") {
            filtered = filtered.filter(order => order.isPaid);
        } else if (statusFilter === "unpaid") {
            filtered = filtered.filter(order => !order.isPaid);
        }

        setFilteredOrders(filtered);
    }, [searchTerm, statusFilter, orders]);

    const deliverHandler = async (id) => {
        try {
            await API.put(`/orders/${id}/deliver`);
            toast.success("Order marked as delivered");
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update order");
        }
    };

    const stats = {
        total: orders.length,
        delivered: orders.filter(o => o.isDelivered).length,
        pending: orders.filter(o => !o.isDelivered).length,
        revenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="text-primary-600 animate-pulse" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Orders</h1>
                    <p className="text-gray-500">{filteredOrders.length} orders found</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-primary-300"
                >
                    <RefreshCw size={18} />
                    <span className="font-medium">Refresh</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Package size={24} className="opacity-80" />
                        <span className="text-2xl font-bold">{stats.total}</span>
                    </div>
                    <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle size={24} className="opacity-80" />
                        <span className="text-2xl font-bold">{stats.delivered}</span>
                    </div>
                    <p className="text-green-100 text-sm font-medium">Delivered</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Clock size={24} className="opacity-80" />
                        <span className="text-2xl font-bold">{stats.pending}</span>
                    </div>
                    <p className="text-orange-100 text-sm font-medium">Pending</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp size={24} className="opacity-80" />
                        <span className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</span>
                    </div>
                    <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                        <option value="all">All Orders</option>
                        <option value="delivered">Delivered</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                    {error}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm text-gray-900">
                                                #{order._id.slice(-8)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-gray-400" />
                                                <span className="font-medium text-gray-900">
                                                    {order.user?.name || order.user?.username || "N/A"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar size={16} className="text-gray-400" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">
                                                ₹{order.totalPrice?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.isPaid ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                    <CheckCircle size={14} />
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                                    <XCircle size={14} />
                                                    Unpaid
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.isDelivered ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                    <CheckCircle size={14} />
                                                    Delivered
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                                                    <Clock size={14} />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/admin/order/${order._id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </Link>
                                                {!order.isDelivered && (
                                                    <button
                                                        onClick={() => deliverHandler(order._id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                                                    >
                                                        <CheckCircle size={14} />
                                                        Deliver
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {filteredOrders.length === 0 && !loading && !error && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <Package className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default OrderList;
