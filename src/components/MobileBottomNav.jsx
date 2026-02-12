import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Calendar, User } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
    const location = useLocation();
    const { user } = useAuth();

    const navItems = [
        {
            icon: Home,
            label: 'Home',
            path: '/',
        },
        {
            icon: Heart,
            label: 'Wishlist',
            path: '/wishlist',
        },
        {
            icon: Calendar,
            label: 'Virtual Appointment',
            path: '/book-appointment',
        },
        {
            icon: user ? null : User, // Use null for icon if user exists (we'll render custom avatar)
            label: user ? 'Account' : 'Login',
            path: user ? '/my-profile' : '/login',
            isProfile: !!user
        },
    ];

    // Only show the bottom nav on the home page
    if (location.pathname !== '/') {
        return null;
    }

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50">
            <div className="grid grid-cols-4 h-18 pb-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive
                                ? 'text-primary-600'
                                : 'text-gray-600 hover:text-primary-500'
                                }`}
                        >
                            {item.isProfile ? (
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isActive ? 'border-primary-600 bg-primary-50' : 'border-gray-400 bg-gray-50'}`}>
                                    <span className={`text-[10px] font-bold ${isActive ? 'text-primary-600' : 'text-gray-600'}`}>
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                            ) : (
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            )}
                            <span className="text-[8.5px] font-semibold uppercase tracking-tighter leading-none text-center px-0.5">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
