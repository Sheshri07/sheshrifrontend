import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API } from "../../utils/api";
import { ArrowLeft, Save, Briefcase, MapPin, Globe, Loader2 } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const JobEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        type: "Full-time",
        location: "",
        category: "",
        link: "",
        isActive: true,
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchJob = async () => {
                try {
                    setLoading(true);
                    const { data } = await API.get(`/jobs/${id}`);
                    setFormData({
                        title: data.title,
                        type: data.type,
                        location: data.location,
                        category: data.category,
                        link: data.link || "",
                        isActive: data.isActive,
                    });
                    setLoading(false);
                } catch (err) {
                    toast.error("Failed to fetch job details");
                    navigate("/admin/jobs");
                }
            };
            fetchJob();
        }
    }, [id, isEditMode, navigate, toast]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await API.put(`/jobs/${id}`, formData);
                toast.success("Job updated successfully");
            } else {
                await API.post("/jobs", formData);
                toast.success("Job posted successfully");
            }
            navigate("/admin/jobs");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/jobs"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">
                        {isEditMode ? "Edit Job Posting" : "Create New Job"}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/jobs"
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Title */}
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Job Titlte
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Senior Fashion Designer"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Department / Category
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Design, Marketing"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Employment Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all appearance-none"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Mumbai, Remote"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Application Link */}
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Application Link or Email (mailto:)
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="link"
                                        value={formData.link}
                                        onChange={handleChange}
                                        placeholder="https://... or mailto:hr@example.com"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Leave empty to use default HR email.</p>
                            </div>

                            {/* Status */}
                            <div className="col-span-2">
                                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                                    />
                                    <span className="font-medium text-gray-900">Active (Visible on Careers Page)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobEdit;
