import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
    {
        id: 1,
        image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/9/7927ecfSILVER30001_TFH_1.jpg?rnd=20200526195200&tr=w-1080",
        title: "The Royal Saree Edit",
        subtitle: "Drape yourself in timeless elegance",
        link: "/products?category=saree"
    },
    {
        id: 2,
        image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS7nn18vvmb5bm7YDuVc3gUMu8Y27zhVXWEyGyruL6gP03rYcgXmh5GtEFZajJuLlKic-s6uWzUqNxQUCBVZzXjPUVi7xVxidmpaj0Fih4",
        title: "The Modern Suit Edit",
        subtitle: "Elegant suits & kurtis for every occasion",
        link: "/products?category=suit"
    },
    {
        id: 3,
        image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcThRt0D7JoNdh16acyRJPOhmw0uDhF_C_WL9uzYOWER6Ys0DWI02pp6mMFE_l3NkE2WM0mBjwrZ36u2PWmez4eb0zuQ5G9QionDNpjxcpu8",
        title: "Dupattas & Accessories",
        subtitle: "Complete your ethnic look",
        link: "/products?category=dupatta"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2000&auto=format&fit=crop",
        title: "Western Fusion Edit",
        subtitle: "Contemporary styles for the modern maven",
        link: "/products?category=western"
    }
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full h-[500px] md:h-[600px] flex flex-col md:flex-row overflow-hidden bg-primary-50/20">

            {/* LEFT TEXT SECTION */}
            <div className="relative w-full md:w-[40%] lg:w-[35%] h-[40%] md:h-full bg-white/40 backdrop-blur-md flex items-center justify-center z-20 order-2 md:order-1 border-r border-primary-100/50">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 flex flex-col justify-center items-start px-8 md:pl-32 md:pr-12
                        transition-all duration-700 ease-in-out
                        ${index === currentSlide
                                ? "opacity-100 translate-y-0 z-20 pointer-events-auto"
                                : "opacity-0 translate-y-6 z-0 pointer-events-none"
                            }`}
                    >
                        <h2 className="text-xs md:text-sm font-bold tracking-[0.25em] mb-4 text-gray-500 uppercase">
                            New Collection
                        </h2>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 text-gray-900 leading-tight">
                            {slide.title}
                        </h1>

                        <p className="text-sm md:text-base text-gray-600 mb-8 max-w-xs leading-relaxed font-light">
                            {slide.subtitle}
                        </p>

                        <Link
                            to={slide.link}
                            className="group inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-all duration-300"
                        >
                            Shop Now
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ))}
            </div>

            {/* RIGHT IMAGE SECTION */}
            <div className="relative w-full md:w-[60%] lg:w-[65%] h-[60%] md:h-full overflow-hidden order-1 md:order-2 bg-subtle-purple">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                        ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            loading="eager"
                            className={`w-full h-full object-contain bg-subtle-purple
                            transition-transform duration-[5000ms] ease-out
                            ${index === currentSlide ? "scale-[1.02]" : "scale-100"}`}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows - Side Aligned (Absolute to Container) */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2 text-gray-400 hover:text-black transition-all duration-300 hidden md:block"
                aria-label="Previous slide"
            >
                <ChevronLeft size={64} strokeWidth={1} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 text-gray-400 hover:text-black transition-all duration-300 hidden md:block"
                aria-label="Next slide"
            >
                <ChevronRight size={64} strokeWidth={1} />
            </button>

            {/* Mobile Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-[30%] -translate-y-1/2 z-40 p-2 md:hidden bg-white/40 backdrop-blur-md rounded-full text-black shadow-sm"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-2 top-[30%] -translate-y-1/2 z-40 p-2 md:hidden bg-white/40 backdrop-blur-md rounded-full text-black shadow-sm"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all rounded-full h-1.5
                        ${index === currentSlide
                                ? "w-8 bg-black"
                                : "w-1.5 bg-gray-300 hover:bg-gray-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;
