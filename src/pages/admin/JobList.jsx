import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../utils/api";
import { Plus, Search, Edit, Trash2, Briefcase, RefreshCw, Globe, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/jobs/admin");
            setJobs(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            toast.error("Failed to fetch jobs");
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    const openDeleteModal = (job) => {
        setJobToDelete(job);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!jobToDelete) return;

        try {
            await API.delete(`/jobs/${jobToDelete._id}`);
            toast.success("Job deleted successfully");
            fetchJobs();
        } catch (err) {
            console.error("Delete Error:", err);
            toast.error(err.response?.data?.message || "Failed to delete job");
        } finally {
            setShowDeleteModal(false);
            setJobToDelete(null);
        }
    };

    const createJobHandler = () => {
        navigate("/admin/job/create");
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Career Opportunities</h1>
                    <p className="text-gray-500">{filteredJobs.length} jobs found</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchJobs}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200"
                    >
                        <RefreshCw size={18} />
                        <span className="font-medium hidden sm:inline">Refresh</span>
                    </button>
                    <button
                        onClick={createJobHandler}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        <span className="font-semibold">Post New Job</span>
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title, location or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredJobs.map((job) => (
                        <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary-50 text-primary-600 text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest">
                                        {job.category}
                                    </span>
                                    {job.isActive ? (
                                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                            <CheckCircle size={12} /> Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                            <XCircle size={12} /> Inactive
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                                    <span className="flex items-center gap-1"><Globe size={14} /> {job.location}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    to={`/admin/job/${job._id}/edit`}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    title="Edit Job"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    onClick={() => openDeleteModal(job)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Delete Job"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredJobs.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                            <button onClick={createJobHandler} className="mt-4 text-primary-600 font-medium hover:underline">Create one now</button>
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && jobToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Job?</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                "{jobToDelete.title}" will be permanently removed.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobList;
