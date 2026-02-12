import React from "react";
import { Link } from "react-router-dom";

const collections = [
    {
        id: 1,
        title: "Bridal Heritage",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2000&auto=format&fit=crop",
        description: "Timeless handcrafted lehengas for your special day."
    },
    {
        id: 2,
        title: "Festive Glamour",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop",
        description: "Shine bright with our exclusive festive collection."
    },
    {
        id: 3,
        title: "Modern Muse",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1908&auto=format&fit=crop",
        description: "Contemporary cuts meeting traditional aesthetics."
    },
    {
        id: 4,
        title: "Royal Silks",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1887&auto=format&fit=crop",
        description: "Rich silk sarees that exude elegance and grace."
    }
];

export default function Collections() {
    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-gray-900 mb-4">
                    Our Collections
                </h1>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
                    Explore our wide range of meticulously curated collections, designed to make you stand out on every occasion.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {collections.map((collection) => (
                        <div key={collection.id} className="group relative h-[400px] overflow-hidden rounded-xl shadow-lg cursor-pointer">
                            <img
                                src={collection.image}
                                alt={collection.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex flex-col justify-end p-8">
                                <h3 className="text-3xl font-serif font-bold text-white mb-2">{collection.title}</h3>
                                <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    {collection.description}
                                </p>
                                <Link
                                    to="/products"
                                    className="inline-block bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors w-fit"
                                >
                                    Explore Collection
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
