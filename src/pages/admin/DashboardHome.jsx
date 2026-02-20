import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
    ArrowUp, ArrowDown, MoreHorizontal, DollarSign, ShoppingCart,
    Package, RefreshCw, Download, Users
} from 'lucide-react';
import { getAllProducts } from '../../services/productService';
import { getAllOrders } from '../../services/orderService';
import { getDashboardStats } from '../../services/statsService';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, change, isPositive, extra, icon: Icon, gradient }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${gradient}`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
            <Icon size={120} strokeWidth={1} />
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Icon className="text-white" size={24} />
                </div>
                <button className="text-white/80 hover:text-white transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>
            <div className="space-y-2">
                <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{value}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className={`flex items-center gap-1 font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                        {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {change}%
                    </span>
                    <span className="text-white/70">{extra}</span>
                </div>
            </div>
        </div>
    </div>
);

const DashboardHome = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalCustomers: 0,
        monthlyData: [],
        pieData: [],
        topSellingProducts: [],
        userGrowth: [],
        orderStatusData: [],
        lowStockProducts: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [productsData, ordersData, statsData] = await Promise.all([
                getAllProducts(),
                getAllOrders(),
                getDashboardStats()
            ]);

            setProducts(productsData);
            setOrders(ordersData);
            // console.log("Dashboard Stats Received:", statsData);
            setStats(statsData);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    const getMonthlyData = () => {
        if (stats.monthlyData && stats.monthlyData.length > 0) {
            return stats.monthlyData;
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();

        return months.slice(0, currentMonth + 1).map((name, index) => {
            const monthOrders = orders.filter(order => {
                const orderMonth = new Date(order.createdAt).getMonth();
                return orderMonth === index;
            });

            const revenue = monthOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

            return {
                name,
                current: revenue,
                previous: revenue * 0.8
            };
        });
    };

    const getTopProducts = () => {
        return products.slice(0, 5);
    };

    const pieData = stats.pieData && stats.pieData.length > 0 ? stats.pieData : [
        { name: 'Direct', value: stats.totalRevenue * 0.4, color: '#10B981' },
        { name: 'Affiliate', value: stats.totalRevenue * 0.25, color: '#3B82F6' },
        { name: 'Sponsored', value: stats.totalRevenue * 0.2, color: '#6366F1' },
        { name: 'E-mail', value: stats.totalRevenue * 0.15, color: '#F59E0B' },
    ];

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
        <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back! Here's what's happening with your store.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-primary-300 disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                        <span className="font-medium">Refresh</span>
                    </button>
                    <button
                        onClick={() => {
                            const csvContent = [
                                ["Metric", "Value"],
                                ["Total Sales", stats.totalSales],
                                ["Total Orders", stats.totalOrders],
                                ["Total Revenue", stats.totalRevenue],
                                ["Total Products", stats.totalProducts],
                                ["Total Customers", stats.totalCustomers]
                            ].map(e => e.join(",")).join("\n");

                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement("a");
                            const url = URL.createObjectURL(blob);
                            link.setAttribute("href", url);
                            link.setAttribute("download", `dashboard_stats_${new Date().toISOString().split('T')[0]}.csv`);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-700 transition-all"
                    >
                        <Download size={18} />
                        <span className="font-medium hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <StatCard
                    title="Total Sales"
                    value={`₹${stats.totalSales.toLocaleString()}`}
                    change={14}
                    isPositive={true}
                    extra="vs last month"
                    icon={DollarSign}
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders.toLocaleString()}
                    change={17}
                    isPositive={true}
                    extra="vs last month"
                    icon={ShoppingCart}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Total Registered Users"
                    value={stats.totalUsers?.toLocaleString() || '0'}
                    change={15}
                    isPositive={true}
                    extra="vs last month"
                    icon={Users}
                    gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts.toLocaleString()}
                    change={11}
                    isPositive={true}
                    extra="in inventory"
                    icon={Package}
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                />
                <Link to="/admin/users" className="block transform transition-transform hover:-translate-y-1">
                    <StatCard
                        title="Active Customers"
                        value={stats.totalCustomers.toLocaleString()}
                        change={12}
                        isPositive={true}
                        extra="with orders"
                        icon={Users}
                        gradient="bg-gradient-to-br from-pink-500 to-pink-600"
                    />
                </Link>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h2 className="font-bold text-gray-900 text-lg">Revenue Analysis</h2>
                            <p className="text-sm text-gray-500 mt-1">Monthly revenue comparison</p>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                <span className="font-medium text-green-700">Current</span>
                            </span>
                            <span className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                <span className="font-medium text-purple-700">Previous</span>
                            </span>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={getMonthlyData()}>
                                <defs>
                                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="current"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10B981', r: 4 }}
                                    activeDot={{ r: 6, fill: '#10B981' }}
                                    fill="url(#colorCurrent)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="previous"
                                    stroke="#8B5CF6"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <h2 className="font-bold text-gray-900 text-lg mb-1">Sales Source</h2>
                    <p className="text-sm text-gray-500 mb-6">Revenue by channel</p>
                    <div className="h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-xs text-gray-500 font-medium">Total</span>
                            <span className="font-bold text-2xl text-gray-900">100%</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-gray-700 font-medium">{item.name}</span>
                                </div>
                                <span className="font-bold text-gray-900">₹{item.value.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts Section 2 - User Growth & Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <h2 className="font-bold text-gray-900 text-lg mb-1">User Growth</h2>
                    <p className="text-sm text-gray-500 mb-6">New registrations per month</p>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Bar
                                    dataKey="users"
                                    fill="#6366F1"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Breakdown */}
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <h2 className="font-bold text-gray-900 text-lg mb-1">Order Status</h2>
                    <p className="text-sm text-gray-500 mb-6">Distribution of order statuses</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <div className="h-[250px] w-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.orderStatusData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.orderStatusData?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-xs text-gray-500 font-medium">Total</span>
                                <span className="font-bold text-2xl text-gray-900">{stats.totalOrders}</span>
                            </div>
                        </div>
                        <div className="space-y-3 w-full sm:w-auto">
                            {stats.orderStatusData?.slice(0, 5).map((item) => (
                                <div key={item.name} className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-gray-600 text-sm min-w-[100px]">{item.name}</span>
                                    <span className="font-bold text-gray-900 ml-auto">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Low Stock Alerts */}
            {stats.lowStockProducts && stats.lowStockProducts.length > 0 && (
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Package className="text-red-600" size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 text-lg">Low Stock Alerts</h2>
                            <p className="text-sm text-gray-500">Products with inventory below threshold (10)</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.lowStockProducts.map((product) => (
                            <div key={product._id} className="bg-white p-4 rounded-xl shadow-sm border border-red-100 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                                    <p className="text-sm text-gray-500 truncate">{product.category}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-red-600 font-bold text-sm bg-red-50 px-2 py-0.5 rounded-full">
                                            Only {product.countInStock} left
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Top Products */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg">Top Products</h2>
                        <p className="text-sm text-gray-500 mt-1">Best performing items in your store</p>
                    </div>
                    <Link
                        to="/admin/productlist"
                        className="text-primary-600 text-sm font-semibold hover:text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                        View All →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-500 text-sm border-b-2 border-gray-100">
                                <th className="pb-4 font-semibold pl-4">Product</th>
                                <th className="pb-4 font-semibold">Price</th>
                                <th className="pb-4 font-semibold">Category</th>
                                <th className="pb-4 font-semibold">Stock</th>
                                <th className="pb-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {stats.topSellingProducts && stats.topSellingProducts.map((product, index) => (
                                <tr key={product._id} className="group hover:bg-gray-50 transition-colors border-b border-gray-50">
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shadow-sm">
                                                {product.image && (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-900 block">{product.name}</span>
                                                <span className="text-xs text-gray-500">#{index + 1} Best Seller</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="font-semibold text-gray-900">₹{product.price?.toLocaleString()}</span>
                                    </td>
                                    <td className="py-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            {product.totalSold} Sold
                                        </span>
                                    </td>
                                    <td className="py-4 text-gray-600 font-medium">
                                        ₹{product.revenue?.toLocaleString()} Revenue
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700`}>
                                            ● Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
