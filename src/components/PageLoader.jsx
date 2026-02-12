import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageLoader = () => {
    const location = useLocation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger the loading bar on every path change
        setVisible(true);

        // Hide the bar after the animation completes
        const timer = setTimeout(() => {
            setVisible(false);
        }, 600); // Matches the animation duration in CSS

        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (!visible) return null;

    return (
        <div className="fixed top-0 left-0 w-full z-[100] h-1 pointer-events-none overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-loading-bar shadow-[0_0_10px_rgba(219,39,119,0.5)]"></div>
        </div>
    );
};

export default PageLoader;
