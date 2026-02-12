import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from "../services/wishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const data = await getWishlist();
            setWishlist(data.products || []);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (product) => {
        if (!user) {
            alert("Please login to add items to wishlist");
            return;
        }
        try {
            // Optimistic update
            setWishlist((prev) => [...prev, product]);
            await apiAddToWishlist(product._id);
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            fetchWishlist(); // Revert on error
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            setWishlist((prev) => prev.filter((p) => p._id !== productId));
            await apiRemoveFromWishlist(productId);
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            fetchWishlist();
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some((p) => p._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
