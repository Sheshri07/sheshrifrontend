import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, Settings, Search, Menu, Home, MessageSquare, LogOut, Palette, ChevronDown, ChevronRight, Image as ImageIcon, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../NotificationBell';

const AdminLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [customizationOpen, setCustomizationOpen] = useState(location.pathname.includes('/admin/banners') || location.pathname.includes('/admin/categories'));
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const linkClass = (path) => `
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
        ${isActive(path)
            ? 'bg-primary-50 text-primary-600 font-semibold'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
    `;

    const subLinkClass = (path) => `
        flex items-center gap-3 pl-11 pr-4 py-2 rounded-lg transition-colors duration-200 text-sm
        ${isActive(path)
            ? 'bg-primary-50 text-primary-600 font-semibold'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
    `;

    return (
        <div className="min-h-screen bg-gray-50 flex relative">
            {/* Sidebar Overlay/Backdrop */}
            {sidebarOpen && (
                <button
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity cursor-default"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                />
            )}

            {/* Sidebar */}
            <aside className={`bg-white border-r border-gray-200 fixed lg:static inset-y-0 left-0 z-50 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out scrollbar-hide overflow-y-auto`}>
                <div className="h-16 flex items-center px-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <Link to="/admin" className="flex items-center gap-2">
                        <img src="/logo_v2.png" alt="Sheshri Admin" className="h-14 w-auto" />
                    </Link>
                </div>

                <div className="p-4 space-y-1">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-2">Main Menu</div>

                    <Link to="/admin" className={linkClass('/admin')} onClick={() => setSidebarOpen(false)}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>

                    <Link to="/admin/productlist" className={linkClass('/admin/productlist')} onClick={() => setSidebarOpen(false)}>
                        <ShoppingBag size={20} />
                        <span>Products</span>
                    </Link>

                    {/* Customization Nested Menu */}
                    <div>
                        <button
                            onClick={() => setCustomizationOpen(!customizationOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${customizationOpen || isActive('/admin/banners') || isActive('/admin/categories') ? 'text-primary-600' : 'text-gray-500'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Palette size={20} />
                                <span className={`${customizationOpen || isActive('/admin/banners') || isActive('/admin/categories') ? 'font-semibold' : ''}`}>Customization</span>
                            </div>
                            {customizationOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        {customizationOpen && (
                            <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                <Link to="/admin/banners" className={subLinkClass('/admin/banners')} onClick={() => setSidebarOpen(false)}>
                                    <ImageIcon size={18} />
                                    <span>Banners</span>
                                </Link>
                                <Link to="/admin/categories" className={subLinkClass('/admin/categories')} onClick={() => setSidebarOpen(false)}>
                                    <LayoutDashboard size={18} />
                                    <span>Categories</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link to="/admin/orderlist" className={linkClass('/admin/orderlist')} onClick={() => setSidebarOpen(false)}>
                        <ShoppingCart size={20} />
                        <span>Orders</span>
                    </Link>

                    <Link to="/admin/customers" className={linkClass('/admin/customers')} onClick={() => setSidebarOpen(false)}>
                        <Users size={20} />
                        <span>Customers</span>
                    </Link>

                    <Link to="/admin/users" className={linkClass('/admin/users')} onClick={() => setSidebarOpen(false)}>
                        <Users size={20} />
                        <span>All Users</span>
                    </Link>


                    <Link to="/admin/messages" className={linkClass('/admin/messages')} onClick={() => setSidebarOpen(false)}>
                        <MessageSquare size={20} />
                        <span>Messages</span>
                    </Link>

                    <Link to="/admin/jobs" className={linkClass('/admin/jobs')} onClick={() => setSidebarOpen(false)}>
                        <Briefcase size={20} />
                        <span>Jobs</span>
                    </Link>

                    <Link to="/admin/settings" className={linkClass('/admin/settings')} onClick={() => setSidebarOpen(false)}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Developed and Designed by</p>
                        <p className="text-sm font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">FIVRA</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 max-w-xl mx-4 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search here..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-primary-300 focus:ring-0 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium"
                        >
                            <Home size={18} />
                            <span className="hidden sm:inline">Visit Store</span>
                        </Link>
                        <NotificationBell />
                        <div className="flex items-center gap-2">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-800">{user?.username || "Admin User"}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role || "Admin"}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" alt="Profile" className="h-full w-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
