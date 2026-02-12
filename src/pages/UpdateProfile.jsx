import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Phone, ChevronLeft, Save, Loader2 } from 'lucide-react';
import axios from 'axios';

const UpdateProfile = () => {
    const { user, updateUser } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        phoneNumber: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || ''
            });
        }
    }, [user]);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear errors when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation before submission
        let formErrors = {};
        if (!validateEmail(formData.email)) {
            formErrors.email = 'Please enter a valid email address';
        }
        if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
            formErrors.phoneNumber = 'Please enter a valid 10-digit mobile number';
        }

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_API_URL || ''}/api/users/${user._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                updateUser(response.data);
                toast.success('Profile updated successfully!');
                navigate('/my-profile');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-24 pt-20 md:pt-28">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/my-profile')}
                        className="p-2 rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Update Profile</h1>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                    className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-gray-900`}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                        </div>

                        {/* Mobile */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Mobile Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Enter your 10-digit mobile number"
                                    className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.phoneNumber ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-gray-900`}
                                />
                            </div>
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phoneNumber}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-primary-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 transition-all active:scale-[0.98] mt-8 shadow-lg shadow-primary-500/20 disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-gray-400 mt-8">
                    Your information is secure and encrypted.
                </p>
            </div>
        </div>
    );
};

export default UpdateProfile;
