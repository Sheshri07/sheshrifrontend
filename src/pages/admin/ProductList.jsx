import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../utils/api";
import { Plus, Search, Edit, Trash2, Package, Filter, RefreshCw } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const navigate = useNavigate();
    const toast = useToast();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/products");
            setProducts(data);
            setFilteredProducts(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            toast.error("Failed to fetch products");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products;

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter !== "all") {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        setFilteredProducts(filtered);
    }, [searchTerm, categoryFilter, products]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Replaced window.confirm with Custom Modal to avoid browser blocking
    const openDeleteModal = (e, product) => {
        e.stopPropagation();
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await API.delete(`/products/${productToDelete._id || productToDelete.id}`);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (err) {
            console.error("Delete Error:", err);
            toast.error(err.response?.data?.message || "Failed to delete product");
        } finally {
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    const createProductHandler = () => {
        navigate("/admin/product/create");
    };

    const categories = ["all", ...new Set(products.map(p => p.category))];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="text-primary-600 animate-pulse" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Products</h1>
                    <p className="text-gray-500">{filteredProducts.length} products found</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchProducts}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-primary-300"
                    >
                        <RefreshCw size={18} />
                        <span className="font-medium hidden sm:inline">Refresh</span>
                    </button>
                    <button
                        onClick={createProductHandler}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        <span className="font-semibold">Create Product</span>
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === "all" ? "All Categories" : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id || product.id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                        >
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Package className="text-gray-400" size={48} />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${product.inStock && (product.countInStock > 0)
                                        ? 'bg-green-500 text-white border-green-600'
                                        : 'bg-red-500 text-white border-red-600'
                                        }`}>
                                        {product.inStock && (product.countInStock > 0) ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm border border-gray-100 italic">
                                        Qty: {product.countInStock || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="mb-3">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 leading-snug">{product.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500">{product.category}</p>
                                        {!product.inStock && product.countInStock > 0 && (
                                            <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Hidden Manually</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold text-primary-600">₹{product.price?.toLocaleString()}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        ID: {(product._id || product.id).slice(-6)}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        to={`/admin/product/${product._id || product.id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={(e) => openDeleteModal(e, product)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium border border-red-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredProducts.length === 0 && !loading && !error && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <Package className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                    <button
                        onClick={createProductHandler}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
                    >
                        <Plus size={20} />
                        Create Your First Product
                    </button>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Are you sure you want to delete <span className="font-bold text-gray-900">"{productToDelete.name}"</span>?
                                <br />This action cannot be undone.
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
                                    className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-200"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
