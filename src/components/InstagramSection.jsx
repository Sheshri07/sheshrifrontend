import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import suits from '../assets/instagram/suits.png';
import kurtis from '../assets/instagram/kurtis.png';
import dupattas from '../assets/instagram/dupattas.png';
import sarees from '../assets/instagram/sarees.png';
import western from '../assets/instagram/western.png';
import lehenga from '../assets/instagram/lehenga.png';

const InstagramSection = () => {
    const [selectedPost, setSelectedPost] = useState(null);

    // Mock Data mimicking the screenshot vibe
    const posts = [
        {
            id: 1,
            image: suits,
            caption: "Elegance redefined in our latest Suits collection. Perfect for every occasion where grace meets style. ❤️",
            credit: "Collection - Royal Suits 2025",
            date: "25 January"
        },
        {
            id: 2,
            image: kurtis,
            caption: "Casual yet chic! Our designer Kurtis are the perfect addition to your everyday wardrobe. ✨",
            credit: "Style - Contemporary Kurtis",
            date: "22 January"
        },
        {
            id: 3,
            image: dupattas,
            caption: "The finishing touch you need. Explore our handpicked Dupattas that complete your ethnic ensemble.",
            credit: "Heritage Dupattas",
            date: "20 January"
        },
        {
            id: 4,
            image: sarees,
            caption: "Timeless beauty wrapped in 6 yards of tradition. Our Saree edit is here to make you feel like royalty.",
            credit: "Graceful Sarees",
            date: "18 January"
        },
        {
            id: 5,
            image: western,
            caption: "Fusion fashion for the modern muse. Step out in style with our Western Dress collection.",
            credit: "Western & Fusion Edit",
            date: "15 January"
        },
        {
            id: 6,
            image: lehenga,
            caption: "Bridal dreams come to life with our exquisite Lehengas. Designed to make your big day unforgettable.",
            credit: "Bridal Couture",
            date: "12 January"
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

            {/* Grid Layout */}
            {/* Grid Layout */}
            <div className="container mx-auto px-4 md:px-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                    {posts.slice(0, 6).map((post) => (
                        <div
                            key={post.id}
                            className="group relative aspect-square overflow-hidden cursor-pointer rounded-sm shadow-sm hover:shadow-md transition-all"
                            onClick={() => setSelectedPost(post)}
                        >
                            <img
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
                                            In stores - Mumbai | Delhi | Ahmedabad | Bengaluru | Surat | Hyderabad<br />
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
