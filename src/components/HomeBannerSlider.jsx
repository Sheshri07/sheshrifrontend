import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { API } from '../utils/api';

const HomeBannerSlider = () => {
    const [banners, setBanners] = useState([]);

    const defaultBanners = [
        {
            _id: 'default-1',
            image: '/slider-banners/banner1.jpg',
            mobileImage: '/slider-banners/banner1.jpg',
            link: '/products',
            alt: 'Default Banner 1'
        },
        {
            _id: 'default-2',
            image: '/slider-banners/banner2.jpg',
            mobileImage: '/slider-banners/banner2.jpg',
            link: '/products?category=western',
            alt: 'Default Banner 2'
        }
    ];

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const { data } = await API.get('/banners');
                if (data && data.length > 0) {
                    setBanners(data);
                } else {
                    setBanners(defaultBanners);
                }
            } catch (err) {
                console.error("Failed to fetch banners", err);
                setBanners(defaultBanners);
            }
        };
        fetchBanners();
    }, []);

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide functionality
    useEffect(() => {
        if (banners.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [banners.length]);

    const goToNext = () => {
        if (banners.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const goToPrevious = () => {
        if (banners.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    if (!banners.length) return null;

    return (
        <div className="relative w-full overflow-hidden group">
            {/* Slider Content */}
            <div
                className="flex transition-transform duration-500 ease-out h-auto md:h-[600px] lg:h-[700px]"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <Link
                        key={banner._id}
                        to={banner.link || '#'}
                        className="w-full flex-shrink-0 relative cursor-pointer"
                    >
                        <picture>
                            <source media="(max-width: 768px)" srcSet={banner.mobileImage} />
                            <img
                                src={banner.image}
                                alt={banner.alt || "Banner"}
                                className="w-full h-auto md:h-full object-contain md:object-cover"
                            />
                        </picture>
                    </Link>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 text-gray-800 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                aria-label="Previous Slide"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 text-gray-800 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                aria-label="Next Slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomeBannerSlider;
