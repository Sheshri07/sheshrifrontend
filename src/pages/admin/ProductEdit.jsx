import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { API } from "../../utils/api";
import { getCategories } from "../../services/categoryService";
import { getProductSubcategories } from "../../services/productService";
import {
    Search, DollarSign, Tag, FileText, Ruler, Package, Plus, ShoppingBag,
    Upload, X, Video, ArrowLeft, Save, Image as ImageIcon
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const SearchableInput = ({ label, value, onChange, options, placeholder, required = false, icon: Icon, strict = false }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    // Sync with external value changes (e.g. data fetching)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const exactMatch = options.find(opt => opt?.toLowerCase() === localValue.toLowerCase());
    const filteredOptions = options.filter(opt =>
        opt?.toLowerCase().includes(localValue.toLowerCase()) && opt?.toLowerCase() !== localValue.toLowerCase()
    );

    const handleBlur = () => {
        // Small delay to allow clicking dropdown items
        setTimeout(() => {
            setShowDropdown(false);
            if (strict && localValue && !options.find(opt => opt?.toLowerCase() === localValue.toLowerCase())) {
                setLocalValue("");
                onChange("");
            }
        }, 200);
    };

    return (
        <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2 text-shadow-sm">
                {Icon && <Icon size={16} className="text-primary-500" />}
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative group">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={localValue}
                    onChange={(e) => {
                        const val = e.target.value;
                        setLocalValue(val);
                        onChange(val);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm bg-white/50 backdrop-blur-sm group-hover:bg-white"
                    required={required}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <Search size={18} />
                </div>
            </div>

            {showDropdown && (localValue || filteredOptions.length > 0) && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden scrollbar-thin animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Current / New Entry - Only show if NOT strict */}
                    {!strict && localValue && !exactMatch && (
                        <div className="p-2 bg-primary-50/50">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-primary-400 px-2 mb-1">New Entry</div>
                            <button
                                type="button"
                                className="w-full text-left px-3 py-2 rounded-lg bg-white border border-primary-100 text-sm text-primary-700 font-medium flex items-center gap-2 shadow-sm"
                                onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent blur
                                    setShowDropdown(false);
                                }}
                            >
                                <Plus size={14} /> {localValue}
                            </button>
                        </div>
                    )}

                    {filteredOptions.length > 0 ? (
                        <>
                            <div className="p-2 bg-gray-50/50 text-[10px] uppercase tracking-wider font-bold text-gray-400 border-b border-gray-50 mt-1">
                                Existing Options
                            </div>
                            {filteredOptions.map((opt, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent blur
                                        setLocalValue(opt);
                                        onChange(opt);
                                        setShowDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-primary-50 text-sm text-gray-700 transition-colors border-b border-gray-50 last:border-0 flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-300"></span>
                                    {opt}
                                </button>
                            ))}
                        </>
                    ) : (strict && localValue && !exactMatch) && (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No matching categories found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const isEditMode = id && id !== "create";

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState([]);
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [description, setDescription] = useState("");
    const [sizes, setSizes] = useState([]);
    const [originalPrice, setOriginalPrice] = useState(0);
    const [countInStock, setCountInStock] = useState(0);
    const [inStock, setInStock] = useState(true);
    const [addOnItems, setAddOnItems] = useState([]);
    // New Specification Fields
    const [styleNo, setStyleNo] = useState("");
    const [designNo, setDesignNo] = useState("");
    const [color, setColor] = useState("");
    const [fabric, setFabric] = useState("");
    const [work, setWork] = useState("");
    const [packContains, setPackContains] = useState("");
    const [manufacturedBy, setManufacturedBy] = useState("");
    const [productSpeciality, setProductSpeciality] = useState("");
    const [styleTips, setStyleTips] = useState("");
    const [fitTips, setFitTips] = useState("");

    const [existingCategories, setExistingCategories] = useState([]);
    const [existingSubcategories, setExistingSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCategories().then(cats => {
            setExistingCategories(cats.map(c => c.name).sort());
        }).catch(err => console.error(err));

        getProductSubcategories()
            .then(subs => setExistingSubcategories(subs.sort()))
            .catch(err => console.error(err));

        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const { data } = await API.get(`/products/${id}`);
                    setName(data.name);
                    setPrice(data.price);
                    const existingImages = data.images || (data.image ? [data.image] : []);
                    setImages(existingImages);
                    setVideo(data.video || []);
                    setCategory(data.category);
                    setSubcategory(data.subcategory || "");
                    setSizes(data.sizes || []);
                    setDescription(data.description);
                    setOriginalPrice(data.originalPrice || 0);
                    setCountInStock(data.countInStock || 0);
                    setInStock(data.inStock !== undefined ? data.inStock : true);
                    setAddOnItems(data.addOnItems || []);
                    // Populate new fields
                    setStyleNo(data.styleNo || "");
                    setDesignNo(data.designNo || "");
                    setColor(data.color || "");
                    setFabric(data.fabric || "");
                    setWork(data.work || "");
                    setPackContains(data.packContains || "");
                    setManufacturedBy(data.manufacturedBy || "");
                    setProductSpeciality(data.productSpeciality || "");
                    setStyleTips(data.styleTips || "");
                    setFitTips(data.fitTips || "");
                } catch (err) {
                    setError(err.message);
                    toast.error("Failed to load product");
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prev) => [...prev, ...files]);
    };

    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files);
        setVideo((prev) => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeVideo = (index) => {
        setVideo((prev) => prev.filter((_, i) => i !== index));
    };

    const getPreview = (item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        return URL.createObjectURL(item);
    };

    useEffect(() => {
        return () => {
            images.forEach(img => {
                if (typeof img !== "string") URL.revokeObjectURL(img);
            });
            video.forEach(v => {
                if (typeof v !== "string") URL.revokeObjectURL(v);
            });
        };
    }, [images, video]);

    const addAddOnItem = () => {
        if (addOnItems.length >= 6) {
            toast.error("Maximum 6 add-on items allowed");
            return;
        }
        // Initialize with images array
        setAddOnItems([...addOnItems, { name: "", price: 0, description: "", images: [], inStock: true }]);
    };

    const removeAddOnItem = (index) => {
        setAddOnItems(addOnItems.filter((_, i) => i !== index));
    };

    const updateAddOnItem = (index, field, value) => {
        const updated = [...addOnItems];
        updated[index][field] = value;
        setAddOnItems(updated);
    };

    const handleAddOnImageChange = (index, e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const updated = [...addOnItems];
            const currentItem = updated[index];

            // Initialize arrays if they don't exist
            if (!currentItem.imageFiles) currentItem.imageFiles = [];
            if (!currentItem.previewUrls) currentItem.previewUrls = [];

            files.forEach(file => {
                currentItem.imageFiles.push(file);
                currentItem.previewUrls.push(URL.createObjectURL(file));
            });

            setAddOnItems(updated);
        }
    };

    const removeAddOnImage = (itemIndex, imageIndex, isPreview) => {
        const updated = [...addOnItems];
        const item = updated[itemIndex];

        if (isPreview) {
            // Remove from new uploads
            item.imageFiles = item.imageFiles.filter((_, i) => i !== imageIndex);
            URL.revokeObjectURL(item.previewUrls[imageIndex]); // Cleanup
            item.previewUrls = item.previewUrls.filter((_, i) => i !== imageIndex);
        } else {
            // Remove from existing images (URL strings)
            // Handle both legacy 'image' and new 'images'
            if (item.images && Array.isArray(item.images)) {
                item.images = item.images.filter((_, i) => i !== imageIndex);
            } else if (item.image) {
                item.image = ""; // Clear legacy single image
            }
        }
        setAddOnItems(updated);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("subcategory", subcategory);
            formData.append("description", description);
            formData.append("originalPrice", originalPrice);
            formData.append("countInStock", countInStock);
            formData.append("inStock", inStock);

            // Append new specification fields
            formData.append("styleNo", styleNo);
            formData.append("designNo", designNo);
            formData.append("color", color);
            formData.append("fabric", fabric);
            formData.append("work", work);
            formData.append("packContains", packContains);
            formData.append("manufacturedBy", manufacturedBy);
            formData.append("productSpeciality", productSpeciality);
            formData.append("styleTips", styleTips);
            formData.append("fitTips", fitTips);

            // Prepare addOnItems for JSON stringify (exclude file objects)
            const addOnsToSend = addOnItems.map(item => ({
                name: item.name,
                price: item.price,
                description: item.description,
                // Send existing image URLs. 
                // Migration: If item has 'image' (legacy), put it in 'images' array if not already there.
                images: item.images ? item.images : (item.image ? [item.image] : []),
                inStock: item.inStock,
                countInStock: item.countInStock || 0
            }));
            formData.append("addOnItems", JSON.stringify(addOnsToSend));

            // Append Add-on Images
            addOnItems.forEach((item, index) => {
                if (item.imageFiles && item.imageFiles.length > 0) {
                    item.imageFiles.forEach(file => {
                        formData.append(`addOnItemImages-${index}`, file);
                    });
                }
            });

            sizes.forEach(size => formData.append("sizes", size));

            images.forEach((image) => {
                formData.append("images", image);
            });

            video.forEach((v) => {
                formData.append("video", v);
            });

            if (isEditMode) {
                await API.put(`/products/${id}`, formData);
                toast.success("Product updated successfully!");
            } else {
                await API.post("/products", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Product created successfully!");
            }
            navigate("/admin/productlist");
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || "Failed to save product");
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <Link
                    to="/admin/productlist"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Products</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditMode ? "Edit Product" : "Create New Product"}
                </h1>
                <p className="text-gray-500 mt-1">
                    {isEditMode ? "Update product information" : "Add a new product to your store"}
                </p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                    {error}
                </div>
            )}

            <form onSubmit={submitHandler} className="max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Package size={20} className="text-primary-600" />
                                Basic Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter product name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <DollarSign size={16} />
                                            Sale Price *
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-bold text-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Original Price (MRP)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={originalPrice}
                                            onChange={(e) => setOriginalPrice(Number(e.target.value))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Discount (%)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                readOnly
                                                value={price > 0 && originalPrice > price ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}%` : "0%"}
                                                className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-emerald-600 font-black text-lg cursor-not-allowed outline-none"
                                            />
                                            {price > 0 && originalPrice > price && (
                                                <div className="absolute inset-0 rounded-xl border-2 border-emerald-500/20 animate-pulse pointer-events-none"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <SearchableInput
                                        label="Category"
                                        value={category}
                                        onChange={setCategory}
                                        options={Array.from(new Set([...existingCategories, "Kurti", "Western Dress", "Suit", "Saree", "Dupatta"]))}
                                        placeholder="Select or type category"
                                        required
                                        icon={Tag}
                                        strict={true}
                                    />
                                </div>

                                <div>
                                    <SearchableInput
                                        label="Sub Category"
                                        value={subcategory}
                                        onChange={setSubcategory}
                                        options={existingSubcategories}
                                        placeholder="Select or type sub category"
                                        icon={Tag}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Package size={16} />
                                            Stock Quantity
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={countInStock}
                                            onChange={(e) => {
                                                const qty = parseInt(e.target.value) || 0;
                                                setCountInStock(qty);
                                                // Dynamic update: If adding stock, auto-set to In Stock. If 0, auto-set to Out of Stock.
                                                if (qty > 0) setInStock(true);
                                                else setInStock(false);
                                            }}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Manual Stock Status
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setInStock(!inStock)}
                                            className={`w-full py-3 rounded-xl font-semibold transition-all ${inStock
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : "bg-red-100 text-red-700 border border-red-200"
                                                }`}
                                        >
                                            {inStock ? "Currently In Stock" : "Currently Out of Stock"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Ruler size={16} />
                                        Available Sizes
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map((size) => {
                                            const isSelected = sizes.includes(size);
                                            return (
                                                <label
                                                    key={size}
                                                    className={`cursor-pointer flex items-center justify-center px-5 py-2 rounded-xl border-2 transition-all font-bold text-sm ${isSelected
                                                        ? "bg-primary-600 border-primary-600 text-white shadow-md scale-105"
                                                        : "bg-white border-gray-200 text-gray-500 hover:border-primary-300"
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            if (isSelected) {
                                                                setSizes(sizes.filter(s => s !== size));
                                                            } else {
                                                                setSizes([...sizes, size]);
                                                            }
                                                        }}
                                                    />
                                                    {size}
                                                </label>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">Select all sizes that apply for this product</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <FileText size={16} />
                                        Description *
                                    </label>
                                    <textarea
                                        placeholder="Enter product description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-32 resize-none"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Style No
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Style No"
                                            value={styleNo}
                                            onChange={(e) => setStyleNo(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Design No
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Design No"
                                            value={designNo}
                                            onChange={(e) => setDesignNo(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Color
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Fabric
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Fabric"
                                            value={fabric}
                                            onChange={(e) => setFabric(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Work
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Work"
                                            value={work}
                                            onChange={(e) => setWork(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Pack Contains
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Pack Contains info"
                                            value={packContains}
                                            onChange={(e) => setPackContains(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Manufactured / Packed by
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter manufacturer info"
                                        value={manufacturedBy}
                                        onChange={(e) => setManufacturedBy(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Speciality
                                    </label>
                                    <textarea
                                        placeholder="Enter product speciality"
                                        value={productSpeciality}
                                        onChange={(e) => setProductSpeciality(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-24 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Style Tips
                                        </label>
                                        <textarea
                                            placeholder="Enter style tips"
                                            value={styleTips}
                                            onChange={(e) => setStyleTips(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-24 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Fit Tips
                                        </label>
                                        <textarea
                                            placeholder="Enter fit tips"
                                            value={fitTips}
                                            onChange={(e) => setFitTips(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-24 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media Upload */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ImageIcon size={20} className="text-primary-600" />
                                Product Media
                            </h2>

                            {/* Images */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Product Images
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 hover:bg-primary-50/50 transition-all cursor-pointer relative group">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                    <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-primary-600 transition-colors">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center mb-3 transition-colors">
                                            <Upload className="h-8 w-8" />
                                        </div>
                                        <span className="text-sm font-medium">Click to upload images</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                                    </div>
                                </div>

                                {images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                        {images.map((item, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={getPreview(item)}
                                                    alt={`Preview ${index}`}
                                                    className="h-24 w-full object-cover rounded-xl border-2 border-gray-200 group-hover:border-primary-500 transition-colors"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg transform hover:scale-110"
                                                >
                                                    <X size={14} />
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Video */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Product Video (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 hover:bg-primary-50/50 transition-all cursor-pointer relative group">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleVideoChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="video/*"
                                    />
                                    <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-primary-600 transition-colors">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center mb-3 transition-colors">
                                            <Video className="h-8 w-8" />
                                        </div>
                                        <span className="text-sm font-medium">Click to upload video</span>
                                        <span className="text-xs text-gray-400 mt-1">MP4, MOV up to 50MB</span>
                                    </div>
                                </div>

                                {video.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        {video.map((v, index) => (
                                            <div key={index} className="relative group">
                                                <video
                                                    src={getPreview(v)}
                                                    className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 group-hover:border-primary-500 transition-colors"
                                                    controls
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeVideo(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg transform hover:scale-110"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add-on Items */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <ShoppingBag size={20} className="text-primary-600" />
                                    Add-on Items
                                </h2>
                                <button
                                    type="button"
                                    onClick={addAddOnItem}
                                    disabled={addOnItems.length >= 6}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                                >
                                    <Plus size={16} />
                                    Add Item ({addOnItems.length}/6)
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Add complementary products that customers can purchase along with this item (e.g., blouse, petticoat, dupatta)
                            </p>

                            {addOnItems.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No add-on items yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Click "Add Item" to create your first add-on item</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {addOnItems.map((item, index) => (
                                        <div key={index} className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition-colors relative">
                                            <button
                                                type="button"
                                                onClick={() => removeAddOnItem(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transform hover:scale-110 transition-all z-10"
                                            >
                                                <X size={14} />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Item Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., Designer Blouse"
                                                        value={item.name}
                                                        onChange={(e) => updateAddOnItem(index, "name", e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Price *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            value={item.price}
                                                            onChange={(e) => updateAddOnItem(index, "price", Number(e.target.value))}
                                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Stock Qty
                                                        </label>
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            value={item.countInStock || 0}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value) || 0;
                                                                updateAddOnItem(index, "countInStock", val);
                                                                if (val > 0) updateAddOnItem(index, "inStock", true);
                                                                else updateAddOnItem(index, "inStock", false);
                                                            }}
                                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newInStock = !item.inStock;
                                                                updateAddOnItem(index, "inStock", newInStock);
                                                                if (newInStock && (!item.countInStock || item.countInStock <= 0)) {
                                                                    updateAddOnItem(index, "countInStock", 10);
                                                                }
                                                            }}
                                                            className={`w-full py-2 rounded-lg font-semibold transition-all h-[42px] ${item.inStock
                                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                                : "bg-red-100 text-red-700 border border-red-200"
                                                                }`}
                                                        >
                                                            {item.inStock ? "In Stock" : "Out of Stock"}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        placeholder="Brief description of the add-on item"
                                                        value={item.description}
                                                        onChange={(e) => updateAddOnItem(index, "description", e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-20 resize-none"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Images (Optional)
                                                    </label>
                                                    <div className="flex items-start gap-4 flex-col">
                                                        <div className="w-full relative">
                                                            {/* File Input */}
                                                            <input
                                                                type="file"
                                                                multiple
                                                                onChange={(e) => handleAddOnImageChange(index, e)}
                                                                accept="image/*"
                                                                className="block w-full text-sm text-gray-500
                                                                    file:mr-4 file:py-2 file:px-4
                                                                    file:rounded-full file:border-0
                                                                    file:text-sm file:font-semibold
                                                                    file:bg-primary-50 file:text-primary-700
                                                                    hover:file:bg-primary-100"
                                                            />
                                                            <p className="text-xs text-gray-400 mt-1">Max 5MB per image. Formats: JPG, PNG, WEBP</p>
                                                        </div>
                                                        {/* Preview Grid */}
                                                        <div className="flex flex-wrap gap-2 w-full">
                                                            {/* Existing Images */}
                                                            {item.images && item.images.map((img, i) => (
                                                                <div key={`existing-${i}`} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 relative group">
                                                                    <img src={img} alt="Existing" className="w-full h-full object-cover" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeAddOnImage(index, i, false)}
                                                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            {/* New Upload Previews */}
                                                            {item.previewUrls && item.previewUrls.map((url, i) => (
                                                                <div key={`new-${i}`} className="w-16 h-16 rounded-lg overflow-hidden border border-blue-200 flex-shrink-0 relative group">
                                                                    <img src={url} alt="New Upload" className="w-full h-full object-cover" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeAddOnImage(index, i, true)}
                                                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </div>
                                                            ))}

                                                            {/* Legacy support: if single image string exists and not in images array */}
                                                            {item.image && (!item.images || item.images.length === 0) && (
                                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 relative group">
                                                                    <img src={item.image} alt="Legacy" className="w-full h-full object-cover" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeAddOnImage(index, 0, false)} // Treat as first existing
                                                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateAddOnItem(index, "inStock", !item.inStock)}
                                                        className={`w-full py-2 rounded-lg font-semibold transition-all ${item.inStock
                                                            ? "bg-green-100 text-green-700 border border-green-200"
                                                            : "bg-red-100 text-red-700 border border-red-200"
                                                            }`}
                                                    >
                                                        {item.inStock ? "In Stock" : "Out of Stock"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Publish</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <p className={`font-semibold ${inStock && countInStock > 0 ? "text-green-600" : "text-gray-900"}`}>
                                        {inStock && countInStock > 0 ? "Active (In Stock)" : "Inactive (Out of Stock)"}
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            {isEditMode ? "Update Product" : "Create Product"}
                                        </>
                                    )}
                                </button>


                                <Link
                                    to="/admin/productlist"
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancel
                                </Link>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Tips</h3>
                                <ul className="text-xs text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary-600 mt-0.5">•</span>
                                        <span>Use high-quality images for better conversions</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary-600 mt-0.5">•</span>
                                        <span>First image will be the primary display</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary-600 mt-0.5">•</span>
                                        <span>Add detailed descriptions for SEO</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductEdit;
