import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    User,
    Package,
    Heart,
    LogOut,
    ChevronRight,
    Calendar,
    Settings
} from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    const menuItems = [
        {
            icon: Settings,
            label: 'Update Details',
            subLabel: 'Modify your personal information',
            path: '/update-profile',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50'
        },
        {
            icon: Package,
            label: 'My Orders',
            subLabel: 'Track, return, or buy things again',
            path: '/orders',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            icon: Heart,
            label: 'My Wishlist',
            subLabel: 'Your favorite items',
            path: '/wishlist',
            color: 'text-pink-600',
            bgColor: 'bg-pink-50'
        },
        {
            icon: Calendar,
            label: 'Appointments',
            subLabel: 'Manage your virtual appointments',
            path: '/book-appointment',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        // Placeholders for future features
        /*
        {
            icon: MapPin,
            label: 'Saved Addresses',
            subLabel: 'Manage your delivery addresses',
            path: '/addresses',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            icon: Settings,
            label: 'Account Settings',
            subLabel: 'Password, email updates',
            path: '/settings',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50'
        }
        */
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24 pt-20 md:pt-28">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar: Profile Summary & Secondary Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden transition-all hover:shadow-md">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50"></div>

                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 text-4xl font-serif font-bold border-4 border-white shadow-md relative z-10 mb-4 transform transition-transform hover:scale-105">
                                {user.username ? user.username.charAt(0).toUpperCase() : <User size={40} />}
                            </div>

                            <div className="relative z-10">
                                <h1 className="text-2xl font-serif font-bold text-gray-900">{user.username}</h1>
                                <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                                <div className="mt-4 inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-100">
                                    Member
                                </div>
                            </div>
                        </div>

                        {/* Desktop Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="hidden lg:flex w-full bg-white p-4 rounded-2xl border border-red-100 shadow-sm items-center gap-4 hover:bg-red-50 hover:border-red-200 transition-all group"
                        >
                            <div className="p-3 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
                                <LogOut size={22} />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-red-700">Logout</h3>
                                <p className="text-xs text-red-400 mt-0.5">Sign out of your account</p>
                            </div>
                        </button>
                    </div>

                    {/* Main Content: Action Grid */}
                    <div className="lg:col-span-8">
                        <div className="mb-6 lg:mb-8">
                            <h2 className="text-xl font-serif font-bold text-gray-800">Account Dashboard</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage your orders, preferences, and account settings.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`p-4 rounded-xl ${item.bgColor} ${item.color} shadow-sm`}>
                                        <item.icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{item.label}</h3>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.subLabel}</p>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300 transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Logout Button (shows only on mobile/tablet) */}
                        <button
                            onClick={handleLogout}
                            className="lg:hidden w-full mt-8 bg-white p-4 rounded-2xl border border-red-100 shadow-sm flex items-center gap-4 hover:bg-red-50 hover:border-red-200 transition-all group"
                        >
                            <div className="p-3 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
                                <LogOut size={22} />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-red-700">Logout</h3>
                                <p className="text-xs text-red-400 mt-0.5">Sign out of your account</p>
                            </div>
                        </button>

                        <div className="mt-12 text-center lg:text-left">
                            <p className="text-xs text-gray-400 font-medium">Sheshri Fashion App v1.0.0 • Handcrafted Luxury</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Profile;
