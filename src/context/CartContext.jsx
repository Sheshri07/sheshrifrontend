import { createContext, useContext, useState, useEffect } from "react";
import { safeLocalStorage } from "../utils/storage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = safeLocalStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    safeLocalStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, size = "S", stitchingDetails = null, sareeAddOns = null) => {
    setCart((prev) => {
      const existing = prev.find((item) =>
        (item._id === product._id || item.id === product._id) &&
        item.size === size &&
        JSON.stringify(item.stitchingDetails) === JSON.stringify(stitchingDetails) &&
        JSON.stringify(item.sareeAddOns) === JSON.stringify(sareeAddOns)
      );
      if (existing) {
        return prev.map((item) =>
          (item._id === product._id || item.id === product._id) &&
            item.size === size &&
            JSON.stringify(item.stitchingDetails) === JSON.stringify(stitchingDetails) &&
            JSON.stringify(item.sareeAddOns) === JSON.stringify(sareeAddOns)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, size, stitchingDetails, sareeAddOns }];
    });
  };

  const removeFromCart = (id, size, stitchingDetails = null, sareeAddOns = null) => {
    setCart((prev) => prev.filter((item) =>
      !((item._id === id || item.id === id) && item.size === size && JSON.stringify(item.stitchingDetails) === JSON.stringify(stitchingDetails) && JSON.stringify(item.sareeAddOns) === JSON.stringify(sareeAddOns))
    ));
  };

  const decreaseQuantity = (id, size, stitchingDetails = null, sareeAddOns = null) => {
    setCart((prev) => {
      return prev.map((item) => {
        if ((item._id === id || item.id === id) && item.size === size && JSON.stringify(item.stitchingDetails) === JSON.stringify(stitchingDetails) && JSON.stringify(item.sareeAddOns) === JSON.stringify(sareeAddOns)) {
          return item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item;
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    let itemTotal = item.price * item.quantity;

    // Add saree add-ons costs if present
    if (item.sareeAddOns) {
      if (item.sareeAddOns.preDrape) {
        itemTotal += 1750 * item.quantity; // Pre-drape service cost
      }
      if (item.sareeAddOns.petticoat) {
        itemTotal += 1245 * item.quantity; // Petticoat cost
      }
    }

    return total + itemTotal;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
