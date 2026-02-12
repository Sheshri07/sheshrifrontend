import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MapPin, Calendar, Package, DollarSign, Eye, RefreshCw } from 'lucide-react';
import { getAllOrders } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const toast = useToast();

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = customers.filter(customer =>
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCustomers(filtered);
        } else {
            setFilteredCustomers(customers);
        }
    }, [searchTerm, customers]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const orders = await getAllOrders();

            // Extract unique customers from orders
            const customerMap = new Map();

            orders.forEach(order => {
                if (order.user) {
                    const userId = order.user._id || order.user.id;

                    if (!customerMap.has(userId)) {
                        customerMap.set(userId, {
                            id: userId,
                            name: order.user.name || order.user.username || 'Unknown',
                            email: order.user.email || 'N/A',
                            phone: order.shippingAddress?.phone || 'N/A',
                            address: order.shippingAddress ?
                                `${order.shippingAddress.city}, ${order.shippingAddress.country}` :
                                'N/A',
                            totalOrders: 0,
                            totalSpent: 0,
                            lastOrder: order.createdAt,
                            orders: []
                        });
                    }

                    const customer = customerMap.get(userId);
                    customer.totalOrders += 1;
                    customer.totalSpent += order.totalPrice || 0;
                    customer.orders.push(order._id);

                    // Update last order date if this order is more recent
                    if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
                        customer.lastOrder = order.createdAt;
                    }
                }
            });

            const customersArray = Array.from(customerMap.values());
            // Sort by total spent (highest first)
            customersArray.sort((a, b) => b.totalSpent - a.totalSpent);

            setCustomers(customersArray);
            setFilteredCustomers(customersArray);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to load customers');
            setLoading(false);
        }
    };

    const stats = {
        total: customers.length,
        totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
        avgOrderValue: customers.length > 0
            ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)
            : 0
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="text-primary-600 animate-pulse" size={24} />
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Customers</h1>
                    <p className="text-gray-500">{filteredCustomers.length} customers found</p>
                </div>
                <button
                    onClick={fetchCustomers}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-primary-300"
                >
                    <RefreshCw size={18} />
                    <span className="font-medium">Refresh</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Users size={24} className="opacity-80" />
                        <span className="text-2xl font-bold">{stats.total}</span>
                    </div>
                    <p className="text-blue-100 text-sm font-medium">Total Customers</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign size={24} className="opacity-80" />
                        <span className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <Package size={24} className="opacity-80" />
                        <span className="text-2xl font-bold">₹{stats.avgOrderValue.toFixed(0)}</span>
                    </div>
                    <p className="text-purple-100 text-sm font-medium">Avg Order Value</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Customers Table */}
            {filteredCustomers.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Spent</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Order</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{customer.name}</p>
                                                    <p className="text-xs text-gray-500">ID: {customer.id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail size={14} className="text-gray-400" />
                                                    {customer.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone size={14} className="text-gray-400" />
                                                    {customer.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={14} className="text-gray-400" />
                                                {customer.address}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                <Package size={14} />
                                                {customer.totalOrders}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">
                                                ₹{customer.totalSpent.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(customer.lastOrder).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <Users className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers found</h3>
                    <p className="text-gray-500">
                        {searchTerm ? 'Try adjusting your search' : 'No orders have been placed yet'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Customers;
