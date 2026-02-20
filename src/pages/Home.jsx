import React, { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import SplashScreen from "../components/SplashScreen";
import FeatureModal from "../components/FeatureModal";
import BestsellerSection from "../components/BestsellerSection";

import StoreVisitSection from '../components/StoreVisitSection';
import ShopTheLook from '../components/ShopTheLook';
import InstagramSection from '../components/InstagramSection';
import HomeBannerSlider from '../components/HomeBannerSlider';
import LazyImage from '../components/LazyImage';
import { Link } from "react-router-dom";
import { Play, ArrowRight, Truck, RotateCcw, Smartphone, Scissors, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllProducts, getProductCategories } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { safeSessionStorage } from "../utils/storage";

export default function Home() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [sareeProducts, setSareeProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSareeLoading, setIsSareeLoading] = useState(true);
  const [isCategoryProductsLoading, setIsCategoryProductsLoading] = useState(true);
  const scrollRef = React.useRef(null);

  const [showSplash, setShowSplash] = useState(true);
  const [activeFeature, setActiveFeature] = useState(null);

  const features = {
    dispatch: {
      title: "24-hour Dispatch",
      description: "Select ready-to-ship products are available for a 24-hour dispatch. Get your favorites delivered in record time.",
      buttonText: "LEARN MORE ABOUT SHIPPING",
      redirectLink: "/shipping-policy"
    },
    returns: {
      title: "Easy Returns",
      description: "We offer a hassle-free 7-day return policy on all standard orders. Shop with confidence knowing we've got you covered.",
      buttonText: "VIEW RETURN POLICY",
      redirectLink: "/returns-policy"
    },
    store: {
      title: "Instant In-Store Experience",
      description: "Connect with our stylists virtually or visit our store for a personalized shopping experience unlike any other.",
      buttonText: "BOOK APPOINTMENT",
      redirectLink: "/book-appointment"
    },
    fitting: {
      title: "Custom Fitting",
      description: "Our master tailors ensure the perfect fit for your unique silhouette. Customization options available on selected products.",
      buttonText: "GUIDE TO CUSTOM FITTING",
      redirectLink: "/custom-fitting"
    }
  };

  useEffect(() => {
    // Check if splash screen has been shown in this session
    const hasSeenSplash = safeSessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    safeSessionStorage.setItem('hasSeenSplash', 'true');
  };

  useEffect(() => {
    const fetchMainData = async () => {
      try {
        setIsLoading(true);
        const [products, fetchedCategories] = await Promise.all([
          getAllProducts(), // Fetch all products without limit
          getCategories()
        ]);

        // Shuffle products to mix all categories
        const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
        setTrendingProducts(shuffledProducts);

        const mappedCategories = fetchedCategories.map((cat, index) => ({
          id: cat._id || index,
          name: cat.name,
          image: cat.image || "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=200",
          link: `/products?category=${cat.name.trim().toLowerCase()}`
        }));

        setCategories(mappedCategories);

        // Fetch products for all categories after categories are loaded
        fetchCategoryProducts();
      } catch (err) {
        console.error("Error fetching main data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategoryProducts = async () => {
      try {
        setIsCategoryProductsLoading(true);
        // Use getProductCategories to get categories that actually have products
        const distinctCategories = await getProductCategories();
        const categoryData = {};

        // Fetch products for each distinct category without any limit
        await Promise.all(distinctCategories.map(async (cat) => {
          try {
            // Using exact name from distinct search, no limit
            const products = await getAllProducts({ category: cat.name });
            if (products && products.length > 0) {
              categoryData[cat.name] = products;
            }
          } catch (error) {
            console.error(`Error fetching products for category ${cat.name}:`, error);
          }
        }));

        setCategoryProducts(categoryData);
      } catch (err) {
        console.error("Error fetching all category products:", err);
      } finally {
        setIsCategoryProductsLoading(false);
      }
    };

    const fetchSareeData = async () => {
      try {
        setIsSareeLoading(true);
        // 1. Try fetching specifically for 'saree' (optimized if backend supports it)
        let sarees = await getAllProducts({ category: 'saree', limit: 8 });

        // 2. Fallback: If no sarees found, try capitalized 'Saree' (resilience for case-sensitive backends)
        if (!sarees || sarees.length === 0) {
          sarees = await getAllProducts({ category: 'Saree', limit: 8 });
        }

        // 3. Last Resort Fallback: Fetch a larger batch and filter on frontend (ensures display if category naming is non-standard)
        if (!sarees || sarees.length === 0) {
          const allProducts = await getAllProducts({ limit: 40 });
          sarees = allProducts.filter(p =>
            p.category?.toLowerCase().includes('saree') ||
            p.name?.toLowerCase().includes('saree')
          ).slice(0, 8);
        }

        setSareeProducts(sarees);
      } catch (err) {
        console.error("Error fetching saree data:", err);
      } finally {
        setIsSareeLoading(false);
      }
    };

    fetchMainData();
    fetchSareeData();
  }, []);

  // Show splash screen on first visit
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="w-full overflow-x-hidden relative max-w-[100vw]">
      {/* Mobile Shop by Category - Top */}
      <section className="block md:hidden w-full pt-[7px] pb-4 border-b border-gray-100 overflow-hidden relative group/mobile-cat">
        <div
          id="mobile-category-slider"
          className="flex overflow-x-auto gap-2 px-4 scrollbar-hide snap-x scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="flex-shrink-0 w-[72px] flex flex-col items-center cursor-pointer snap-start"
            >
              <div className="overflow-hidden rounded-full aspect-square w-full mb-1.5 shadow-md border border-gray-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-[9px] font-bold uppercase tracking-tight text-center leading-tight text-gray-800 break-words w-full h-5 line-clamp-2">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>

        {/* Navigation Buttons for Mobile */}
        <button
          onClick={() => {
            const el = document.getElementById('mobile-category-slider');
            el.scrollBy({ left: -160, behavior: 'smooth' });
          }}
          className="absolute left-1 top-[43px] -translate-y-1/2 z-10 w-7 h-7 bg-white/90 rounded-full shadow-md flex items-center justify-center text-gray-800 border border-gray-100"
          aria-label="Scroll Left"
        >
          <ChevronLeft size={16} strokeWidth={3} />
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('mobile-category-slider');
            el.scrollBy({ left: 160, behavior: 'smooth' });
          }}
          className="absolute right-1 top-[43px] -translate-y-1/2 z-10 w-7 h-7 bg-white/90 rounded-full shadow-md flex items-center justify-center text-gray-800 border border-gray-100"
          aria-label="Scroll Right"
        >
          <ChevronRight size={16} strokeWidth={3} />
        </button>
      </section>

      {/* Home Banner Slider Section */}
      <HomeBannerSlider />



      {/* Brand Text Section */}
      {/* Features Section */}
      <section className="w-full px-4 py-8 md:py-20 mb-4 border-b border-gray-100">
        <div className="container mx-auto grid grid-cols-4 gap-2 md:gap-12">
          <div
            onClick={() => setActiveFeature(features.dispatch)}
            className="flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="mb-2 md:mb-4 text-gray-800 transition-transform duration-300 group-hover:scale-110">
              <img
                src="https://ik.imagekit.io/4sjmoqtje/tr:w-50,c-at_max/cdn/shop/files/icon1.svg?v=1717492962"
                alt="24-hour Dispatch"
                className="w-6 h-6 md:w-10 md:h-10 mx-auto"
              />
            </div>
            <h3 className="text-[10px] md:text-sm font-normal text-gray-900 leading-tight">24-hour Dispatch</h3>
          </div>
          <div
            onClick={() => setActiveFeature(features.returns)}
            className="flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="mb-2 md:mb-4 text-gray-800 transition-transform duration-300 group-hover:scale-110">
              <img
                src="https://ik.imagekit.io/4sjmoqtje/tr:w-50,c-at_max/cdn/shop/files/Easy_Returns.svg?v=1717482978"
                alt="Easy Returns"
                className="w-6 h-6 md:w-10 md:h-10 mx-auto"
              />
            </div>
            <h3 className="text-[10px] md:text-sm font-normal text-gray-900 leading-tight">Easy Returns</h3>
          </div>
          <div
            onClick={() => setActiveFeature(features.store)}
            className="flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="mb-2 md:mb-4 text-gray-800 transition-transform duration-300 group-hover:scale-110">
              <img
                src="https://ik.imagekit.io/4sjmoqtje/tr:w-50,c-at_max/cdn/shop/files/phone-icon.svg?v=1737604227"
                alt="Instant In-Store Experience"
                className="w-6 h-6 md:w-10 md:h-10 mx-auto"
              />
            </div>
            <h3 className="text-[10px] md:text-sm font-normal text-gray-900 leading-tight">Instant In-Store Experience</h3>
          </div>
          <div
            onClick={() => setActiveFeature(features.fitting)}
            className="flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="mb-2 md:mb-4 text-gray-800 transition-transform duration-300 group-hover:scale-110">
              <img
                src="https://ik.imagekit.io/4sjmoqtje/tr:w-50,c-at_max/cdn/shop/files/fitting-icon.svg?v=1737604376"
                alt="Custom Fitting"
                className="w-6 h-6 md:w-10 md:h-10 mx-auto"
              />
            </div>
            <h3 className="text-[10px] md:text-sm font-normal text-gray-900 leading-tight">Custom Fitting</h3>
          </div>
        </div>
      </section>

      <FeatureModal
        isOpen={!!activeFeature}
        onClose={() => setActiveFeature(null)}
        title={activeFeature?.title}
        description={activeFeature?.description}
        buttonText={activeFeature?.buttonText}
        redirectLink={activeFeature?.redirectLink}
      />

      {/* Featured Categories (Circular/Modern) */}
      {/* Featured Categories (Circular/Modern) */}


      {/* Featured Collections (3-Column Row Redesign) */}
      <section className="mb-6 overflow-hidden">
        <div className="w-full px-3 md:container md:mx-auto md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {/* The Saree Edit */}
            <div className="group relative h-[250px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl shadow-2xl border border-primary-100/50">
              <LazyImage
                src="/images/Saree editt.jpeg"
                alt="Saree Collection"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute inset-x-2 bottom-2 md:inset-x-6 md:bottom-12">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 md:p-6 rounded-2xl transform transition-all duration-500 group-hover:-translate-y-2 flex flex-col items-center text-center">
                  <span className="text-primary-200 text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2 block">Timeless</span>
                  <h3 className="text-base md:text-3xl font-serif font-bold text-white mb-1 md:mb-2">The Saree Edit</h3>
                  <p className="text-white/80 mb-2 md:mb-6 italic text-[10px] md:text-sm line-clamp-1 md:line-clamp-none">Six yards of pure grace and tradition.</p>
                  <Link
                    to="/products?category=saree"
                    className="inline-flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 bg-white text-primary-900 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-primary-50 transition-colors rounded-full shadow-lg"
                  >
                    Explore <ArrowRight size={12} className="hidden md:block" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Modern Suits */}
            <div className="group relative h-[250px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl shadow-2xl border border-primary-100/50">
              <LazyImage
                src="/images/Mode Suitt.jpeg"
                alt="Suits Collection"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute inset-x-2 bottom-2 md:inset-x-6 md:bottom-12">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 md:p-6 rounded-2xl transform transition-all duration-500 group-hover:-translate-y-2 flex flex-col items-center text-center">
                  <span className="text-primary-200 text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2 block">Modern</span>
                  <h3 className="text-base md:text-3xl font-serif font-bold text-white mb-1 md:mb-2">The Suit Edit</h3>
                  <p className="text-white/80 mb-2 md:mb-6 italic text-[10px] md:text-sm line-clamp-1 md:line-clamp-none">Elegance in every stitch.</p>
                  <Link
                    to="/products?category=suit"
                    className="inline-flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 bg-white text-primary-900 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-primary-50 transition-colors rounded-full shadow-lg"
                  >
                    Explore <ArrowRight size={12} className="hidden md:block" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Western Dress */}
            <div className="group relative h-[250px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl shadow-2xl border border-primary-100/50">
              <LazyImage
                src="/images/Western editt.jpeg"
                alt="Western Dress Collection"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute inset-x-2 bottom-2 md:inset-x-6 md:bottom-12">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 md:p-6 rounded-2xl transform transition-all duration-500 group-hover:-translate-y-2 flex flex-col items-center text-center">
                  <span className="text-primary-200 text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2 block">Chic</span>
                  <h3 className="text-base md:text-3xl font-serif font-bold text-white mb-1 md:mb-2">Western Dress</h3>
                  <p className="text-white/80 mb-2 md:mb-6 italic text-[10px] md:text-sm line-clamp-1 md:line-clamp-none">Contemporary styles.</p>
                  <Link
                    to="/products?category=western%20fits"
                    className="inline-flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 bg-white text-primary-900 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-primary-50 transition-colors rounded-full shadow-lg"
                  >
                    Explore <ArrowRight size={12} className="hidden md:block" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="group relative h-[250px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl shadow-2xl border border-primary-100/50">
              <LazyImage
                src="/images/Kurtii.jpeg"
                alt="Kurti Collection"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute inset-x-2 bottom-2 md:inset-x-6 md:bottom-12">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 md:p-6 rounded-2xl transform transition-all duration-500 group-hover:-translate-y-2 flex flex-col items-center text-center">
                  <span className="text-primary-200 text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2 block">Fusion</span>
                  <h3 className="text-base md:text-3xl font-serif font-bold text-white mb-1 md:mb-2">Designer Kurti Sets</h3>
                  <p className="text-white/80 mb-2 md:mb-6 italic text-[10px] md:text-sm line-clamp-1 md:line-clamp-none">Everyday elegance.</p>
                  <Link
                    to="/products?category=kurta%20sets"
                    className="inline-flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 bg-white text-primary-900 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-primary-50 transition-colors rounded-full shadow-lg"
                  >
                    Explore <ArrowRight size={12} className="hidden md:block" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestseller Trends Section */}
      <BestsellerSection title="Bestseller Trends" products={trendingProducts} customMargin="mb-0" customPadding="py-6 md:py-10" />

      <ShopTheLook />

      {/* Featured Categories (Circular/Modern) - Desktop Slider */}
      <section className="hidden md:block container mx-auto px-6 mb-12 relative group/cat-slider">
        <h2 className="text-3xl font-serif font-bold text-center mb-8 text-gray-900">
          {/* Shop by Category */}
        </h2>

        <div className="relative overflow-visible">
          {/* Navigation Buttons */}
          <button
            onClick={() => {
              const el = document.getElementById('desktop-category-slider');
              el.scrollBy({ left: -el.offsetWidth, behavior: 'smooth' });
            }}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-gray-400 hover:text-primary-600 hover:scale-110 transition-all border border-gray-100"
          >
            <ChevronLeft size={28} strokeWidth={2.5} />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('desktop-category-slider');
              el.scrollBy({ left: el.offsetWidth, behavior: 'smooth' });
            }}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-gray-400 hover:text-primary-600 hover:scale-110 transition-all border border-gray-100"
          >
            <ChevronRight size={28} strokeWidth={2.5} />
          </button>

          <div
            id="desktop-category-slider"
            className="flex overflow-x-auto gap-12 pb-6 scrollbar-hide snap-x scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="flex-shrink-0 w-[calc(20%-38.4px)] group flex flex-col items-center cursor-pointer snap-start"
              >
                <div className="overflow-hidden rounded-full aspect-square w-full shadow-lg border-4 border-white transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-primary-100">
                  <LazyImage
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-center text-gray-600 group-hover:text-primary-600 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Saree Edit Products */}
      <BestsellerSection
        title="The Saree Collection"
        products={sareeProducts}
        loading={isSareeLoading}
        bgColor="bg-[#FAF5FF]"
        viewAllLink="/products?category=saree"
        customPadding="py-4 md:py-4"
        customMargin="mb-0"
      />

      {/* Other Category Products
      {!isCategoryProductsLoading && Object.entries(categoryProducts).length > 0 ? (
        Object.entries(categoryProducts)
          .map(([categoryName, products], index) => (
            <BestsellerSection
              key={categoryName}
              title={`${categoryName} Collection`}
              products={products}
              loading={false}
              bgColor={index % 2 === 0 ? "bg-white" : "bg-[#FAF5FF]/50"}
              viewAllLink={`/products?category=${encodeURIComponent(categoryName)}`}
              customPadding="py-12 md:py-16"
              customMargin="mb-0"
              showViewAll={true}
            />
          ))
      ) : isCategoryProductsLoading && (
        <BestsellerSection
          title="Loading Collections..."
          products={[]}
          loading={true}
          customPadding="py-12 md:py-16"
          customMargin="mb-0"
        />
      )}
 */}

      {/* Video Shopping Section */}
      <section className="w-full px-3 md:container md:mx-auto md:px-6 mb-8 md:mb-20">
        <div className="bg-primary-50/50 backdrop-blur-sm border border-primary-100 rounded-2xl overflow-hidden flex flex-col-reverse md:flex-row relative shadow-sm">
          <div className="w-full md:w-1/2 p-6 md:p-20 flex flex-col justify-center items-start z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 md:mb-6">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              New Feature
            </span>
            <h2 className="text-2xl md:text-5xl font-serif font-bold text-gray-900 mb-4 md:mb-6">Experience SHESHRI Live</h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-lg max-w-md">
              Shop from the comfort of your home with our exclusive 1-on-1 video shopping experience. Our stylists will help you find your perfect outfit.
            </p>
            <div className="flex gap-3 md:gap-4 w-full md:w-auto">
              <a
                href="https://wa.me/917838418308?text=Hello%20Sheshri%20Fashion%2C%20I%20would%20like%20to%20book%20a%201-on-1%20video%20shopping%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none flex justify-center items-center gap-2 md:gap-3 px-4 py-3 md:px-8 md:py-4 bg-black text-white text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition rounded-md"
              >
                Book Appointment
              </a>
              <button className="flex-1 md:flex-none flex justify-center items-center gap-2 md:gap-3 px-4 py-3 md:px-8 md:py-4 bg-white border border-gray-200 text-black text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition rounded-md">
                <Play className="w-3 h-3 md:w-4 md:h-4 fill-current" /> Watch Demo
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative h-[200px] md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f8f8f8] to-transparent z-10 via-transparent hidden md:block" />
            <LazyImage
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop"
              alt="Video Shopping"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Testimonials / Trust */}
      <section className="bg-primary-50 py-8 md:py-16 mb-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="grid grid-cols-3 gap-1 md:gap-24 justify-center items-start">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-3 md:mb-4 text-xl md:text-2xl">📦</div>
              <h4 className="font-bold text-gray-900 uppercase tracking-wide text-[9px] md:text-sm mb-1">Global Shipping</h4>
              <p className="text-[8px] md:text-xs text-gray-500 leading-tight">Delivering fashion worldwide</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-3 md:mb-4 text-xl md:text-2xl">🧵</div>
              <h4 className="font-bold text-gray-900 uppercase tracking-wide text-[9px] md:text-sm mb-1">Custom Fitting</h4>
              <p className="text-[8px] md:text-xs text-gray-500 leading-tight">Perfect fit guaranteed</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-3 md:mb-4 text-xl md:text-2xl">💎</div>
              <h4 className="font-bold text-gray-900 uppercase tracking-wide text-[9px] md:text-sm mb-1">Premium Quality</h4>
              <p className="text-[8px] md:text-xs text-gray-500 leading-tight">Handpicked fabrics & designs</p>
            </div>
          </div>
        </div>
      </section>

      <InstagramSection />

      <StoreVisitSection />
    </div>
  );
}
