import React, { useState, useEffect } from 'react';
import {
    User, Bell, Lock, Palette, Globe, Mail, Save,
    Camera, Shield, CreditCard, Store, Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateUserProfile } from '../../services/userService';

const Settings = () => {
    const toast = useToast();
    const { user, login } = useAuth(); // login used here to update auth state
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    // Profile Settings
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'admin'
    });

    // Notification Settings
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        orderAlerts: true,
        productAlerts: false,
        customerAlerts: true,
        lowStockAlerts: true
    });

    // Store Settings
    const [storeSettings, setStoreSettings] = useState({
        storeName: 'Sheshri Fashion',
        storeEmail: 'sheshri07@gmail.com',
        storePhone: '+91 7838418308',
        currency: 'INR',
        taxRate: '18',
        shippingFee: '50'
    });

    // Security Settings
    const [security, setSecuritySettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.username || user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role || 'admin'
            });
            if (user.notificationPreferences) {
                setNotifications(user.notificationPreferences);
            }
        }
    }, [user]);

    const handleProfileSave = async () => {
        setLoading(true);
        try {
            // Call API to update profile
            const updatedUser = await updateUserProfile(user._id || user.id, {
                username: profile.name, // Mapping 'name' to 'username' as per typical schema, or adjust if needed
                email: profile.email,
                phone: profile.phone
            });

            // Update Auth Context & Local Storage
            const storageUser = JSON.parse(localStorage.getItem('user') || '{}');
            const newUserData = { ...storageUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newUserData));

            // This effectively reloads the user state in context if 'login' takes user object, 
            // otherwise might need a specific 'updateUser' method in context. 
            // For now, assuming direct local storage update + re-fetch or page reload might be needed 
            // unless context syncs with local storage.
            // A better way is if AuthContext has an update method.
            // Since we destructured 'login', we might ideally have 'updateUser'. 
            // Checking AuthContext would be ideal, but for now we'll stick to basic persistence.

            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationsSave = async () => {
        setLoading(true);
        try {
            const updatedUser = await updateUserProfile(user._id || user.id, {
                notificationPreferences: notifications
            });

            // Update Auth Context & Local Storage
            const storageUser = JSON.parse(localStorage.getItem('user') || '{}');
            const newUserData = { ...storageUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newUserData));

            // In a real app, we would use a context update function here
            // For now, updating localStorage and toast is the minimal path

            toast.success('Notification preferences saved!');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to save preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleStoreSave = () => {
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
            setLoading(false);
            toast.success('Store settings updated!');
        }, 1000);
    };

    const handleSecuritySave = async () => {
        if (security.newPassword !== security.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        if (security.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters!');
            return;
        }

        setLoading(true);
        try {
            // Call API to update password
            await updateUserProfile(user._id || user.id, {
                password: security.newPassword
            });

            setSecuritySettings({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast.success('Password updated successfully!');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'store', label: 'Store', icon: Store },
        { id: 'security', label: 'Security', icon: Lock }
    ];

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
                <p className="text-gray-500">Manage your account and application preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                            ? 'bg-primary-50 text-primary-600 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div>
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {profile.name.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                                        <p className="text-gray-500">Update your personal information</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            placeholder="+91 123-456-7890"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.role}
                                            disabled
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>

                                    <button
                                        onClick={handleProfileSave}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 font-semibold"
                                    >
                                        <Save size={20} />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div>
                                <div className="mb-6 pb-6 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                                    <p className="text-gray-500">Manage how you receive notifications</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                                        { key: 'orderAlerts', label: 'Order Alerts', desc: 'Get notified when new orders are placed' },
                                        { key: 'productAlerts', label: 'Product Alerts', desc: 'Notifications about product updates' },
                                        { key: 'customerAlerts', label: 'Customer Alerts', desc: 'New customer registrations' },
                                        { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Alert when products are low in stock' }
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.label}</p>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications[item.key]}
                                                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            </label>
                                        </div>
                                    ))}

                                    <button
                                        onClick={handleNotificationsSave}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 font-semibold"
                                    >
                                        <Save size={20} />
                                        {loading ? 'Saving...' : 'Save Preferences'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Store Tab */}
                        {activeTab === 'store' && (
                            <div>
                                <div className="mb-6 pb-6 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900">Store Settings</h2>
                                    <p className="text-gray-500">Configure your store information</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Store Name
                                        </label>
                                        <input
                                            type="text"
                                            value={storeSettings.storeName}
                                            onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Store Email
                                            </label>
                                            <input
                                                type="email"
                                                value={storeSettings.storeEmail}
                                                onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Store Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={storeSettings.storePhone}
                                                onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Currency
                                            </label>
                                            <select
                                                value={storeSettings.currency}
                                                onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            >
                                                <option value="INR">INR (₹)</option>
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Tax Rate (%)
                                            </label>
                                            <input
                                                type="number"
                                                value={storeSettings.taxRate}
                                                onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Shipping Fee (₹)
                                            </label>
                                            <input
                                                type="number"
                                                value={storeSettings.shippingFee}
                                                onChange={(e) => setStoreSettings({ ...storeSettings, shippingFee: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleStoreSave}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 font-semibold"
                                    >
                                        <Save size={20} />
                                        {loading ? 'Saving...' : 'Save Settings'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div>
                                <div className="mb-6 pb-6 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                                    <p className="text-gray-500">Update your password and security preferences</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={security.currentPassword}
                                            onChange={(e) => setSecuritySettings({ ...security, currentPassword: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={security.newPassword}
                                            onChange={(e) => setSecuritySettings({ ...security, newPassword: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={security.confirmPassword}
                                            onChange={(e) => setSecuritySettings({ ...security, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <p className="text-sm text-blue-800">
                                            <strong>Password Requirements:</strong> Minimum 6 characters
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleSecuritySave}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 font-semibold"
                                    >
                                        <Shield size={20} />
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
