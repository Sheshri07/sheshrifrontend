import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag, Clock, MapPin, X, AlertCircle, RotateCcw, FileText, Ban } from 'lucide-react';
import { getMyOrders, cancelOrder } from '../services/orderService';
import { getProductById } from '../services/productService';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { generateInvoicePDF } from '../utils/invoiceGenerator';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    const toast = useToast();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchOrders = React.useCallback(async () => {
        try {
            const data = await getMyOrders();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load your orders');
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Clear orders when user logs out
    useEffect(() => {
        if (!user) {
            setOrders([]);
            setSelectedOrder(null);
            setShowHelpModal(false);
        }
    }, [user]);



    const handleBuyItAgain = async (order) => {
        const toastId = toast.loading("Checking stock availability...");
        let addedCount = 0;
        let outOfStockCount = 0;

        try {
            for (const item of order.orderItems) {
                try {
                    // Fetch fresh product data to check real-time stock
                    const productData = await getProductById(item.product);

                    if (productData && productData.inStock && productData.countInStock > 0) {
                        addToCart({
                            ...item,
                            _id: item.product,
                            countInStock: productData.countInStock, // Update with fresh stock limit
                            inStock: true
                        }, 1, item.size); // Default to 1 qty for re-order to be safe
                        addedCount++;
                    } else {
                        outOfStockCount++;
                    }
                } catch (err) {
                    console.error("Error checking product stock", err);
                    outOfStockCount++;
                }
            }

            toast.dismiss(toastId);

            if (addedCount > 0) {
                if (outOfStockCount > 0) {
                    toast.warning(`${addedCount} items added. ${outOfStockCount} items are currently out of stock.`);
                } else {
                    toast.success("All items added to cart!");
                }
                navigate('/cart');
            } else {
                toast.error("Sorry, these items are currently out of stock.");
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Failed to process request");
        }
    };

    const openHelpModal = (order) => {
        setSelectedOrder(order);
        setShowHelpModal(true);
    };

    const handleDownloadInvoice = () => {
        if (selectedOrder) {
            try {
                generateInvoicePDF(selectedOrder);
                toast.success("Invoice downloaded successfully");
            } catch (error) {
                console.error("Error generating invoice:", error);
                toast.error("Failed to generate invoice");
            }
        }
    };

    const handleWhatsAppChat = () => {
        const message = `Hi Support, I need help with my Order #${selectedOrder._id}.`;
        const url = `https://wa.me/911234567890?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;

        let confirmMessage = "Are you sure you want to cancel this order?";
        if (selectedOrder.isPaid) {
            confirmMessage += " Since this is a prepaid order, the refund process will solve initiated automatically.";
        }

        if (!window.confirm(confirmMessage)) {
            return;
        }

        setCancelLoading(true);
        try {
            await cancelOrder(selectedOrder._id);
            toast.success(selectedOrder.isPaid ? "Order cancelled. Refund initiated." : "Order cancelled successfully");
            setShowHelpModal(false);
            fetchOrders(); // Refresh list to show updated status
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setCancelLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">No Orders Yet</h1>
                    <p className="text-gray-500 mb-8">
                        You haven't placed any orders with us yet. Start exploring our latest collections!
                    </p>
                    <Link
                        to="/products"
                        className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition shadow-lg inline-block"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 pt-24 relative">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-serif font-bold text-gray-900">My Orders</h1>
                    <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
                    </span>
                </div>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Order Header */}
                            <div className="p-4 md:p-6 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Order Placed</p>
                                        <p className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Total Amount</p>
                                        <p className="text-sm font-bold text-primary-600">₹{order.totalPrice.toLocaleString()}</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Order ID</p>
                                        <p className="text-sm font-medium text-gray-700">#{order._id.slice(-8)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.trackingStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                        order.trackingStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {order.trackingStatus || 'Processing'}
                                    </span>
                                    <Link
                                        to={`/track/${order._id}`}
                                        className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1"
                                    >
                                        Track Order <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-4 md:p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        {order.orderItems.map((item, index) => (
                                            <div key={index} className="flex gap-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-20 object-cover rounded-lg shadow-sm"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Size: {item.size || 'M'} | Qty: {item.qty}</p>

                                                    {item.stitchingDetails && (
                                                        <div className="mt-2 p-2 bg-white rounded-lg border border-gray-100 text-[10px] shadow-sm max-w-sm">
                                                            <p className="font-bold text-primary-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                                <span className="w-1 h-1 bg-primary-600 rounded-full"></span>
                                                                Stitching
                                                            </p>
                                                            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-gray-600">
                                                                <p><span className="font-semibold text-gray-900">Type:</span> {item.stitchingDetails.option}</p>
                                                                {item.stitchingDetails.option === 'Stitched' && (
                                                                    <>
                                                                        <p><span className="font-semibold text-gray-900">Size:</span> {item.stitchingDetails.stitchingSize}</p>
                                                                        <p className="col-span-2"><span className="font-semibold text-gray-900">Design:</span> {item.stitchingDetails.blouseDesign}</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {item.sareeAddOns && (item.sareeAddOns.preDrape || item.sareeAddOns.petticoat) && (
                                                        <div className="mt-2 p-2 bg-white rounded-lg border border-gray-100 text-[10px] shadow-sm max-w-sm">
                                                            <p className="font-bold text-primary-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                                <span className="w-1 h-1 bg-primary-600 rounded-full"></span>
                                                                Add-ons
                                                            </p>
                                                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-gray-600">
                                                                {item.sareeAddOns.preDrape && (
                                                                    <p><span className="font-semibold text-gray-900">Pre-Drape:</span> Yes (+₹1,750)</p>
                                                                )}
                                                                {item.sareeAddOns.petticoat && (
                                                                    <p><span className="font-semibold text-gray-900">Petticoat:</span> Yes (+₹1,245)</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <p className="text-sm font-bold text-gray-900 mt-2">₹{item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-center">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <MapPin size={14} /> Shipping To
                                        </h3>
                                        <div className="text-sm text-gray-700">
                                            <p className="font-bold text-gray-900">{order.shippingAddress.name}</p>
                                            <p className="mt-1">{order.shippingAddress.address}</p>
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                            <p className="mt-2 text-xs font-medium bg-white px-3 py-1.5 rounded-lg inline-block border border-gray-100">
                                                {order.shippingAddress.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => navigate(`/order/${order._id}`)}
                                        className="text-xs font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-1 uppercase tracking-wider"
                                    >
                                        <Clock size={14} /> View Details
                                    </button>
                                    <button
                                        onClick={() => handleBuyItAgain(order)}
                                        className="text-xs font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-1 uppercase tracking-wider border-l border-gray-200 pl-4"
                                    >
                                        <ShoppingBag size={14} /> Buy it Again
                                    </button>
                                    <button
                                        onClick={() => openHelpModal(order)}
                                        className="text-xs font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-1 uppercase tracking-wider border-l border-gray-200 pl-4"
                                    >
                                        <Package size={14} /> Need Help?
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Need Help Modal */}
            {showHelpModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-xl font-serif font-bold text-gray-900">Order Help</h2>
                                <p className="text-xs text-gray-500 mt-1">ID: #{selectedOrder._id.slice(-8)}</p>
                            </div>
                            <button
                                onClick={() => setShowHelpModal(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Cancel Option */}
                            {(selectedOrder.trackingStatus === 'pending' || selectedOrder.trackingStatus === 'processing') && (
                                <div className="p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50 transition-all group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <Ban size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">Cancel Order</h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {selectedOrder.isPaid
                                                    ? "Order will be cancelled and refund initiated to source."
                                                    : "Instantly cancel your order."}
                                            </p>
                                            <button
                                                onClick={handleCancelOrder}
                                                disabled={cancelLoading}
                                                className="mt-3 text-xs font-bold bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full"
                                            >
                                                {cancelLoading ? 'Cancelling...' : 'Request Cancellation'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Download Invoice Option */}
                            <div className="p-4 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50 transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">Download Invoice</h3>
                                        <p className="text-xs text-gray-500 mt-1">Get a copy of your order invoice/receipt.</p>
                                        <button
                                            onClick={handleDownloadInvoice}
                                            className="mt-3 text-xs font-bold text-purple-600 border border-purple-200 bg-white px-4 py-2 rounded-lg hover:bg-purple-50 transition w-full block text-center"
                                        >
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Support Option */}
                            <div className="p-4 rounded-xl border border-gray-100 hover:border-green-100 hover:bg-green-50 transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">Chat Support</h3>
                                        <p className="text-xs text-gray-500 mt-1">Connect with us on WhatsApp for faster help.</p>
                                        <button
                                            onClick={handleWhatsAppChat}
                                            className="mt-3 text-xs font-bold text-green-600 border border-green-200 bg-white px-4 py-2 rounded-lg hover:bg-green-50 transition w-full block text-center"
                                        >
                                            Chat on WhatsApp
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Return / Exchange Option */}
                            <div className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <RotateCcw size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">Return or Replace</h3>
                                        <p className="text-xs text-gray-500 mt-1">Received a damaged item or wrong size? Let us know.</p>
                                        <a
                                            href={`mailto:sheshri07@gmail.com?subject=Return/Exchange Request for Order #${selectedOrder._id}&body=Hi Team,%0A%0AI would like to return/exchange items from my order #${selectedOrder._id} because...`}
                                            className="mt-3 text-xs font-bold text-blue-600 border border-blue-200 bg-white px-4 py-2 rounded-lg hover:bg-blue-50 transition w-full block text-center"
                                        >
                                            Email Return Request
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Refund Info Logic */}
                            {(selectedOrder.trackingStatus === 'cancelled' || selectedOrder.paymentResult?.status === 'refund_pending') && (
                                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-orange-800">Refund Status</h3>
                                            <p className="text-xs text-orange-700 mt-1">
                                                {selectedOrder.isPaid
                                                    ? "Refund has been initiated. It typically takes 5-7 business days."
                                                    : "Order was cancelled. No refund required as it was COD/Unpaid."}
                                            </p>
                                            {selectedOrder.paymentResult?.id && (
                                                <div className="mt-2 text-[10px] text-orange-600 font-mono bg-white/50 p-1 rounded">
                                                    Txn ID: {selectedOrder.paymentResult.id}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-gray-50 text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                            Customer Support: +91 7838418308
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;

