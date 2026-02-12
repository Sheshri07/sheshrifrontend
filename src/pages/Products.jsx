import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import { Filter, X, ChevronRight } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    price: { min: '', max: '' },
    priceRanges: [],
    size: [],
    color: [],
    fabric: [],
    work: [],
    discount: []
  });

  // Load products
  useEffect(() => {
    getAllProducts().then(setProducts).catch(console.error);
  }, []);

  // Sync URL category param with filters
  useEffect(() => {
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryParam]
      }));
    } else {
      // Clear category filter if no param (optional but keeps state clean on regular navigation)
      setFilters(prev => ({
        ...prev,
        categories: []
      }));
    }
  }, [categoryParam]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Main Category (from checkboxes or URL)
      if (filters.categories.length > 0) {
        const catMatch = filters.categories.some(c =>
          p.category?.toLowerCase() === c.toLowerCase()
        );
        if (!catMatch) return false;
      }

      // Subcategory (from checkboxes)
      if (filters.subcategories.length > 0) {
        const subcatMatch = filters.subcategories.some(c =>
          p.subcategory?.toLowerCase().includes(c.toLowerCase())
        );
        if (!subcatMatch) return false;
      }

      // Price
      // 1. Manual Min/Max
      if (filters.price.min && p.price < Number(filters.price.min)) return false;
      if (filters.price.max && p.price > Number(filters.price.max)) return false;

      // 2. Predefined Ranges (OR logic between selected ranges)
      if (filters.priceRanges && filters.priceRanges.length > 0) {
        const isInAnyRange = filters.priceRanges.some(range => {
          const [min, max] = range.split('-').map(Number);
          return p.price >= min && p.price <= max;
        });
        if (!isInAnyRange) return false;
      }

      // Size
      if (filters.size.length > 0) {
        if (!p.sizes || !p.sizes.some(s => filters.size.includes(s))) return false;
      }

      // Color
      if (filters.color.length > 0) {
        if (!filters.color.includes(p.color)) return false;
      }

      // Fabric
      if (filters.fabric.length > 0) {
        if (!filters.fabric.includes(p.fabric)) return false;
      }

      // Work
      if (filters.work.length > 0) {
        if (!filters.work.includes(p.work)) return false;
      }

      return true;
    });
  }, [products, filters, categoryParam]);

  const title = categoryParam
    ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1) + (categoryParam.endsWith('s') ? '' : 's')
    : "All Products";

  return (
    <div className="max-w-[1600px] mx-auto min-h-screen">

      {/* Mobile Sticky Filter Capsule */}
      <div className="lg:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-max">
        <div className="bg-[#1a2b25] backdrop-blur-md rounded-full px-10 py-3 flex items-center shadow-2xl border border-white/10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-[#e5fcf6] hover:text-white transition-colors"
          >
            FILTER
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-72 h-[calc(100dvh-80px)] sticky top-[80px] overflow-y-auto border-r border-gray-100 pl-6 pr-4 py-6 scrollbar-thin">
          <FilterSidebar
            allProducts={products}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* Sidebar - Mobile Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl animate-in slide-in-from-right duration-300">
              <FilterSidebar
                allProducts={products}
                filters={filters}
                setFilters={setFilters}
                closeSidebar={() => setIsSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 px-4 md:px-8 py-6 md:py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b border-gray-100 pb-8">
            <div className="space-y-2">
              <nav className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">
                <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                <ChevronRight size={10} className="text-gray-300" />
                <span className="text-gray-900 font-bold">{title}</span>
              </nav>
              <h1 className="text-3xl md:text-5xl font-serif font-black text-gray-900 tracking-tight leading-none italic">
                {title}
              </h1>
              <p className="text-gray-500 text-sm md:text-base font-light max-w-xl">
                Discover our exclusive collection of {title.toLowerCase()}, curated for elegance and timeless style.
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center gap-4">
              <div className="h-px w-12 bg-gray-200 hidden md:block"></div>
              <p className="text-gray-900 font-serif italic text-sm md:text-lg">
                <span className="font-bold text-primary-600">{filteredProducts.length}</span> Masterpieces found
              </p>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
              <div className="max-w-md mx-auto px-4">
                <p className="text-xl md:text-2xl text-gray-400 font-serif mb-2">No matches found</p>
                <p className="text-sm text-gray-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={() => setFilters({
                    categories: [],
                    subcategories: [],
                    price: { min: '', max: '' },
                    priceRanges: [],
                    size: [],
                    color: [],
                    fabric: [],
                    work: [],
                    discount: []
                  })}
                  className="bg-gray-900 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
