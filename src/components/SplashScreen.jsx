import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide splash screen after 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onComplete();
            }, 500); // Wait for fade out animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${!isVisible ? 'opacity-0' : 'opacity-100'}`}
            style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7b2cbf 100%)',
            }}>

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-blue-600/20 animate-pulse"></div>
            </div>

            {/* Animated rings */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="absolute w-96 h-96 md:w-[600px] md:h-[600px] border-2 border-white/10 rounded-full animate-ping-slow"></div>
                <div className="absolute w-80 h-80 md:w-[500px] md:h-[500px] border-2 border-purple-400/20 rounded-full animate-ping-slower"></div>
            </div>

            <div className="relative z-10">
                {/* Main glow effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-80 h-80 md:w-[600px] md:h-[600px] bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                </div>

                {/* Logo container with enhanced visibility */}
                <div className="relative z-20 animate-fade-in-scale">
                    <div className="relative p-8 md:p-12 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                        <img
                            src="/logo_v2.png"
                            alt="Sheshri Fashion"
                            className="w-72 h-72 md:w-96 md:h-96 object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] animate-gentle-bounce filter brightness-110 contrast-110"
                        />
                    </div>
                </div>

                {/* Enhanced floating decorative elements */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-full blur-2xl animate-float"></div>
                <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-gradient-to-br from-blue-400/40 to-purple-400/40 rounded-full blur-2xl animate-float-delayed"></div>

                {/* Brand name with enhanced visibility */}
                {/* <div className="absolute -bottom-24 md:-bottom-32 left-1/2 transform -translate-x-1/2 text-center animate-fade-in delay-500">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-[0.2em] drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        SHESHRI
                    </h1>
                    <p className="text-sm md:text-lg text-purple-200 uppercase tracking-[0.4em] mt-3 font-light">
                        Fashion
                    </p>
                </div> */}
            </div>

            {/* Enhanced loading indicator */}
            <div className="absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2">
                <div className="flex gap-3">
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-purple-300 rounded-full animate-bounce shadow-[0_0_10px_rgba(167,139,250,0.8)]" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-pink-300 rounded-full animate-bounce shadow-[0_0_10px_rgba(249,168,212,0.8)]" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
