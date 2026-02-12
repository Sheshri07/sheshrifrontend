import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Shield } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, decreaseQuantity, addToCart, cartTotal } = useCart();

  const subtotal = cartTotal;
  const shipping = 0;
  const total = subtotal + shipping;
  const isAnyItemOutOfStock = cart.some(item => !item.inStock || item.countInStock <= 0);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-xl text-gray-600 mb-6">Your cart is currently empty.</p>
            <Link to="/products" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item._id}-${item.size}`}
                  className="flex items-center gap-6 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <img src={item.image || (item.images && item.images[0])} className="w-24 h-32 object-cover rounded-lg bg-gray-100" alt={item.name} />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">Size: {item.size}</p>
                        {item.stitchingDetails && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider mb-1">Stitching Details</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <p className="text-[10px] text-gray-600"><span className="font-semibold">Option:</span> {item.stitchingDetails.option}</p>
                              {item.stitchingDetails.option === 'Stitched' && (
                                <>
                                  <p className="text-[10px] text-gray-600"><span className="font-semibold">Size:</span> {item.stitchingDetails.stitchingSize}</p>
                                  <p className="text-[10px] text-gray-600"><span className="font-semibold">Padding:</span> {item.stitchingDetails.padding}</p>
                                  <p className="text-[10px] text-gray-600 col-span-2"><span className="font-semibold">Design:</span> {item.stitchingDetails.blouseDesign}</p>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        {item.sareeAddOns && (item.sareeAddOns.preDrape || item.sareeAddOns.petticoat) && (
                          <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1">Saree Add-ons</p>
                            <div className="space-y-1">
                              {item.sareeAddOns.preDrape && (
                                <p className="text-[10px] text-gray-600"><span className="font-semibold">✓ Pre Drape Service</span> (+₹1,750)</p>
                              )}
                              {item.sareeAddOns.petticoat && (
                                <p className="text-[10px] text-gray-600"><span className="font-semibold">✓ Satin Petticoat</span> (+₹1,245)</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition"
                        onClick={() => removeFromCart(item._id, item.size, item.stitchingDetails, item.sareeAddOns)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="space-y-1">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            className="px-3 py-1 hover:bg-gray-50 text-gray-600 border-r border-gray-200"
                            onClick={() => decreaseQuantity(item._id, item.size, item.stitchingDetails, item.sareeAddOns)}
                          >-</button>
                          <span className="px-3 py-1 text-sm font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            className="px-3 py-1 hover:bg-gray-50 text-gray-600 border-l border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => addToCart(item, 1, item.size)}
                            disabled={item.quantity >= item.countInStock}
                          >+</button>
                        </div>
                        {(!item.inStock || item.countInStock <= 0) && (
                          <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight">Currently Unavailable</p>
                        )}
                        {item.inStock && item.countInStock > 0 && item.countInStock <= 5 && (
                          <p className="text-[10px] text-orange-600 font-bold">Only {item.countInStock} Left</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-purple-600 font-bold text-lg block">₹{(
                          item.price * item.quantity +
                          (item.sareeAddOns?.preDrape ? 1750 * item.quantity : 0) +
                          (item.sareeAddOns?.petticoat ? 1245 * item.quantity : 0)
                        ).toLocaleString()}</span>
                        {item.quantity >= item.countInStock && item.countInStock > 0 && (
                          <span className="text-[10px] text-gray-400">Max limit reached</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-gray-900 text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={(e) => {
                    if (isAnyItemOutOfStock) e.preventDefault();
                  }}
                  className={`w-full text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mt-8 ${isAnyItemOutOfStock
                    ? "bg-gray-400 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
                    }`}
                >
                  <Shield size={20} />
                  {isAnyItemOutOfStock ? "Remove Out of Stock Items" : "Proceed to Checkout"}
                </Link>

                {isAnyItemOutOfStock && (
                  <p className="text-[10px] text-red-500 text-center mt-2 font-bold animate-pulse">
                    Please remove unavailable items to continue
                  </p>
                )}

                <p className="text-xs text-gray-400 text-center mt-4">
                  Tax included. Secure checkout powered by Stripe.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
