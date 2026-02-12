import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../../utils/api";
import { ArrowLeft, Package, Truck, Clock, Info, Phone, Mail, User } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { updateOrderTracking } from "../../services/trackingService";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const toast = useToast();

    // Tracking form state
    const [trackingStatus, setTrackingStatus] = useState("pending");
    const [courierPartner, setCourierPartner] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [trackingMessage, setTrackingMessage] = useState("");
    const [location, setLocation] = useState("");

    const fetchOrder = React.useCallback(async () => {
        try {
            const { data } = await API.get(`/orders/${id}`);
            setOrder(data);
            setTrackingStatus(data.trackingStatus || "pending");
            setCourierPartner(data.courierPartner || "");
            setTrackingNumber(data.trackingNumber || "");
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleUpdateTracking = async (e) => {
        e.preventDefault();
        try {
            setUpdateLoading(true);
            await updateOrderTracking(id, {
                status: trackingStatus,
                courierPartner,
                trackingNumber,
                message: trackingMessage || `Order status updated to ${trackingStatus.replace('_', ' ')}`,
                location: location
            });
            toast.success("Tracking information updated successfully");
            setTrackingMessage("");
            setLocation("");
            fetchOrder();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update tracking");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error) return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl max-w-2xl mx-auto mt-12">
            <h2 className="text-xl font-bold mb-2">Error Loading Order</h2>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/admin/orderlist" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Orders
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Summary Header */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Order #{id.slice(-8)}</h1>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <Clock size={14} /> Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.trackingStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                    order.trackingStatus === 'cancelled' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {order.trackingStatus ? order.trackingStatus.replace('_', ' ') : 'Pending'}
                                </span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Package className="text-primary-600" /> Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg shadow-sm" />
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/product/${item.product}`} className="font-bold text-gray-900 hover:text-primary-600 transition truncate block">
                                                {item.name}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">Size: {item.size || "M"}</p>
                                            {item.stitchingDetails && (
                                                <div className="mt-2 p-3 bg-white rounded-xl border-2 border-primary-50 text-xs shadow-sm">
                                                    <p className="font-extrabold text-primary-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse"></span>
                                                        STITCHING REQUIREMENTS
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-gray-700">
                                                        <p><span className="font-bold text-gray-900">Type:</span> {item.stitchingDetails.option}</p>
                                                        {item.stitchingDetails.option === 'Stitched' && (
                                                            <>
                                                                <p><span className="font-bold text-gray-900">Custom Size:</span> {item.stitchingDetails.stitchingSize}</p>
                                                                <p><span className="font-bold text-gray-900">Padding:</span> {item.stitchingDetails.padding}</p>
                                                                <p className="col-span-2 bg-primary-50 p-2 rounded-lg"><span className="font-bold text-gray-900">Blouse Design:</span> {item.stitchingDetails.blouseDesign}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {item.sareeAddOns && (item.sareeAddOns.preDrape || item.sareeAddOns.petticoat) && (
                                                <div className="mt-2 p-3 bg-white rounded-xl border-2 border-primary-50 text-xs shadow-sm">
                                                    <p className="font-extrabold text-primary-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse"></span>
                                                        SAREE ADD-ONS
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-gray-700">
                                                        {item.sareeAddOns.preDrape && (
                                                            <p><span className="font-bold text-gray-900">Pre-Drape:</span> Yes (+₹1,750)</p>
                                                        )}
                                                        {item.sareeAddOns.petticoat && (
                                                            <p><span className="font-bold text-gray-900">Petticoat:</span> Yes (+₹1,245)</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-700 mt-2 font-medium">
                                                {item.qty} x ₹{item.price.toLocaleString()} = <span className="text-primary-600 font-bold">₹{(item.qty * item.price).toLocaleString()}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tracking Update Form */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Truck className="text-primary-600" /> Update Tracking
                            </h2>
                            <form onSubmit={handleUpdateTracking} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                        <select
                                            value={trackingStatus}
                                            onChange={(e) => setTrackingStatus(e.target.value)}
                                            className="w-full p-2.5 rounded-lg border-gray-200 text-sm focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="out_for_delivery">Out for Delivery</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Courier Partner</label>
                                        <input
                                            type="text"
                                            value={courierPartner}
                                            onChange={(e) => setCourierPartner(e.target.value)}
                                            placeholder="e.g. BlueDart, Delhivery"
                                            className="w-full p-2.5 rounded-lg border-gray-200 text-sm focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tracking Number</label>
                                        <input
                                            type="text"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            placeholder="Enter Tracking ID"
                                            className="w-full p-2.5 rounded-lg border-gray-200 text-sm focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Location</label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g. Mumbai Hub, Out for Delivery"
                                            className="w-full p-2.5 rounded-lg border-gray-200 text-sm focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tracking Message (Optional)</label>
                                    <textarea
                                        value={trackingMessage}
                                        onChange={(e) => setTrackingMessage(e.target.value)}
                                        rows="2"
                                        placeholder="Add a custom message for the customer..."
                                        className="w-full p-2.5 rounded-lg border-gray-200 text-sm focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className={`w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 ${updateLoading ? 'opacity-70' : ''}`}
                                >
                                    {updateLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : "Update Tracking Status"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3 space-y-6 lg:sticky lg:top-24 h-fit">
                        {/* Order Summary Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h2>

                            {(() => {
                                const productBaseTotal = order.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
                                const preDrapeTotal = order.orderItems.reduce((acc, item) => acc + (item.sareeAddOns?.preDrape ? 1750 * item.qty : 0), 0);
                                const petticoatTotal = order.orderItems.reduce((acc, item) => acc + (item.sareeAddOns?.petticoat ? 1245 * item.qty : 0), 0);

                                return (
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-gray-600">
                                            <span className="text-sm">Product Subtotal</span>
                                            <span className="font-medium">₹{productBaseTotal.toLocaleString()}</span>
                                        </div>

                                        {preDrapeTotal > 0 && (
                                            <div className="flex justify-between text-gray-600">
                                                <span className="text-sm">Pre-Drape Service</span>
                                                <span className="font-medium">₹{preDrapeTotal.toLocaleString()}</span>
                                            </div>
                                        )}

                                        {petticoatTotal > 0 && (
                                            <div className="flex justify-between text-gray-600">
                                                <span className="text-sm">Satin Petticoat</span>
                                                <span className="font-medium">₹{petticoatTotal.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-gray-600">
                                            <span className="text-sm">Shipping</span>
                                            <span className="text-green-600 font-bold uppercase text-[10px] tracking-wider">Free</span>
                                        </div>
                                        <div className="flex justify-between text-gray-900 font-bold text-lg pt-4 border-t border-gray-100">
                                            <span>Total</span>
                                            <span className="text-primary-600">₹{order.totalPrice?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Info size={18} className="text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Payment Method</p>
                                        <p className="text-xs font-bold text-gray-900">{order.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <User className="text-primary-600" /> Customer Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Name</p>
                                    <p className="text-sm font-semibold text-gray-900">{order.shippingAddress?.name || order.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Contact Info</p>
                                    <div className="space-y-2 mt-1">
                                        <a href={`mailto:${order.user?.email}`} className="text-xs text-primary-600 hover:underline flex items-center gap-2">
                                            <Mail size={14} /> {order.user?.email}
                                        </a>
                                        {(order.shippingAddress?.phone || order.user?.phone) && (
                                            <p className="text-xs text-gray-700 flex items-center gap-2">
                                                <Phone size={14} /> {order.shippingAddress?.phone || order.user?.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Shipping Address</p>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs leading-relaxed text-gray-700">
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state && `${order.shippingAddress.state}, `}{order.shippingAddress.postalCode}<br />
                                            {order.shippingAddress.country}
                                        </p>
                                    </div>
                                </div>
                                {order.customization && order.customization.trim() !== '' && (
                                    <div className="mt-4">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                                            Customization Request
                                        </p>
                                        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300 shadow-sm">
                                            <p className="text-sm leading-relaxed text-gray-800 font-medium">
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

export default OrderDetails;
