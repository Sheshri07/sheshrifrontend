import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderTracking } from '../services/trackingService';
import { Package, CheckCircle, Truck, MapPin, Calendar, ArrowLeft, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const OrderTracking = () => {
    const { orderId } = useParams();
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchTracking();
    }, [orderId]);

    const fetchTracking = async () => {
        try {
            const data = await getOrderTracking(orderId);
            setTracking(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tracking:', error);
            toast.error('Failed to load tracking information');
            setLoading(false);
        }
    };

    const statusSteps = [
        { key: 'pending', label: 'Order Placed', icon: Package, color: 'blue' },
        { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'green' },
        { key: 'processing', label: 'Processing', icon: Package, color: 'yellow' },
        { key: 'shipped', label: 'Shipped', icon: Truck, color: 'purple' },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, color: 'orange' },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'green' }
    ];

    const getCurrentStepIndex = () => {
        if (!tracking) return 0;
        return statusSteps.findIndex(s => s.key === tracking.trackingStatus);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="text-primary-600 animate-pulse" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    if (!tracking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Package size={64} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-500 mb-4">We couldn't find tracking information for this order.</p>
                    <Link to="/orders" className="text-primary-600 hover:text-primary-700 font-medium">
                        View All Orders
                    </Link>
                </div>
            </div>
        );
    }

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <Link
                    to="/orders"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Orders</span>
                </Link>

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>

                    {/* Order Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Order ID</p>
                            <p className="font-semibold text-gray-900">#{orderId.slice(-8)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                            <p className="font-semibold text-gray-900">{tracking.trackingNumber || 'Not assigned yet'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Courier Partner</p>
                            <p className="font-semibold text-gray-900">{tracking.courierPartner || 'TBD'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Estimated Delivery</p>
                            <p className="font-semibold text-gray-900">
                                {tracking.estimatedDelivery
                                    ? new Date(tracking.estimatedDelivery).toLocaleDateString()
                                    : 'TBD'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Timeline */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Progress</h2>

                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" style={{ height: `${(statusSteps.length - 1) * 80}px` }} />
                        <div
                            className="absolute left-5 top-0 w-0.5 bg-gradient-to-b from-green-500 to-green-600 transition-all duration-500"
                            style={{ height: `${currentStepIndex * 80}px` }}
                        />

                        {statusSteps.map((step, index) => {
                            const Icon = step.icon;
                            const isCompleted = currentStepIndex >= index;
                            const isCurrent = currentStepIndex === index;

                            return (
                                <div key={step.key} className="flex items-center mb-8 last:mb-0 relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${isCompleted
                                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-400'
                                        } ${isCurrent ? 'ring-4 ring-green-200 scale-110' : ''}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="ml-6">
                                        <p className={`font-semibold transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                            {step.label}
                                        </p>
                                        {isCurrent && (
                                            <p className="text-sm text-green-600 font-medium mt-1">Current Status</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tracking History */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock size={24} className="text-primary-600" />
                        Tracking History
                    </h2>

                    {tracking.trackingHistory && tracking.trackingHistory.length > 0 ? (
                        <div className="space-y-4">
                            {[...tracking.trackingHistory].reverse().map((event, index) => (
                                <div key={index} className="border-l-4 border-primary-500 pl-4 pb-4 last:pb-0">
                                    <div className="flex items-start gap-3 mb-2">
                                        <MapPin size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{event.message}</p>
                                            {event.location && (
                                                <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 ml-7">
                                        <Calendar size={14} />
                                        {new Date(event.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No tracking history available yet</p>
                    )}
                </div>

                {/* Customization Request */}
                {tracking.customization && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100 bg-amber-50/20">
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-2">My Customization Request</p>
                        <p className="text-gray-700 italic font-medium leading-relaxed">
                            "{tracking.customization}"
                        </p>
                    </div>
                )}

                {/* Order Items */}
                {tracking.orderItems && tracking.orderItems.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
                        <div className="space-y-3">
                            {tracking.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-600">Qty: {item.qty} | Size: {item.size}</p>
                                        {item.stitchingDetails && (
                                            <div className="mt-2 p-2 bg-white rounded-lg border border-gray-100 text-[10px]">
                                                <p className="font-bold text-primary-600 uppercase tracking-tighter mb-1">Stitching Configuration</p>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-gray-500">
                                                    <p><span className="font-semibold">Option:</span> {item.stitchingDetails.option}</p>
                                                    {item.stitchingDetails.option === 'Stitched' && (
                                                        <>
                                                            <p><span className="font-semibold">Fit Size:</span> {item.stitchingDetails.stitchingSize}</p>
                                                            <p><span className="font-semibold">Padding:</span> {item.stitchingDetails.padding}</p>
                                                            <p className="col-span-2"><span className="font-semibold">Blouse Design:</span> {item.stitchingDetails.blouseDesign}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {item.sareeAddOns && (item.sareeAddOns.preDrape || item.sareeAddOns.petticoat) && (
                                            <div className="mt-2 p-2 bg-white rounded-lg border border-gray-100 text-[10px]">
                                                <p className="font-bold text-primary-600 uppercase tracking-tighter mb-1">Saree Add-ons</p>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-gray-500">
                                                    {item.sareeAddOns.preDrape && (
                                                        <p><span className="font-semibold">Pre-Drape:</span> Yes</p>
                                                    )}
                                                    {item.sareeAddOns.petticoat && (
                                                        <p><span className="font-semibold">Petticoat:</span> Yes</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-bold text-gray-900">₹{item.price}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-bold text-gray-900">Total Amount</p>
                                <p className="text-2xl font-bold text-primary-600">₹{tracking.totalPrice}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
