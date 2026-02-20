import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../utils/api";
import {
    Package, RefreshCw, CheckCircle, XCircle, AlertCircle, Eye, X
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const ReturnRequests = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionModal, setActionModal] = useState({ open: false, orderId: null, status: null, note: '' });
    const toast = useToast();

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/orders/returns/all");
            setOrders(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            toast.error("Failed to fetch return requests");
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const openActionModal = (orderId, status) => {
        setActionModal({ open: true, orderId, status, note: '' });
    };

    const handleConfirmAction = async () => {
        try {
            await API.put(`/orders/${actionModal.orderId}/return`, {
                status: actionModal.status,
                adminNote: actionModal.note
            });
            toast.success(`Return request ${actionModal.status.toLowerCase()}`);
            fetchReturns();
            setActionModal({ open: false, orderId: null, status: null, note: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update return status");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Return Requests</h1>
                    <p className="text-gray-500">{orders.length} active requests</p>
                </div>
                <button
                    onClick={fetchReturns}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200"
                >
                    <RefreshCw size={18} />
                    <span className="font-medium">Refresh</span>
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <Package className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending returns</h3>
                    <p className="text-gray-500">Good job! All return requests have been processed.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono font-medium">#{order._id.slice(-8)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{order.user?.name || "N/A"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.updatedAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 italic">
                                            "{order.returnReason || "No reason provided"}"
                                            {order.returnAdminNote && (
                                                <div className="mt-1 text-xs text-blue-600 not-italic">
                                                    <span className="font-semibold">Note:</span> {order.returnAdminNote}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                ${order.returnStatus === 'Requested' ? 'bg-orange-100 text-orange-700' :
                                                    order.returnStatus === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                        order.returnStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                                                            'bg-red-100 text-red-700'}`}>
                                                {order.returnStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link to={`/admin/order/${order._id}`} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                                    <Eye size={18} />
                                                </Link>
                                                {order.returnStatus === 'Requested' && (
                                                    <>
                                                        <button
                                                            onClick={() => openActionModal(order._id, 'Approved')}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-xs font-bold"
                                                        >
                                                            <CheckCircle size={14} /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => openActionModal(order._id, 'Rejected')}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-bold"
                                                        >
                                                            <XCircle size={14} /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                {order.returnStatus === 'Approved' && (
                                                    <button
                                                        onClick={() => openActionModal(order._id, 'Completed')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-bold"
                                                    >
                                                        <CheckCircle size={14} /> Mark Completed
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Admin Action Modal */}
            {actionModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                {actionModal.status === 'Approved' ? 'Approve Return' :
                                    actionModal.status === 'Rejected' ? 'Reject Return' :
                                        'Complete Return'}
                            </h2>
                            <button
                                onClick={() => setActionModal({ ...actionModal, open: false })}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-4">
                                You are about to <span className="font-bold lowercase">{actionModal.status}</span> this return request.
                                Would you like to add a note for the customer?
                            </p>
                            <textarea
                                value={actionModal.note}
                                onChange={(e) => setActionModal({ ...actionModal, note: e.target.value })}
                                placeholder="Add a note (optional)..."
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all text-sm"
                                rows="3"
                            />

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setActionModal({ ...actionModal, open: false })}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmAction}
                                    className={`flex-1 px-4 py-2 text-white rounded-xl font-medium transition-colors shadow-lg shadow-gray-200
                                        ${actionModal.status === 'Approved' ? 'bg-green-600 hover:bg-green-700' :
                                            actionModal.status === 'Rejected' ? 'bg-red-600 hover:bg-red-700' :
                                                'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    Confirm {actionModal.status}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnRequests;
