import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, cancelOrder, abandonOrder } from "../services/orderService";
import { createPaymentOrder, verifyPayment, initiateMockPayment, initiatePayment } from "../services/paymentService";
import { useToast } from "../context/ToastContext";
import { Shield, CreditCard, Truck, Trash2 } from "lucide-react";

export default function Checkout() {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart, removeFromCart } = useCart();
    const toast = useToast();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [customization, setCustomization] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Online");

    const productBaseTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const preDrapeTotal = cart.reduce((total, item) => total + (item.sareeAddOns?.preDrape ? 1750 * item.quantity : 0), 0);
    const petticoatTotal = cart.reduce((total, item) => total + (item.sareeAddOns?.petticoat ? 1245 * item.quantity : 0), 0);

    const subtotal = cartTotal;
    const shipping = 0;
    const total = subtotal + shipping;

    const isAnyItemOutOfStock = cart.some(item => !item.inStock || item.countInStock <= 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (loading) return;

        // Basic validation
        if (!name || !phone || !address || !city || !state || !postalCode || !country) {
            toast.error("Please fill in all fields");
            return;
        }

        // Check for stock issues again before submitting
        if (isAnyItemOutOfStock) {
            toast.error("Please remove out of stock items before placing order");
            return;
        }

        // Phone number validation (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        // Postal code validation (6 digits)
        const postalRegex = /^\d{6}$/;
        if (!postalRegex.test(postalCode)) {
            toast.error("Postal code must be exactly 6 digits");
            return;
        }

        // Country validation (alphabetical only)
        const countryRegex = /^[a-zA-Z\s]+$/;
        if (!countryRegex.test(country)) {
            toast.error("Country name should only contain letters");
            return;
        }

        try {
            setLoading(true);
            const orderData = {
                orderItems: cart.map(item => ({
                    product: item._id || item.id,
                    qty: item.quantity,
                    image: item.image || (item.images && item.images[0]) || "",
                    price: item.price,
                    name: item.name,
                    size: item.size,
                    stitchingDetails: item.stitchingDetails,
                    sareeAddOns: item.sareeAddOns
                })),
                shippingAddress: { name, phone, address, city, state, postalCode, country },
                customization: customization || "",
                paymentMethod: paymentMethod,
                itemsPrice: subtotal,
                taxPrice: 0,
                shippingPrice: shipping,
                totalPrice: total,
            };

            const response = await createOrder(orderData);
            const orderId = response._id;

            if (paymentMethod === "Online") {
                // Initiate Payment Flow
                const paymentOrder = await createPaymentOrder(total, orderId);

                const options = {
                    key: paymentOrder.key || "YOUR_TEST_KEY_ID", // Fallback if backend doesn't send key (e.g. mock mode)
                    amount: paymentOrder.amount,
                    currency: paymentOrder.currency,
                    name: "Sheshri Fashion",
                    description: "Order Payment",
                    order_id: paymentOrder.orderId,
                    prefill: {
                        name: name,
                        contact: phone,
                    },
                    notes: { orderId: orderId }
                };

                // Determine which function to call based on mode
                const paymentFunction = paymentOrder.mode === 'mock' ? initiateMockPayment : initiatePayment;

                paymentFunction(options, async (paymentResponse) => {
                    try {
                        await verifyPayment({
                            ...paymentResponse,
                            orderId: orderId
                        });
                        toast.success("Payment successful and Order placed!");
                        clearCart();
                        // Trigger notification update
                        window.dispatchEvent(new Event('notificationUpdate'));
                        navigate(`/track/${orderId}`);
                    } catch (err) {
                        toast.error("Payment verification failed");
                        setLoading(false);
                    }
                }, async (error) => {
                    try {
                        // Mark the order as abandoned on backend to restore stock
                        await abandonOrder(orderId);
                    } catch (abandonErr) {
                        console.error("Failed to abandon order", abandonErr);
                    }
                    toast.error("Payment failed or cancelled. Proceed to checkout again if you wish.");
                    setLoading(false);
                });
            } else {
                // COD Flow
                toast.success("Order Placed Successfully (COD)!");
                clearCart();
                // Trigger notification update
                window.dispatchEvent(new Event('notificationUpdate'));
                navigate(`/track/${orderId}`);
            }
        } catch (error) {
            console.error("Order failed", error);
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-10">
                <Truck size={64} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some styles to your cart before checking out.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Shipping & Payment Form */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Truck size={24} className="text-primary-600" />
                                Shipping Address
                            </h2>
                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 text-sm p-3 border transition-all"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="Standard 10-digit number"
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                            inputMode="numeric"
                                            className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 text-sm p-3 border transition-all"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Address</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Flat, House no., Building, Company, Apartment"
                                        className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 text-sm p-3 border transition-all"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">City</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="City"
                                            className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 text-sm p-3 border transition-all"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">State</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="State"
                                            className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 text-sm p-3 border transition-all"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="6-digit Pincode"
                                            maxLength={6}
                                            pattern="[0-9]{6}"
                                            inputMode="numeric"
                                            className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 text-sm p-3 border transition-all"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Country</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="India"
                                            pattern="[a-zA-Z\s]*"
                                            className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 text-sm p-3 border transition-all"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Customization (Optional)</h2>
                            <p className="text-sm text-gray-500 mb-4">Add any special instructions or customization requests for your order</p>
                            <textarea
                                placeholder="E.g., Gift wrapping, specific delivery time, custom embroidery, etc."
                                rows={4}
                                className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 text-sm p-3 border transition-all resize-none"
                                value={customization}
                                onChange={(e) => setCustomization(e.target.value)}
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-400 mt-2 text-right">{customization.length}/500 characters</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard size={24} className="text-primary-600" />
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setPaymentMethod("Online")}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${paymentMethod === 'Online' ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${paymentMethod === 'Online' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Online Payment</p>
                                            <p className="text-xs text-gray-500">Cards, UPI, Netbanking</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Online' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                                        {paymentMethod === 'Online' && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                </div>
                                <div
                                    onClick={() => setPaymentMethod("COD")}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${paymentMethod === 'COD' ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${paymentMethod === 'COD' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <Truck size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Cash on Delivery</p>
                                            <p className="text-xs text-gray-500">Pay when you receive</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                                        {paymentMethod === 'COD' && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={`${item._id || item.id}-${item.size}`} className="flex gap-4 group">
                                        <div className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                                            <img src={item.image || (item.images && item.images[0])} alt={item.name} className={`w-full h-full object-cover ${(!item.inStock || item.countInStock <= 0) ? "opacity-50 grayscale" : ""}`} />
                                            {(!item.inStock || item.countInStock <= 0) && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                    <span className="text-[8px] bg-red-600 text-white px-1 py-0.5 rounded font-bold">SOLD OUT</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="font-bold text-gray-900 text-sm truncate pr-2">{item.name}</p>
                                                <button
                                                    onClick={() => removeFromCart(item._id || item.id, item.size, item.stitchingDetails, item.sareeAddOns)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                                            {item.stitchingDetails && (
                                                <div className="mt-1.5 p-1.5 bg-gray-50 rounded-lg border border-gray-100 text-[10px]">
                                                    <p className="font-bold text-primary-600 uppercase tracking-tighter mb-0.5">Stitching</p>
                                                    <div className="grid grid-cols-1 gap-0.5 text-gray-600">
                                                        <p><span className="font-semibold">Option:</span> {item.stitchingDetails.option}</p>
                                                        {item.stitchingDetails.option === 'Stitched' && (
                                                            <>
                                                                <p><span className="font-semibold">Size:</span> {item.stitchingDetails.stitchingSize}</p>
                                                                <p><span className="font-semibold">Padding:</span> {item.stitchingDetails.padding}</p>
                                                                <p className="truncate"><span className="font-semibold">Design:</span> {item.stitchingDetails.blouseDesign}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {item.sareeAddOns && (item.sareeAddOns.preDrape || item.sareeAddOns.petticoat) && (
                                                <div className="mt-1.5 p-1.5 bg-purple-50 rounded-lg border border-purple-100 text-[10px]">
                                                    <p className="font-bold text-purple-600 uppercase tracking-tighter mb-0.5">Saree Add-ons</p>
                                                    <div className="grid grid-cols-1 gap-0.5 text-gray-600">
                                                        {item.sareeAddOns.preDrape && <p><span className="font-semibold">✓ Pre Drape Service</span> (+₹1,750)</p>}
                                                        {item.sareeAddOns.petticoat && <p><span className="font-semibold">✓ Satin Petticoat</span> (+₹1,245)</p>}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="font-bold text-purple-600 text-sm">₹{item.price.toLocaleString()}</p>
                                                {(!item.inStock || item.countInStock <= 0) && (
                                                    <span className="text-xs text-red-600 font-bold">Out of Stock</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-gray-100 pt-6">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Product Total</span>
                                    <span className="font-medium text-gray-900">₹{productBaseTotal.toLocaleString()}</span>
                                </div>
                                {preDrapeTotal > 0 && (
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Pre Drape Service</span>
                                        <span className="font-medium text-gray-900">₹{preDrapeTotal.toLocaleString()}</span>
                                    </div>
                                )}
                                {petticoatTotal > 0 && (
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Satin Petticoat</span>
                                        <span className="font-medium text-gray-900">₹{petticoatTotal.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600 text-sm border-t border-gray-50 pt-2 mt-2">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold uppercase text-xs tracking-wider">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-900 font-bold text-xl pt-3 border-t border-gray-100 mt-3">
                                    <span>Total Amount</span>
                                    <span className="text-purple-600 font-serif">₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={loading || isAnyItemOutOfStock}
                                    className={`w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 ${loading || isAnyItemOutOfStock ? 'opacity-70 cursor-not-allowed grayscale' : ''}`}
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                    ) : (
                                        <>
                                            <Shield size={20} />
                                            {isAnyItemOutOfStock
                                                ? "Remove Out of Stock Items"
                                                : (paymentMethod === 'Online' ? 'Proceed to Pay' : 'Place Order (COD)')}
                                        </>
                                    )}
                                </button>
                                {isAnyItemOutOfStock && (
                                    <p className="text-xs text-red-500 text-center mt-3 font-bold">
                                        Some items in your cart are no longer available.
                                    </p>
                                )}
                                <p className="text-[10px] text-gray-400 text-center mt-4 flex items-center justify-center gap-1 uppercase tracking-widest font-bold">
                                    <Shield size={12} className="text-green-500" />
                                    100% Secure Checkout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

