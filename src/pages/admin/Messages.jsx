import React, { useState, useEffect } from "react";
import { API } from "../../utils/api";
import { Mail, Trash2, Calendar, User, MessageSquare, CheckCircle, Clock, Phone } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const fetchMessages = async () => {
        try {
            const response = await API.get("/messages");
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await API.delete(`/messages/${id}`);
            toast.success("Message deleted");
            setMessages(messages.filter((m) => m._id !== id));
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.put(`/messages/${id}/read`);
            setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customer Inquiries</h1>
                    <p className="text-gray-500 text-sm">Manage messages received from the Contact page</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-sm font-semibold text-gray-700">Total: {messages.length}</span>
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-500">Customer inquiries will appear here when they contact you.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-md ${msg.isRead ? 'border-gray-100 opacity-80' : 'border-primary-100 shadow-sm ring-1 ring-primary-50'}`}
                            onClick={() => !msg.isRead && markAsRead(msg._id)}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.isRead ? 'bg-gray-100 text-gray-500' : 'bg-primary-50 text-primary-600 font-bold'}`}>
                                                {msg.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{msg.name}</h3>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Mail size={12} /> {msg.email}
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <Phone size={12} /> {msg.mobile}
                                                </p>
                                            </div>
                                        </div>
                                        {!msg.isRead && (
                                            <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 mb-1">{msg.subject}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 font-medium italic">
                                            "{msg.message}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(msg.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex md:flex-col justify-end gap-2 md:border-l md:pl-4 border-gray-100">
                                    <button
                                        onClick={() => handleDelete(msg._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    {msg.isRead ? (
                                        <div className="p-2 text-green-500" title="Read">
                                            <CheckCircle size={20} />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => markAsRead(msg._id)}
                                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                            title="Mark as Read"
                                        >
                                            <Clock size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Messages;
