import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Mail, Calendar, Package, DollarSign, ArrowLeft, ExternalLink, Clock, ShoppingCart, Edit, Phone } from 'lucide-react';
import { getUserDetails } from '../../services/userService';
import { getAllOrders } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userData, allOrders] = await Promise.all([
                    getUserDetails(id),
                    getAllOrders()
                ]);

                setUser(userData);

                // Filter orders for this user
                const userOrders = allOrders.filter(order =>
                    order.user?._id === id || order.user?.id === id
                );
                setOrders(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                toast.error('Failed to load user information');
                setLoading(false);
            }
        };

        fetchData();
    }, [id, toast]);

    const stats = {
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
        lastOrder: orders[0]?.createdAt || null
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl shadow-xl max-w-md mx-auto mt-20 border border-red-100">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
                <p className="text-gray-500 mb-6">The user you are looking for does not exist or has been removed.</p>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="bg-primary-600 text-white px-8 py-2 rounded-full font-bold hover:bg-primary-700 transition"
                >
                    Back to Users
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
            {/* Back Button */}
            <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Back to User List</span>
            </button>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-gray-900">User Profile</h1>
                <button
                    onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-amber-600 border border-amber-100 rounded-2xl shadow-sm hover:bg-amber-600 hover:text-white hover:shadow-lg transition-all active:scale-95 font-bold"
                >
                    <Edit size={20} />
                    <span>Edit User</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                        <div className={`h-32 bg-gradient-to-br ${user.role === 'admin' ? 'from-amber-400 to-orange-500' : 'from-primary-500 to-primary-700'}`}></div>
                        <div className="px-8 pb-8">
                            <div className="relative -mt-16 mb-6">
                                <div className="w-32 h-32 bg-white rounded-3xl p-1 shadow-2xl mx-auto">
                                    <div className={`w-full h-full rounded-[1.25rem] flex items-center justify-center text-white font-black text-4xl ${user.role === 'admin' ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-primary-400 to-primary-600'}`}>
                                        {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-1/2 translate-x-16">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white shadow-lg ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-black text-gray-900 mb-1">{user.name || user.username || 'Anonymous User'}</h2>
                                <p className="text-sm text-gray-400 font-mono tracking-tighter">ID: {user._id}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100 transition-hover hover:border-primary-100">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-primary-500">
                                        <Mail size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-400 uppercase font-black font-mono">Email Address</p>
                                        <p className="text-sm font-bold text-gray-800 truncate">{user.email || 'No email provided'}</p>
                                    </div>
                                </div>

                                {user.phoneNumber && (
                                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100 transition-hover hover:border-primary-100">
                                        <div className="p-3 bg-white rounded-xl shadow-sm text-primary-500">
                                            <Phone size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-gray-400 uppercase font-black font-mono">Phone Number</p>
                                            <p className="text-sm font-bold text-gray-800 truncate">{user.phoneNumber}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-primary-500">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-black font-mono">Join Date</p>
                                        <p className="text-sm font-bold text-gray-800">{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-[1.5rem] shadow-lg border border-gray-100 text-center">
                            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-primary-600">
                                <ShoppingCart size={18} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">{stats.totalOrders}</h3>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Total Orders</p>
                        </div>
                        <div className="bg-white p-5 rounded-[1.5rem] shadow-lg border border-gray-100 text-center">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-green-600">
                                <DollarSign size={18} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">₹{stats.totalSpent.toLocaleString()}</h3>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Total Spent</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order History and Activities */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl">
                                    <Package size={22} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900">Order History</h3>
                            </div>
                            <span className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-100">
                                Showing {orders.length} orders
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[600px] p-4 space-y-3">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <div key={order._id} className="p-5 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all group flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-900">Order #{order._id.slice(-8)}</p>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                                                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] text-gray-400 uppercase font-black font-mono">Order Value</p>
                                                <p className="text-lg font-black text-primary-600">₹{order.totalPrice?.toLocaleString()}</p>
                                            </div>
                                            <Link
                                                to={`/admin/order/${order._id}`}
                                                className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary-600 hover:text-white hover:shadow-lg transition-all"
                                                title="View Order Details"
                                            >
                                                <ExternalLink size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                        <ShoppingCart size={32} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">No active orders</h3>
                                    <p className="text-sm text-gray-400">This user hasn't placed any orders yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
