import React, { useEffect, useState } from "react";
import { API } from "../../utils/api";
import { Plus, Trash2, Image as ImageIcon, Upload, Edit2, X, Maximize2 } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { getCategories } from "../../services/categoryService";

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    // Form states
    const [image, setImage] = useState(null);
    const [mobileImage, setMobileImage] = useState(null);
    const [link, setLink] = useState("");
    const [alt, setAlt] = useState("");
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentMobileImage, setCurrentMobileImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/banners");
            setBanners(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error("Failed to fetch banners");
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await API.get("/products");
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBanners();
        fetchProducts();
        fetchCategories();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            setUploading(true);
            const formData = new FormData();
            if (image) formData.append("image", image);
            if (mobileImage) formData.append("mobileImage", mobileImage);
            formData.append("link", link);
            formData.append("alt", alt);

            if (editingId) {
                await API.put(`/banners/${editingId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Banner updated successfully");
            } else {
                if (!image || !mobileImage) {
                    setUploading(false);
                    return toast.error("Please select both Desktop and Mobile images");
                }

                await API.post("/banners", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Banner uploaded successfully");
            }

            setImage(null);
            setMobileImage(null);
            setLink("");
            setAlt("");
            setEditingId(null);
            setCurrentImage(null);
            setCurrentMobileImage(null);
            fetchBanners();
        } catch (err) {
            console.error(err);
            toast.error(editingId ? "Failed to update banner" : "Failed to upload banner");
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (banner) => {
        setEditingId(banner._id);
        setLink(banner.link || "");
        setAlt(banner.alt || "");
        setCurrentImage(banner.image);
        setCurrentMobileImage(banner.mobileImage);
        // Scroll to top to see the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setLink("");
        setAlt("");
        setImage(null);
        setMobileImage(null);
        setCurrentImage(null);
        setCurrentMobileImage(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            await API.delete(`/banners/${id}`);
            toast.success("Banner deleted");
            fetchBanners();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete banner");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Banners</h1>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Upload size={20} /> {editingId ? "Update Banner" : "Upload New Banner"}
                </h2>
                <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Desktop Image {editingId && "(Optional)"}
                        </label>
                        {editingId && currentImage && !image && (
                            <div
                                className="mb-2 h-20 w-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer group/prev relative"
                                onClick={() => setSelectedImage(currentImage)}
                            >
                                <img src={currentImage} alt="Current Desktop" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/prev:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 size={16} className="text-white" />
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Image {editingId && "(Optional)"}
                        </label>
                        {editingId && currentMobileImage && !mobileImage && (
                            <div
                                className="mb-2 h-20 w-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer group/prev relative"
                                onClick={() => setSelectedImage(currentMobileImage)}
                            >
                                <img src={currentMobileImage} alt="Current Mobile" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/prev:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 size={16} className="text-white" />
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setMobileImage(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link to Product</label>
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    setLink(`/product/${e.target.value}`);
                                } else {
                                    setLink("");
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 mb-2"
                            value={link.includes('/product/') ? link.split('/product/')[1] : ""}
                        >
                            <option value="">Select a product...</option>
                            {products.map(product => (
                                <option key={product._id} value={product._id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link to Category</label>
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    setLink(`/products?category=${e.target.value}`);
                                } else {
                                    setLink("");
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            value={link.includes('category=') ? link.split('category=')[1] : ""}
                        >
                            <option value="">Select a category...</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text (Optional)</label>
                        <input
                            type="text"
                            placeholder="Banner description"
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium whitespace-nowrap"
                        >
                            {uploading ? "Processing..." : editingId ? "Update" : <><Plus size={18} /> Add Banner</>}
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

            {/* Banners List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div key={banner._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="relative h-48 bg-gray-100 flex">
                                {/* Desktop Preview */}
                                <div
                                    className={`${banner.mobileImage ? 'w-1/2' : 'w-full'} relative border-r border-gray-200 cursor-pointer group/item`}
                                    onClick={() => setSelectedImage(banner.image)}
                                >
                                    <img
                                        src={banner.image}
                                        alt={`${banner.alt || "Banner"} - Desktop`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                                    />
                                    <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider">Desktop</span>
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                        <Maximize2 size={24} className="text-white shadow-sm" />
                                    </div>
                                </div>
                                {/* Mobile Preview */}
                                {banner.mobileImage && (
                                    <div
                                        className="w-1/2 relative cursor-pointer group/item"
                                        onClick={() => setSelectedImage(banner.mobileImage)}
                                    >
                                        <img
                                            src={banner.mobileImage}
                                            alt={`${banner.alt || "Banner"} - Mobile`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                                        />
                                        <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider">Mobile</span>
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                            <Maximize2 size={24} className="text-white shadow-sm" />
                                        </div>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                                    <button
                                        onClick={() => handleEdit(banner)}
                                        className="p-2 bg-white text-primary-600 rounded-full hover:bg-primary-50 transition-colors"
                                        title="Edit Banner"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner._id)}
                                        className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                        title="Delete Banner"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    Link: <span className="text-gray-500 font-normal">{banner.link || "No link"}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Alt: {banner.alt || "-"}
                                </p>
                            </div>
                        </div>
                    ))}
                    {banners.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                            <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
                            <p>No banners active. Upload one to get started.</p>
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

export default Banners;
