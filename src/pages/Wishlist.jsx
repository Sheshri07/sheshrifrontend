import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag } from "lucide-react";

export default function Wishlist() {
    const { wishlist, removeFromWishlist, loading } = useWishlist();
    const { addToCart } = useCart();

    if (loading) {
        return <div className="text-center py-20">Loading wishlist...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-20 px-6 min-h-screen">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">My Wishlist ({wishlist.length})</h1>

            {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <p className="text-xl text-gray-500 mb-4">Your wishlist is empty.</p>
                    <Link to="/products" className="text-primary-600 font-medium hover:underline">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlist.map((product) => (
                        <div key={product._id} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-80 overflow-hidden">
                                <img
                                    src={product.images?.[0] || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <button
                                    onClick={() => removeFromWishlist(product._id)}
                                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4">
                                <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">₹{product.price?.toLocaleString()}</p>

                                <button
                                    onClick={() => addToCart({ ...product, quantity: 1, size: product.sizes?.[0] || 'M' })}
                                    className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="w-4 h-4" /> Move to Bag
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
