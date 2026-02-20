import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById, cancelOrder, requestReturn } from "../services/orderService";
import { ArrowLeft, Package, Clock, MapPin, Info, Phone, Mail, CheckCircle, Truck, ExternalLink, Ban, FileText, RotateCcw, AlertCircle, ChevronRight } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { generateInvoicePDF } from "../utils/invoiceGenerator";

const CustomerOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [returnLoading, setReturnLoading] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const toast = useToast();

    const fetchOrder = React.useCallback(async () => {
        try {
            const data = await getOrderById(id);
            setOrder(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching order:", err);
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleDownloadInvoice = () => {
        if (order) {
            try {
                generateInvoicePDF(order);
                toast.success("Invoice downloaded successfully");
            } catch (error) {
                console.error("Error generating invoice:", error);
                toast.error("Failed to generate invoice");
            }
        }
    };

    const handleWhatsAppChat = () => {
        const message = `Hi Support, I need help with my Order #${order._id}.`;
        const url = `https://wa.me/917838418308?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleCancelOrder = async () => {
        if (!order) return;

        let confirmMessage = "Are you sure you want to cancel this order?";
        if (order.isPaid) {
            confirmMessage += " Since this is a prepaid order, the refund process will be initiated automatically.";
        }

        if (!window.confirm(confirmMessage)) {
            return;
        }

        setCancelLoading(true);
        try {
            await cancelOrder(order._id);
            toast.success(order.isPaid ? "Order cancelled. Refund initiated." : "Order cancelled successfully");
            fetchOrder(); // Refresh data to show updated status
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setCancelLoading(false);
        }
    };

    const handleRequestReturn = async () => {
        if (!order) return;
        if (!returnReason.trim()) {
            toast.error("Please provide a reason for return");
            return;
        }

        setReturnLoading(true);
        try {
            await requestReturn(order._id, returnReason);
            toast.success("Return request submitted successfully");
            setReturnReason("");
            fetchOrder();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit return request");
        } finally {
            setReturnLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error || !order) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="p-8 text-center bg-white rounded-2xl shadow-xl max-w-md w-full border border-red-100">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-500 mb-6">{error || "The order you are looking for does not exist or you don't have permission to view it."}</p>
                <Link to="/orders" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition shadow-lg">
                    Back to My Orders
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 pt-24 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/orders" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors group">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to My Orders
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Order Header */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Order #{order._id.slice(-8)}</h1>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-2">
                                    <Clock size={16} /> Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.trackingStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                    order.trackingStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {order.trackingStatus ? order.trackingStatus.replace('_', ' ') : 'Pending'}
                                </span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Package className="text-primary-600" /> Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 md:gap-6 p-4 bg-gray-50 rounded-2xl group border border-transparent hover:border-gray-200 transition-all">
                                        <img src={item.image} alt={item.name} className="w-20 h-24 md:w-24 md:h-32 object-cover rounded-xl shadow-sm" />
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/product/${item.product}`} className="font-bold text-gray-900 hover:text-primary-600 transition truncate block text-base md:text-lg">
                                                {item.name}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest">Size: {item.size || "M"}</p>
                                            {item.stitchingDetails && (
                                                <div className="mt-3 p-3 bg-white rounded-xl border border-gray-100 text-xs shadow-sm">
                                                    <p className="font-bold text-primary-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                                                        Stitching Specification
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-gray-600">
                                                        <p><span className="font-semibold text-gray-900">Option:</span> {item.stitchingDetails.option}</p>
                                                        {item.stitchingDetails.option === 'Stitched' && (
                                                            <>
                                                                <p><span className="font-semibold text-gray-900">Custom Size:</span> {item.stitchingDetails.stitchingSize}</p>
                                                                <p><span className="font-semibold text-gray-900">Padding:</span> {item.stitchingDetails.padding}</p>
                                                                <p className="col-span-2"><span className="font-semibold text-gray-900">Style Chosen:</span> {item.stitchingDetails.blouseDesign}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {item.sareeAddOns && (item.sareeAddOns.preDrape || item.sareeAddOns.petticoat) && (
                                                <div className="mt-3 p-3 bg-white rounded-xl border border-gray-100 text-xs shadow-sm">
                                                    <p className="font-bold text-primary-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                                                        Saree Add-ons
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-gray-600">
                                                        {item.sareeAddOns.preDrape && (
                                                            <p className="flex items-center gap-2"><span className="font-semibold text-gray-900">Pre-Drape:</span> Yes (+₹1,750)</p>
                                                        )}
                                                        {item.sareeAddOns.petticoat && (
                                                            <p className="flex items-center gap-2"><span className="font-semibold text-gray-900">Petticoat:</span> Yes (+₹1,245)</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-700 mt-4 font-medium">
                                                {item.qty} x ₹{item.price.toLocaleString()} = <span className="text-primary-600 font-bold text-lg ml-1">₹{(item.qty * item.price).toLocaleString()}</span>
                                            </p>
                                        </div>
                                        <Link to={`/product/${item.product}`} className="hidden md:flex p-2 bg-white rounded-full text-gray-400 hover:text-primary-600 hover:shadow-md transition-all">
                                            <ExternalLink size={20} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Help & Support Options Section */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Clock className="text-primary-600" /> Need Help?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Cancel Option */}
                                {(order.trackingStatus === 'pending' || order.trackingStatus === 'processing') && (
                                    <div className="p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50 transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
                                                <Ban size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900">Cancel Order</h3>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {order.isPaid
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
                                <div className="p-4 rounded-xl border border-gray-100 hover:border-primary-100 hover:bg-primary-50 transition-all group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">Download Invoice</h3>
                                            <p className="text-xs text-gray-500 mt-1">Get a copy of your order invoice/receipt.</p>
                                            <button
                                                onClick={handleDownloadInvoice}
                                                className="mt-3 text-xs font-bold text-primary-600 border border-primary-200 bg-white px-4 py-2 rounded-lg hover:bg-primary-50 transition w-full block text-center"
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
                                {order.trackingStatus === 'delivered' && (
                                    <div className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                                <RotateCcw size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900">Return or Replace</h3>

                                                {(!order.returnStatus || order.returnStatus === 'None') ? (
                                                    <>
                                                        {(() => {
                                                            if (order.deliveredAt) {
                                                                const deliveredDate = new Date(order.deliveredAt);
                                                                const currentDate = new Date();
                                                                const diffTime = Math.abs(currentDate - deliveredDate);
                                                                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                                                                if (diffDays > 7) {
                                                                    return (
                                                                        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                                                            <p className="text-xs text-red-600 font-bold">
                                                                                order not retund becuse retund request only submit with 7 din of the delevvery
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }
                                                            }

                                                            return (
                                                                <>
                                                                    <p className="text-xs text-gray-500 mt-1">Received a damaged item or wrong size? Request a return below.</p>
                                                                    <textarea
                                                                        value={returnReason}
                                                                        onChange={(e) => setReturnReason(e.target.value)}
                                                                        placeholder="Please describe the issue (e.g., Wrong size, Damaged item)..."
                                                                        className="w-full mt-3 p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none resize-none"
                                                                        rows="2"
                                                                    />
                                                                    <button
                                                                        onClick={handleRequestReturn}
                                                                        disabled={returnLoading}
                                                                        className="mt-3 text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full block text-center disabled:opacity-50"
                                                                    >
                                                                        {returnLoading ? 'Submitting...' : 'Submit Return Request'}
                                                                    </button>
                                                                </>
                                                            );
                                                        })()}
                                                    </>
                                                ) : (
                                                    <div className="mt-2">
                                                        <p className="text-xs text-gray-500 mb-2">Return Status:</p>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                                                            ${order.returnStatus === 'Requested' ? 'bg-orange-100 text-orange-700' :
                                                                order.returnStatus === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                                    order.returnStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                                                                        'bg-red-100 text-red-700'}`}>
                                                            {order.returnStatus}
                                                        </span>
                                                        {order.returnReason && (
                                                            <p className="text-xs text-gray-500 mt-2 italic">"{order.returnReason}"</p>
                                                        )}
                                                        {order.returnAdminNote && (
                                                            <div className="mt-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs">
                                                                <p className="font-bold text-blue-800 mb-1 flex items-center gap-1">
                                                                    <FileText size={12} /> Message from Admin:
                                                                </p>
                                                                <p className="text-blue-700 leading-relaxed">
                                                                    {order.returnAdminNote}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Fallback Email Option for non-delivered or general queries */}
                                {order.trackingStatus !== 'delivered' && (
                                    <div className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                                <RotateCcw size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900">Return or Replace</h3>
                                                <p className="text-xs text-gray-500 mt-1">Returns are available once the order is delivered.</p>
                                                <a
                                                    href={`mailto:returns@SheShrifashion.com?subject=Return/Exchange Request for Order #${order._id}&body=Hi Team,%0A%0AI would like to return/exchange items from my order #${order._id} because...`}
                                                    className="mt-3 text-xs font-bold text-blue-600 border border-blue-200 bg-white px-4 py-2 rounded-lg hover:bg-blue-50 transition w-full block text-center"
                                                >
                                                    Email Customer Support
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Refund Info Logic */}
                            {(order.trackingStatus === 'cancelled' || order.paymentResult?.status === 'refund_pending') && (
                                <div className="mt-6 p-4 rounded-xl bg-orange-50 border border-orange-100">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-orange-800">Refund Status</h3>
                                            <p className="text-xs text-orange-700 mt-1">
                                                {order.isPaid
                                                    ? "Refund has been initiated. It typically takes 5-7 business days."
                                                    : "Order was cancelled. No refund required as it was COD/Unpaid."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Tracking Information (Public View) */}
                        {order.trackingNumber && (
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Truck className="text-primary-600" /> Shipping & Tracking
                                </h2>
                                <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] text-primary-600 uppercase font-bold tracking-widest mb-1">Courier Partner</p>
                                            <p className="text-lg font-bold text-gray-900">{order.courierPartner || "Standard Shipping"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-primary-600 uppercase font-bold tracking-widest mb-1">Tracking Number</p>
                                            <p className="text-lg font-bold text-gray-900">{order.trackingNumber}</p>
                                        </div>
                                    </div>
                                    {order.trackingStatus && (
                                        <div className="mt-8 pt-6 border-t border-primary-100/50">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white rounded-full text-primary-600 shadow-sm">
                                                    <Info size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-primary-600 uppercase font-bold tracking-widest">Last Update</p>
                                                    <p className="text-gray-800 font-medium">Order status is currently <span className="text-primary-600 font-bold uppercase">{order.trackingStatus.replace('_', ' ')}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6">
                                    <Link to={`/track/${order._id}`} className="inline-flex items-center justify-center w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg text-sm uppercase tracking-widest gap-2">
                                        Track Live Updates <ChevronRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3 space-y-6 lg:sticky lg:top-28 h-fit">
                        {/* Payment Summary */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Payment Summary</h2>

                            {/* Calculation for Itemized Breakdown */}
                            {(() => {
                                const productBaseTotal = order.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
                                const preDrapeTotal = order.orderItems.reduce((acc, item) => acc + (item.sareeAddOns?.preDrape ? 1750 * item.qty : 0), 0);
                                const petticoatTotal = order.orderItems.reduce((acc, item) => acc + (item.sareeAddOns?.petticoat ? 1245 * item.qty : 0), 0);

                                return (
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-gray-600 items-center">
                                            <span className="text-sm font-medium">Product Subtotal ({order.orderItems.length} items)</span>
                                            <span className="font-bold text-gray-900">₹{productBaseTotal.toLocaleString()}</span>
                                        </div>

                                        {preDrapeTotal > 0 && (
                                            <div className="flex justify-between text-gray-600 items-center">
                                                <span className="text-sm font-medium">Pre-Drape Service</span>
                                                <span className="font-bold text-gray-900">₹{preDrapeTotal.toLocaleString()}</span>
                                            </div>
                                        )}

                                        {petticoatTotal > 0 && (
                                            <div className="flex justify-between text-gray-600 items-center">
                                                <span className="text-sm font-medium">Satin Petticoat Add-on</span>
                                                <span className="font-bold text-gray-900">₹{petticoatTotal.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-gray-600 items-center">
                                            <span className="text-sm font-medium">Shipping Fee</span>
                                            <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-1 rounded">Free</span>
                                        </div>
                                        {order.taxPrice > 0 && (
                                            <div className="flex justify-between text-gray-600 items-center">
                                                <span className="text-sm font-medium">GST / Tax</span>
                                                <span className="font-bold text-gray-900">₹{order.taxPrice?.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-gray-900 font-bold text-xl pt-6 border-t border-gray-100 items-center">
                                            <span className="font-serif">Order Total</span>
                                            <span className="text-primary-600">₹{order.totalPrice?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-primary-600">
                                        <Info size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Payment Method</p>
                                        <p className="text-sm font-bold text-gray-900 uppercase">{order.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin className="text-primary-600" size={22} /> Shipping Address
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Recipient Name</p>
                                    <p className="text-base font-bold text-gray-900">{order.shippingAddress?.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Contact Details</p>
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-700 font-medium flex items-center gap-3">
                                            <span className="p-1.5 bg-gray-50 rounded-lg text-gray-400 group-hover:text-primary-600"><Mail size={14} /></span>
                                            {order.user?.email}
                                        </p>
                                        <p className="text-sm text-gray-700 font-medium flex items-center gap-3">
                                            <span className="p-1.5 bg-gray-50 rounded-lg text-gray-400 group-hover:text-primary-600"><Phone size={14} /></span>
                                            {order.shippingAddress?.phone}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Delivery Address</p>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-sm leading-relaxed text-gray-700 font-medium">
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state && `${order.shippingAddress.state}, `}{order.shippingAddress.postalCode}<br />
                                            {order.shippingAddress.country}
                                        </p>
                                    </div>
                                </div>
                                {order.customization && (
                                    <div className="pt-6 border-t border-gray-100">
                                        <p className="text-[10px] text-amber-600 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                                            <CheckCircle size={14} /> Customization Note
                                        </p>
                                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <p className="text-sm text-amber-900 italic font-medium">
                                                "{order.customization}"
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderDetails;

