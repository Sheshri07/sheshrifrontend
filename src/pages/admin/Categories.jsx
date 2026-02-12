import React, { useEffect, useState } from "react";
import { API } from "../../utils/api";
import { Plus, Trash2, Image as ImageIcon, Upload, Edit2, X, Maximize2 } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    // Form states
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error("Failed to fetch categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Category name is required");

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("name", name);
            if (image) formData.append("image", image);

            if (editingId) {
                await updateCategory(editingId, formData);
                toast.success("Category updated successfully");
            } else {
                await createCategory(formData);
                toast.success("Category created successfully");
            }

            setName("");
            setImage(null);
            setEditingId(null);
            setCurrentImage(null);
            fetchCategories();

            // Reset file input
            const fileInput = document.getElementById('category-image-input');
            if (fileInput) fileInput.value = "";

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || (editingId ? "Failed to update category" : "Failed to create category"));
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setName(category.name);
        setCurrentImage(category.image);
        // Scroll to top to see the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setName("");
        setImage(null);
        setCurrentImage(null);
        const fileInput = document.getElementById('category-image-input');
        if (fileInput) fileInput.value = "";
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategory(id);
            toast.success("Category deleted");
            fetchCategories();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete category");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Categories</h1>

            {/* Form Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Upload size={20} /> {editingId ? "Update Category" : "Add New Category"}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-[2] w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input
                            type="text"
                            placeholder="Enter category name (e.g., Saree, Suit)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>
                    <div className="flex-[2] w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Image {editingId && "(Optional)"}
                        </label>
                        {editingId && currentImage && !image && (
                            <div
                                className="mb-2 h-16 w-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer group/prev relative"
                                onClick={() => setSelectedImage(currentImage)}
                            >
                                <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/prev:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 size={14} className="text-white" />
                                </div>
                            </div>
                        )}
                        <input
                            id="category-image-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                    </div>
                    <div className="flex-1 flex gap-2">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 font-medium whitespace-nowrap"
                        >
                            {uploading ? "Processing..." : editingId ? "Update" : <><Plus size={18} /> Add</>}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Categories List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {categories.map((category) => (
                        <div key={category._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="relative aspect-square bg-gray-100">
                                {category.image ? (
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="p-2 bg-white text-primary-600 rounded-full hover:bg-primary-50 transition-colors"
                                        title="Edit Category"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                        title="Delete Category"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    {category.image && (
                                        <button
                                            onClick={() => setSelectedImage(category.image)}
                                            className="p-2 bg-white text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                                            title="View Image"
                                        >
                                            <Maximize2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-50">
                                <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">Slug: {category.slug}</p>
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                            <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
                            <p>No categories found. Add one to get started.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Image Full-Size Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4 md:p-10 transition-all animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-10"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={28} />
                    </button>
                    <div
                        className="max-w-full max-h-full flex items-center justify-center overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="Full Preview"
                            className="max-w-full max-h-screen object-contain shadow-2xl rounded-lg animate-in zoom-in duration-300"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
