import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronUp, X, Filter } from "lucide-react";

const PRICE_RANGES = [
    { label: "₹0 - ₹21,909", min: 0, max: 21909 },
    { label: "₹21,909 - ₹43,818", min: 21909, max: 43818 },
    { label: "₹43,818 - ₹65,727", min: 43818, max: 65727 },
    { label: "₹65,727 - ₹87,636", min: 65727, max: 87636 },
    { label: "₹87,636 - ₹109,545", min: 87636, max: 109545 },
];

const FilterSection = ({ title, isOpen, onToggle, children, clearSection }) => {
    return (
        <div className="border-b border-gray-200 py-4">
            <div className="flex items-center justify-between cursor-pointer mb-2" onClick={onToggle}>
                <h3 className="font-serif font-bold text-gray-900 text-sm md:text-base">{title}</h3>
                <div className="flex items-center gap-2">
                    {clearSection && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearSection();
                            }}
                            className="text-xs text-primary-600 hover:text-primary-800 underline"
                        >
                            Clear
                        </button>
                    )}
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>
            {isOpen && (
                <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

export default function FilterSidebar({
    allProducts,
    filters,
    setFilters,
    className = "",
    closeSidebar
}) {
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");

    const [openSections, setOpenSections] = useState({
        price: true,
        categories: true,
        subcategories: true,
        size: true,
        color: true,
        fabric: true,
        work: true,
        discount: true,
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Extract available options from products dynamically
    const options = useMemo(() => {
        // Filter products based on selected categories to determine relevant options
        let productsForOptions = allProducts;
        if (filters.categories && filters.categories.length > 0) {
            productsForOptions = allProducts.filter(p =>
                filters.categories.some(c => p.category?.toLowerCase() === c.toLowerCase())
            );
        }

        const mainCats = new Set();
        const subcats = new Set();
        const sizes = new Set();
        const colors = new Set();
        const fabrics = new Set();
        const works = new Set();

        // Always get all categories from allProducts to allow switching
        allProducts.forEach(p => {
            if (p.category) mainCats.add(p.category);
        });

        // Get subcategories and other attributes ONLY from the relevant products (category-filtered)
        productsForOptions.forEach(p => {
            if (p.subcategory) subcats.add(p.subcategory);
            if (p.sizes && Array.isArray(p.sizes)) p.sizes.forEach(s => sizes.add(s));
            if (p.color) colors.add(p.color);
            if (p.fabric) fabrics.add(p.fabric);
            if (p.work) works.add(p.work);
        });

        // Helper to format counts
        const getCount = (field, value) => {
            // For categories and subcategories, show total available count across the store
            if (field === 'category') {
                return allProducts.filter(p => p.category === value).length;
            }
            if (field === 'subcategory') {
                return productsForOptions.filter(p => p.subcategory === value).length;
            }
            // For attributes, show count within the current subcategory context
            if (field === 'sizes') {
                return productsForOptions.filter(p => p.sizes?.includes(value)).length;
            }
            return productsForOptions.filter(p => p[field] === value).length;
        };

        return {
            categories: Array.from(mainCats).sort().map(v => ({ value: v, count: getCount('category', v) })),
            subcategories: Array.from(subcats).sort().map(v => ({ value: v, count: getCount('subcategory', v) })),
            sizes: Array.from(sizes).sort(), // Size sorting might need custom logic (S, M, L)
            colors: Array.from(colors).sort().map(v => ({ value: v, count: getCount('color', v) })),
            fabrics: Array.from(fabrics).sort().map(v => ({ value: v, count: getCount('fabric', v) })),
            works: Array.from(works).sort().map(v => ({ value: v, count: getCount('work', v) })),
        };
    }, [allProducts, filters.categories]);

    // Size sorting logic
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', 'Free Size'];
    options.sizes.sort((a, b) => {
        const idxA = sizeOrder.indexOf(a);
        const idxB = sizeOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
    });

    const handleCheckboxChange = (section, value) => {
        setFilters(prev => {
            const current = prev[section] || [];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [section]: updated };
        });
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            price: { ...prev.price, [name]: value }
        }));
    };

    const clearFilter = (key) => {
        setFilters(prev => {
            if (key === 'price') return { ...prev, price: { min: '', max: '' }, priceRanges: [] };
            return { ...prev, [key]: [] };
        });
    };

    const clearAll = () => {
        setFilters({
            categories: [],
            subcategories: [],
            size: [],
            color: [],
            fabric: [],
            work: [],
            discount: [],
            price: { min: '', max: '' },
            priceRanges: []
        });
    };

    return (
        <div className={`bg-white h-full flex flex-col ${className}`}>
            <div className="flex items-center justify-between p-4 pb-6 border-b border-gray-100">
                <h2 className="text-lg font-serif font-bold text-gray-900">FILTERS</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={clearAll}
                        className="text-xs font-medium text-gray-500 hover:text-primary-600 underline"
                    >
                        Clear All
                    </button>
                    {closeSidebar && (
                        <button onClick={closeSidebar} className="md:hidden">
                            <X size={20} />
                        </button>
                    )}
                </div>

            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-200 space-y-6">
                {/* Price Filter */}
                <FilterSection
                    title="Price"
                    isOpen={openSections.price}
                    onToggle={() => toggleSection('price')}
                    clearSection={filters.price?.min || filters.price?.max || filters.priceRanges?.length ? () => clearFilter('price') : null}
                >
                    <div className="space-y-3 mb-6">
                        {PRICE_RANGES.map((range) => {
                            const rangeValue = `${range.min}-${range.max}`;
                            return (
                                <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.priceRanges?.includes(rangeValue)}
                                        onChange={() => handleCheckboxChange('priceRanges', rangeValue)}
                                        className="h-4 w-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 flex-1">{range.label}</span>
                                </label>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                            <input
                                type="number"
                                name="min"
                                placeholder="From"
                                value={filters.price?.min || ''}
                                onChange={handlePriceChange}
                                className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded focus:border-gray-900 focus:ring-0 outline-none placeholder-gray-400"
                            />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                            <input
                                type="number"
                                name="max"
                                placeholder="To"
                                value={filters.price?.max || ''}
                                onChange={handlePriceChange}
                                className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded focus:border-gray-900 focus:ring-0 outline-none placeholder-gray-400"
                            />
                        </div>
                    </div>
                </FilterSection>

                {/* Categories */}
                {!categoryParam && options.categories.length > 0 && (
                    <FilterSection
                        title="Categories"
                        isOpen={openSections.categories}
                        onToggle={() => toggleSection('categories')}
                        clearSection={filters.categories?.length ? () => clearFilter('categories') : null}
                    >
                        <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin pr-2">
                            {options.categories.map((cat) => (
                                <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.categories?.includes(cat.value)}
                                            onChange={() => handleCheckboxChange('categories', cat.value)}
                                            className="peer h-4 w-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 flex-1">{cat.value}</span>
                                    <span className="text-xs text-gray-400">{cat.count}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* Sub Categories */}
                {options.subcategories.length > 0 && (
                    <FilterSection
                        title="Sub Categories"
                        isOpen={openSections.subcategories}
                        onToggle={() => toggleSection('subcategories')}
                        clearSection={filters.subcategories?.length ? () => clearFilter('subcategories') : null}
                    >
                        <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin pr-2">
                            {options.subcategories.map((cat) => (
                                <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.subcategories?.includes(cat.value)}
                                            onChange={() => handleCheckboxChange('subcategories', cat.value)}
                                            className="peer h-4 w-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 flex-1">{cat.value}</span>
                                    <span className="text-xs text-gray-400">{cat.count}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* Size */}
                {options.sizes.length > 0 && (
                    <FilterSection
                        title="Size"
                        isOpen={openSections.size}
                        onToggle={() => toggleSection('size')}
                        clearSection={filters.size?.length ? () => clearFilter('size') : null}
                    >
                        <div className="flex flex-wrap gap-2">
                            {options.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleCheckboxChange('size', size)}
                                    className={`
                    min-w-[40px] px-3 py-2 text-xs rounded-full border transition-all duration-200
                    ${filters.size?.includes(size)
                                            ? 'bg-gray-900 text-white border-gray-900 font-medium'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'}
                  `}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* Color */}
                {options.colors.length > 0 && (
                    <FilterSection
                        title="Color"
                        isOpen={openSections.color}
                        onToggle={() => toggleSection('color')}
                        clearSection={filters.color?.length ? () => clearFilter('color') : null}
                    >
                        <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin pr-2">
                            {options.colors.map((item) => (
                                <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.color?.includes(item.value)}
                                        onChange={() => handleCheckboxChange('color', item.value)}
                                        className="h-4 w-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 flex-1">{item.value}</span>
                                    <span className="text-xs text-gray-400">{item.count}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* Fabric */}
                {options.fabrics.length > 0 && (
                    <FilterSection
                        title="Fabric"
                        isOpen={openSections.fabric}
                        onToggle={() => toggleSection('fabric')}
                        clearSection={filters.fabric?.length ? () => clearFilter('fabric') : null}
                    >
                        <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin pr-2">
                            {options.fabrics.map((item) => (
                                <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.fabric?.includes(item.value)}
                                        onChange={() => handleCheckboxChange('fabric', item.value)}
                                        className="h-4 w-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 flex-1">{item.value}</span>
                                    <span className="text-xs text-gray-400">{item.count}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>
                )}

                {/* Work */}
                {options.works.length > 0 && (
                    <FilterSection
                        title="Work"
                        isOpen={openSections.work}
                        onToggle={() => toggleSection('work')}
                        clearSection={filters.work?.length ? () => clearFilter('work') : null}
                    >
                        <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin pr-2">
                            {options.works.map((item) => (
                                <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.work?.includes(item.value)}
                                        onChange={() => handleCheckboxChange('work', item.value)}
                                        className="h-4 w-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 flex-1">{item.value}</span>
                                    <span className="text-xs text-gray-400">{item.count}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>
                )}
            </div>
        </div>
    );
}
