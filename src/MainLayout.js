import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import MobileBottomNav from './components/MobileBottomNav';

const MainLayout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="min-h-screen bg-subtle-purple flex flex-col">
            <PageLoader />
            <Navbar />
            <div className={`pt-0 ${isHomePage ? 'pb-16 md:pb-0' : 'pb-0'} flex-grow`}>
                <Outlet />
            </div>
            <Footer />
            <MobileBottomNav />
        </div>
    );
};

export default MainLayout;
