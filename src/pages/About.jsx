import React from "react";

export default function About() {
    return (
        <div className="bg-white min-h-screen py-4 md:py-8">
            {/* Hero Section */}
            <section className="container mx-auto px-4 md:px-6 mb-12 md:mb-20">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="w-full md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
                            alt="About Sheshri Fashion"
                            className="rounded-xl shadow-2xl w-full h-[300px] md:h-[500px] object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <span className="text-primary-600 font-bold tracking-[0.2em] uppercase text-[10px] md:text-sm mb-2 block">Our Story</span>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4 md:mb-6">
                            Redefining Ethnic Fashion
                        </h1>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-lg mb-4 md:mb-6">
                            SHESHRI is a brand born out of a desire to create a seamless blend of traditional Indian aesthetics and modern fashion sensibilities. We believe that every piece of clothing tells a story, and our mission is to help you tell yours with elegance and grace.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-lg mb-6 md:mb-8 font-medium">
                            From hand-embroidered lehengas to contemporary gowns, our collections are crafted with love, precision, and an eye for detail. We source the finest fabrics and work with skilled artisans to bring you masterpieces that are timeless.
                        </p>
                        <div className="flex gap-6 md:gap-8">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-primary-700">10+</h3>
                                <p className="text-[10px] md:text-sm text-gray-500 font-medium">Years of Experience</p>
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-primary-700">50k+</h3>
                                <p className="text-[10px] md:text-sm text-gray-500 font-medium">Happy Customers</p>
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-primary-700">100%</h3>
                                <p className="text-[10px] md:text-sm text-gray-500 font-medium">Handcrafted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-[#fafafa] py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-10 md:mb-16">
                        Why Choose Us?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm text-center hover:shadow-lg transition-all border border-gray-100 group">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Premium Quality</h3>
                            <p className="text-xs md:text-base text-gray-500 font-medium">We use only the finest fabrics and materials in our products.</p>
                        </div>
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm text-center hover:shadow-lg transition-all border border-gray-100 group">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Timeless Design</h3>
                            <p className="text-xs md:text-base text-gray-500 font-medium">Fashion that stays relevant and stylish for years to come.</p>
                        </div>
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm text-center hover:shadow-lg transition-all border border-gray-100 group">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Customer Focus</h3>
                            <p className="text-xs md:text-base text-gray-500 font-medium">Your satisfaction is our top priority, always.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
