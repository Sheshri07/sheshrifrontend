import React, { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import LazyImage from './LazyImage';

const InstagramSection = () => {
    const [selectedPost, setSelectedPost] = useState(null);
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Instagram Posts Data using images from public/images
    const posts = [
        {
            id: 1,
            image: '/images/IMG_1238.JPG.jpeg',
            caption: "Vibrant hues and intricate details. Our latest lime green and pink ensemble is a celebration of tradition and modern grace. ✨",
            credit: "Collection - Festive Suits 2025",
            date: ""
        },
        {
            id: 2,
            image: '/images/IMG_1388.JPG.jpeg',
            caption: "Chic, contemporary, and absolutely stunning. This white mini dress is the perfect choice for your next evening out. 💫",
            credit: "Style - Modern Muse",
            date: ""
        },
        {
            id: 3,
            image: '/images/IMG_1446.JPG.jpeg',
            caption: "Elegance in white. A timeless blazer set that exudes confidence and sophisticated style. 🤍",
            credit: "Edit - Power Dressing",
            date: ""
        },
        {
            id: 4,
            image: '/images/IMG_1448.JPG.jpeg',
            caption: "Comfort meets couture. Relax in style with our exquisitely crafted white lounge ensemble. 🛋️",
            credit: "Collection - Resort Wear",
            date: ""
        },
        {
            id: 5,
            image: '/images/IMG_1735.JPG.jpeg',
            caption: "Prints that pop! Our purple printed suit is designed for the woman who loves to make a statement. 💜",
            credit: "Design - Floral Fusion",
            date: ""
        },
        {
            id: 6,
            image: '/images/IMG_1736.JPG.jpeg',
            caption: "A vision in ivory. This ethereal gown is crafted for moments that last a lifetime. 👗",
            credit: "Couture - Evening Gala",
            date: ""
        },
        {
            id: 7,
            image: '/images/IMG_1739.JPG.jpeg',
            caption: "Think pink! Embrace your feminine side with this beautifully detailed traditional pink outfit. 💕",
            credit: "Heritage - Classic Pink Edit",
            date: ""
        },
        {
            id: 8,
            image: '/images/IMG_1740.JPG.jpeg',
            caption: "The quintessential bridal red. A masterpiece lehenga that tells a story of heritage and hope. ❤️",
            credit: "Bridal - The Wedding Edit",
            date: ""
        },
        {
            id: 9,
            image: '/images/IMG_1171.PNG',
            caption: "Discover the magic of 'Throne & Theater'. A collection where heritage meets the spotlight. Featuring our exquisite ivory and maroon traditional wear. �🏛️",
            credit: "Collection - Throne & Theater 2025",
            date: ""
        }
    ];

    const handleNext = (e) => {
        e.stopPropagation();
        if (!selectedPost) return;
        const currentIndex = posts.findIndex(p => p.id === selectedPost.id);
        const nextIndex = (currentIndex + 1) % posts.length;
        setSelectedPost(posts[nextIndex]);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        if (!selectedPost) return;
        const currentIndex = posts.findIndex(p => p.id === selectedPost.id);
        const prevIndex = (currentIndex - 1 + posts.length) % posts.length;
        setSelectedPost(posts[prevIndex]);
    };

    return (
        <section className="bg-primary-50 py-8 md:py-12 mb-8 md:mb-20">
            <div className="container mx-auto px-4 mb-4 text-center">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-1 uppercase tracking-wide">
                    VISIT OUR INSTAGRAM DIARIES
                </h2>
                <a
                    href="https://www.instagram.com/sheshri07"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C1995D] font-medium hover:underline text-xs md:text-sm tracking-wide"
                >
                    Follow To Know More @sheshri07
                </a>
            </div>

            {/* Grid Layout - Updated for 9 images in 1 row, 3 per view on mobile */}
            <div className="container mx-auto px-2 md:px-12 relative group/insta-slider">
                {/* Scroll Buttons for Mobile */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center text-gray-800 border border-gray-100 md:hidden"
                    aria-label="Scroll Left"
                >
                    <ChevronLeft size={18} strokeWidth={3} />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center text-gray-800 border border-gray-100 md:hidden"
                    aria-label="Scroll Right"
                >
                    <ChevronRight size={18} strokeWidth={3} />
                </button>

                <div
                    ref={scrollRef}
                    className="flex md:grid md:grid-cols-9 gap-1 md:gap-4 overflow-x-auto no-scrollbar snap-x scroll-smooth"
                >
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="group relative aspect-square overflow-hidden cursor-pointer rounded-sm shadow-sm hover:shadow-md transition-all flex-shrink-0 w-[calc(33.33%-3px)] md:w-auto snap-start"
                            onClick={() => setSelectedPost(post)}
                        >
                            <LazyImage
                                src={post.image}
                                alt={post.caption}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Instagram className="text-white w-8 h-8 opacity-80" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            {
                selectedPost && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-0 md:p-10" onClick={() => setSelectedPost(null)}>

                        <button
                            onClick={() => setSelectedPost(null)}
                            className="absolute top-4 right-4 md:right-8 text-white hover:text-gray-300 z-50 p-2"
                        >
                            <X size={32} />
                        </button>

                        <button
                            onClick={handlePrev}
                            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-50 p-2 transition-colors rounded-full hover:bg-white/10"
                        >
                            <ChevronLeft size={48} />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-50 p-2 transition-colors rounded-full hover:bg-white/10"
                        >
                            <ChevronRight size={48} />
                        </button>

                        <div
                            className="bg-white w-full max-w-[1100px] h-full max-h-[85vh] flex flex-col md:flex-row shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 rounded-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Image Section - Takes larger width */}
                            <div className="w-full md:w-[65%] lg:w-[70%] h-[50%] md:h-full bg-black relative">
                                <img
                                    src={selectedPost.image}
                                    alt="Instagram Post"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="w-full md:w-[35%] lg:w-[30%] flex flex-col h-[50%] md:h-full bg-white relative">

                                {/* Header */}
                                <div className="p-5 flex items-center gap-3 border-b border-gray-100">
                                    <Instagram className="w-6 h-6 text-black" />
                                    <span className="font-bold text-sm md:text-base text-gray-900">sheshri07</span>
                                </div>

                                {/* Scrollable Caption Area */}
                                <div className="flex-1 p-5 overflow-y-auto no-scrollbar">
                                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-6 font-light">
                                        {selectedPost.caption}
                                    </p>

                                    <div className="mb-6 whitespace-pre-wrap text-xs md:text-sm text-gray-500">
                                        {selectedPost.credit}
                                    </div>

                                    <p className="text-xs md:text-sm text-gray-500 mb-6 italic">
                                        Drop a "❤️" if your love story deserves to be featured next.
                                    </p>

                                    <div className="mb-6">
                                        <h4 className="font-bold text-xs md:text-sm uppercase tracking-widest text-gray-900 mb-1">THE WEDDING EDIT</h4>
                                        <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed">
                                            In stores - Puri High Street, 101B, Sector 81, Faridabad, Haryana 121004<br />
                                            Online - www.sheshrifashion.com
                                        </p>
                                    </div>

                                    <p className="text-xs text-gray-400">
                                        #sheshri #sheshribride #bridallehenga #realbrides #weddinginspiration #indianwedding
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="p-4 border-t border-gray-100 mt-auto bg-white">
                                    <p className="text-[10px] uppercase tracking-wide text-gray-400">{selectedPost.date}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </section >
    );
};

export default InstagramSection;

