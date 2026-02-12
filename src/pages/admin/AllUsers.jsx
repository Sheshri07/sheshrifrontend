import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Calendar, Eye, RefreshCw, Trash2, Filter, Edit, Phone } from 'lucide-react';
import { getAllUsers, deleteUser } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const toast = useToast();
    const navigate = useNavigate();

    const fetchUsers = React.useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
            setFilteredUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        let result = users;

        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(user =>
                (user.name?.toLowerCase().includes(query)) ||
                (user.username?.toLowerCase().includes(query)) ||
                (user.email?.toLowerCase().includes(query))
            );
        }

        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(result);
    }, [searchTerm, roleFilter, users]);



    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await deleteUser(id);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="text-primary-600 animate-pulse" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Users</h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <Users size={16} /> {filteredUsers.length} total users in the system
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-primary-300 active:scale-95"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    <span className="font-semibold">Sync Data</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                <div className="lg:col-span-2 relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm outline-none"
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm outline-none appearance-none flex-1 font-medium text-gray-700"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Administrators</option>
                        <option value="user">Customers</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">User Profile</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Contact & Role</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Last Active</th>
                                <th className="px-8 py-5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/80 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner ${user.role === 'admin' ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200' : 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-200'
                                                    }`}>
                                                    {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{user.name || user.username || 'System User'}</p>
                                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">#{user._id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                    <Mail size={14} className="text-gray-300" />
                                                    {user.email}
                                                </div>
                                                {user.phoneNumber && (
                                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                        <Phone size={14} className="text-gray-300" />
                                                        {user.phoneNumber}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wide border border-green-100">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                                <Calendar size={14} className="text-gray-300" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigate(`/admin/users/${user._id}`)}
                                                    className="p-2.5 bg-white text-primary-600 border border-primary-100 rounded-xl hover:bg-primary-600 hover:text-white hover:shadow-lg hover:shadow-primary-100 transition-all active:scale-95"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                                                    className="p-2.5 bg-white text-amber-600 border border-amber-100 rounded-xl hover:bg-amber-500 hover:text-white hover:shadow-lg hover:shadow-amber-100 transition-all active:scale-95"
                                                    title="Edit User"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="p-2.5 bg-white text-red-500 border border-red-50 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-100 transition-all active:scale-95"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                                <Search size={32} className="text-gray-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
                                            <p className="text-gray-500 text-sm">
                                                We couldn't find any user matching "{searchTerm}". Try another search term or reset filters.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllUsers;
