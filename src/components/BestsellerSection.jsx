import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import LazyImage from './LazyImage';

const BestsellerCard = ({ product }) => {
    return (
        <div className="relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col p-2 md:p-3">
            <Link to={`/product/${product._id || product.id}`} className="block relative rounded-xl overflow-hidden">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <LazyImage
                        src={product.images?.[0] || product.image || "/placeholder.jpg"}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
            </Link>
            <div className="mt-2 md:mt-4 flex-grow flex flex-col justify-between text-center md:text-left">
                <div className="min-h-[40px] md:min-h-[48px] flex flex-col justify-start">
                    <h3 className="text-gray-900 font-medium text-sm md:text-base leading-tight mb-2 line-clamp-2 overflow-hidden">
                        {product.name}
                    </h3>
                </div>
                <p className="text-gray-900 font-bold text-base md:text-lg">
                    ₹{product.price?.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

const BestsellerSection = ({ title, products, bgColor = "bg-[#FAF5FF]", showViewAll = true, viewAllLink = "/products", customPadding = "py-12 md:py-20", customMargin = "mb-12", loading = false }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const containerWidth = scrollRef.current.clientWidth;
            const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // If not loading and no products, don't render the section at all to avoid empty space
    if (!loading && products.length === 0) return null;

    return (
        <section className={`${bgColor} ${customPadding} ${customMargin}`}>
            <div className="container mx-auto px-6">
                <div className="relative flex flex-col items-center justify-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 text-center px-4">
                        {title}
                    </h2>
                    {showViewAll && (
                        <Link
                            to={viewAllLink}
                            className="hidden md:absolute md:right-0 md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary-600 transition-colors border-b border-gray-900 pb-0.5 hover:border-primary-600"
                        >
                            View All <ArrowRight size={16} />
                        </Link>
                    )}
                </div>

                <div className={`relative group ${showViewAll ? "mb-10" : "mb-2"}`}>
                    <button
                        onClick={() => scroll('left')}
                        className="flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm shadow-md rounded-full items-center justify-center text-gray-800 transition-colors hover:bg-white hover:scale-110 -ml-3 md:-ml-6"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex items-stretch overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {loading ? (
                            // Render skeleton loaders when loading
                            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div
                                    key={i}
                                    className="w-[calc(50%-8px)] md:w-[calc(45%-18px)] lg:w-[calc(25%-20px)] snap-start flex-shrink-0 flex flex-col"
                                >
                                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm h-full flex flex-col p-2 md:p-3 animate-pulse">
                                        <div className="relative rounded-xl overflow-hidden bg-gray-200 aspect-[3/4] w-full"></div>
                                        <div className="mt-4 flex-grow flex flex-col justify-between">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            products.map((product) => (
                                <div
                                    key={product._id || product.id}
                                    className="w-[calc(50%-8px)] md:w-[calc(45%-18px)] lg:w-[calc(25%-20px)] snap-start flex-shrink-0 flex flex-col"
                                >
                                    <BestsellerCard product={product} />
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={() => scroll('right')}
                        className="flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm shadow-md rounded-full items-center justify-center text-gray-800 transition-colors hover:bg-white hover:scale-110 -mr-3 md:-mr-6"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {showViewAll && (
                    <div className="md:hidden text-center mt-6">
                        <Link
                            to={viewAllLink}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-900 text-xs font-bold uppercase tracking-widest hover:bg-primary-50 transition-all rounded-full"
                        >
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BestsellerSection;
