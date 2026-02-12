import React, { useState } from 'react';
import { MapPin, Clock, Phone, ArrowRight, X } from 'lucide-react';

const StoreVisitSection = () => {
    const [showImageModal, setShowImageModal] = useState(false);

    return (
        <section className="bg-primary-50/20 border-t border-primary-100/50 pt-10 md:pt-16 pb-6 md:pb-8 text-sm">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                    {/* Content Side */}
                    <div className="order-2 lg:order-1 space-y-4 lg:space-y-8">
                        <div>
                            <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary-100 text-primary-700 font-bold text-[10px] md:text-xs tracking-widest uppercase mb-2 md:mb-4">
                                Experience In Person
                            </span>
                            <h2 className="text-2xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-2 md:mb-4">
                                Visit Our Store
                            </h2>
                            <p className="text-gray-600 text-sm md:text-lg leading-relaxed max-w-lg">
                                Step into the world of Sheshri Fashion. Experience our premium collections, feel the fabrics, and get personalized styling advice from our experts.
                            </p>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-600">
                                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm md:text-base text-gray-900 mb-0.5 md:mb-1">Address</h4>
                                    <p className="text-gray-600 text-xs md:text-sm">Puri High Street, 101B, Sector 81, Faridabad, Haryana 121004</p>
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=Sheshri+Fashion+Sector+16+Faridabad"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary-600 text-[10px] md:text-xs font-bold uppercase tracking-wide mt-1 md:mt-2 hover:underline"
                                    >
                                        Get Directions <ArrowRight size={12} />
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-600">
                                    <Clock className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm md:text-base text-gray-900 mb-0.5 md:mb-1">Opening Hours</h4>
                                    <p className="text-gray-600 text-xs md:text-sm">Mon - Sun: 10:00 AM - 9:00 PM</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <a
                                    href="/visit-store"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-2 md:px-8 md:py-3 bg-gray-900 text-white font-bold uppercase tracking-widest text-xs md:text-sm rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    View Store Details <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="order-1 lg:order-2 relative group cursor-pointer" onClick={() => setShowImageModal(true)}>
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] md:aspect-[4/3] bg-gray-100">
                            <img
                                src="/store-front.png"
                                alt="Sheshri Fashion Store Front"
                                className="w-full h-full object-cover bg-gray-200 transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="text-sm font-bold uppercase tracking-widest opacity-90 mb-1">Welcome to</p>
                                <h3 className="text-2xl font-serif font-bold">Sheshri Fashion & Clothing</h3>
                            </div>
                        </div>

                        {/* Floating Logo Card */}
                        <div className="absolute -bottom-6 -left-6 md:bottom-8 md:-left-12 z-20 w-48 bg-white p-4 rounded-xl shadow-xl border border-gray-100 transform rotate-3 transition-transform duration-500 group-hover:rotate-0 hover:scale-105 hidden md:block">
                            <img
                                src="/store-logo.png"
                                alt="Sheshri Logo"
                                className="w-full h-auto object-contain"
                            />
                        </div>

                        {/* Decoration */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl -z-10"></div>
                    </div>
                </div>
            </div>

            {/* Full Screen Image Modal */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setShowImageModal(false)}
                >
                    <button
                        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition"
                        onClick={() => setShowImageModal(false)}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src="/store-front.png"
                        alt="Sheshri Fashion Store Front"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
};

export default StoreVisitSection;
