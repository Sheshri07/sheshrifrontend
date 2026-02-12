import React from 'react';
import { Link } from 'react-router-dom';

const SareeEditSection = () => {
    return (
        <section className="bg-primary-50 py-8 md:py-12 mb-0">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-left mb-6">
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900">The Saree Edit</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 h-auto lg:h-[480px]">
                    {/* Left Column - Video */}
                    <div className="col-span-1 lg:col-span-5 relative h-[240px] md:h-[320px] lg:h-full group overflow-hidden rounded-sm">
                        <video
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster="https://ik.imagekit.io/4sjmoqtje/tr:w-600,c-at_max/cdn/shop/files/new-arrival-banner-banner.jpg"
                        >
                            <source src="https://ik.imagekit.io/4sjmoqtje/tr:c-at_max/cdn/shop/videos/c/vp/4dcaaaf548ab471caaa91bde03e76736/4dcaaaf548ab471caaa91bde03e76736.SD-480p-1.5Mbps-46542178.mp4?v=0" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Middle Column - Image Grid */}
                    <div className="col-span-1 lg:col-span-3 flex flex-col gap-4 h-[240px] md:h-[320px] lg:h-full">
                        <div className="h-1/2 relative overflow-hidden rounded-sm">
                            <img
                                src="https://ik.imagekit.io/4sjmoqtje/tr:w-400,c-at_max/cdn/shop/files/new-arrival-banner-2-400x264-deaktop-25-04-25.jpg?v=1745571087"
                                alt="Saree Detail"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="h-1/2 grid grid-cols-2 gap-4">
                            <div className="relative overflow-hidden rounded-sm">
                                <img
                                    src="https://ik.imagekit.io/4sjmoqtje/tr:w-200,c-at_max/cdn/shop/files/new-arrival-banner-4-200x282-deaktop-25-04-25.jpg?v=1745571087"
                                    alt="Saree Back View"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="relative overflow-hidden rounded-sm">
                                <img
                                    src="https://ik.imagekit.io/4sjmoqtje/tr:w-200,c-at_max/cdn/shop/files/new-arrival-banner-3-200x281-deaktop-25-04-25.jpg?v=1745571087"
                                    alt="Saree Front View"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Text Content */}
                    <div className="col-span-2 lg:col-span-4 flex flex-col justify-center items-center text-center p-6 lg:p-12">
                        <p className="font-serif italic text-3xl md:text-4xl text-[#9f4d4d] mb-2">Introducing</p>
                        <h3 className="font-serif text-4xl md:text-5xl text-[#5c1c1c] tracking-widest mb-8 uppercase">
                            INSTANT SAREE<span className="text-sm align-top">TM</span>
                        </h3>

                        <Link
                            to="/products?category=saree" // Ideally filtered to saree category if possible
                            className="bg-black text-white px-8 py-3 text-sm font-bold tracking-widest hover:bg-gray-800 transition-colors uppercase"
                        >
                            Pre-Drape Now
                        </Link>

                        <p className="mt-8 text-gray-600 font-serif italic">
                            Any saree can now be pre-draped instantly
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SareeEditSection;
