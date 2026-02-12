import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getProductById, getAllProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { Play, X, ZoomIn, Heart, CheckCircle2, ChevronRight, Plus, Minus, Eye, Percent, RotateCcw, Star, Package, Truck } from "lucide-react";
import BestsellerSection from "../components/BestsellerSection";

const blouseDesigns = [
  { id: 1, name: "HALTER NECKLINE", image: "https://res.cloudinary.com/dv6fpyh8h/image/upload/v1738075308/halter_neckline_uylhqv.jpg" },
  { id: 2, name: "PLUNGE NECKLINE", image: "https://res.cloudinary.com/dv6fpyh8h/image/upload/v1738075308/plunge_neckline_ncyr2a.jpg" },
  { id: 3, name: "SCOOP NECKLINE", image: "https://res.cloudinary.com/dv6fpyh8h/image/upload/v1738075308/scoop_neckline_ncyr2a.jpg" },
  { id: 4, name: "SPAGHETTI STRAP WIDE U NECK", image: "https://res.cloudinary.com/dv6fpyh8h/image/upload/v1738075309/spaghetti_neckline_ncyr2a.jpg" },
  { id: 5, name: "HIGH PLUNGING NECKLINE", image: "https://res.cloudinary.com/dv6fpyh8h/image/upload/v1738075308/high_plunge_ncyr2a.jpg" },
  { id: 6, name: "SWEETHEART NECKLINE", image: "https://res.cloudinary.com/dv6fpyh8h/image/upload/v1738075309/sweetheart_neckline_ncyr2a.jpg" },
  { id: 7, name: "BROAD V NECKLINE", image: "https://res.cloudinary.com/dv6fpyh8h/image/upload/v1738075308/broad_v_neckline_ncyr2a.jpg" },
  { id: 8, name: "CURVED V NECKLINE", image: "https://res.cloudinary.com/dv6fpyh8h/image/upload/v1738075308/curved_v_neckline_ncyr2a.jpg" }
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeMedia, setActiveMedia] = useState({ type: "image", src: "" });
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addOns, setAddOns] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [isAddOnMapping, setIsAddOnMapping] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const imageContainerRef = useRef(null);
  const [activeAccordion, setActiveAccordion] = useState("details");
  const [stitchingOption, setStitchingOption] = useState("Unstitched");
  const [stitchingSize, setStitchingSize] = useState("US 0");
  const [paddingRequired, setPaddingRequired] = useState("No");
  const [blouseDesign, setBlouseDesign] = useState("");
  const [isBlouseModalOpen, setIsBlouseModalOpen] = useState(false);

  // Pincode and delivery states
  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [pincodeError, setPincodeError] = useState("");

  // Saree add-ons states
  const [preDrapeSelected, setPreDrapeSelected] = useState(false);
  const [petticoatSelected, setPetticoatSelected] = useState(false);

  // Dynamic people viewing count (random 100-150)
  const [viewingCount] = useState(Math.floor(Math.random() * (150 - 100 + 1)) + 100);



  const [hoveredSize, setHoveredSize] = useState(null);

  const stitchingSizes = ["US 0", "US 2", "US 4", "US 6", "US 8", "US 10", "US 12", "US 14", "US 16"];

  const sizeMeasurements = {
    "US 0": { bust: 33, waist: 27, hip: 37 },
    "US 2": { bust: 34, waist: 28, hip: 38.5 },
    "US 4": { bust: 35, waist: 29, hip: 39 },
    "US 6": { bust: 36, waist: 30, hip: 40 },
    "US 8": { bust: 37, waist: 31, hip: 42 },
    "US 10": { bust: 38, waist: 32, hip: 44 },
    "US 12": { bust: 39.5, waist: 33.5, hip: 45 },
    "US 14": { bust: 41, waist: 35, hip: 46 },
    "US 16": { bust: 42, waist: 36, hip: 48 },
  };

  const sizes = ["XS", "S", "M", "L", "XL"];

  const isInWishlistState = product ? isInWishlist(product._id) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlistState) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  useEffect(() => {
    setAddOns([]); // Reset add-ons when ID changes
    setSelectedAddOns([]);
    getProductById(id).then((data) => {
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      } else if (data.category?.toUpperCase() === 'SAREE') {
        setSelectedSize("Standard");
      }
      if (data.images && data.images.length > 0) {
        setActiveMedia({ type: "image", src: data.images[0] });
      } else if (data.image) {
        setActiveMedia({ type: "image", src: data.image });
      } else if (Array.isArray(data.video) && data.video.length > 0) {
        setActiveMedia({ type: "video", src: data.video[0] });
      } else if (data.video && typeof data.video === 'string') {
        setActiveMedia({ type: "video", src: data.video });
      }

      // Determine Add-ons: Manual or Related
      if (data.addOnItems && data.addOnItems.length > 0) {
        setAddOns(data.addOnItems);
        setIsAddOnMapping(true); // Treat as specific mapping for UI text
      } else if (data.category?.toUpperCase() !== 'SAREE') {
        // Fallback to fetch related based on category and subcategory (Except for SAREE)
        fetchRelatedAddOns(data.category, data.subcategory);
      } else {
        // For SAREE with no manual add-ons, show nothing
        setAddOns([]);
        setIsAddOnMapping(false);
      }

      // Fetch Similar Products
      fetchSimilarProducts(data.category, data.subcategory, data._id);
    });
  }, [id]);

  const fetchSimilarProducts = async (category, subcategory, currentId) => {
    try {
      const allProducts = await getAllProducts();
      const currentCat = category?.toUpperCase() || '';
      const currentSubcat = subcategory?.toUpperCase() || '';

      // Try matching by subcategory first if it exists
      let similar = [];
      if (currentSubcat) {
        similar = allProducts.filter(p =>
          p.subcategory?.toUpperCase() === currentSubcat && p._id !== currentId
        );
      }

      // If not enough similar products, fill with same category
      if (similar.length < 4) {
        const byCat = allProducts.filter(p =>
          p.category?.toUpperCase() === currentCat &&
          p._id !== currentId &&
          !similar.find(s => s._id === p._id)
        );
        similar = [...similar, ...byCat];
      }

      setSimilarProducts(similar);
    } catch (error) {
      console.error('Error fetching similar products:', error);
    }
  };

  const fetchRelatedAddOns = async (category, subcategory) => {
    try {
      const allProducts = await getAllProducts();
      const currentCat = category?.toUpperCase() || '';
      const currentSubcat = subcategory?.toUpperCase() || '';

      const mapping = {
        'SAREE': ['DUPATTA', 'BLOUSE', 'PETTICOAT'],
        'KURTI': ['DUPATTA', 'LEGGINGS'],
        'LEHENGA': ['DUPATTA', 'CHOLI'],
        'DUPATTA': ['KURTI', 'SUIT'],
        'SUIT': ['DUPATTA'],
        'WESTERN DRESS': ['WESTERN', 'BAGS', 'ACCESSORIES'],
        'WESTERN': ['WESTERN DRESS', 'BAGS', 'ACCESSORIES']
      };

      const targetCategories = mapping[currentCat] || [];

      // Priority 1: Specifically mapped categories
      let related = allProducts.filter(p => {
        const pCat = p.category?.toUpperCase();
        return targetCategories.includes(pCat) && p._id !== id;
      });

      // Priority 2: Same subcategory (if no specific mapping found)
      if (related.length === 0 && currentSubcat) {
        related = allProducts.filter(p =>
          p.subcategory?.toUpperCase() === currentSubcat && p._id !== id
        );
      }

      // Priority 3: Same category
      if (related.length === 0) {
        related = allProducts.filter(p =>
          p.category?.toUpperCase() === currentCat && p._id !== id
        );
      }

      if (related.length > 0) {
        setIsAddOnMapping(true);
      } else {
        setIsAddOnMapping(false);
      }

      setAddOns(related.slice(0, 3)); // Max 3 items
    } catch (error) {
      console.error('Error fetching add-ons:', error);
    }
  };

  const toggleAddOn = (item) => {
    if (selectedAddOns.find(a => a._id === item._id)) {
      setSelectedAddOns(selectedAddOns.filter(a => a._id !== item._id));
    } else {
      setSelectedAddOns([...selectedAddOns, item]);
    }
  };

  const handleAddToCartWithAddOns = () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate('/login');
      return;
    }

    // Determine stitching details
    let stitchingDetails = null;
    if (product.category?.toUpperCase() === 'SAREE') {
      stitchingDetails = {
        option: stitchingOption,
        stitchingSize: stitchingOption === 'Stitched' ? stitchingSize : null,
        padding: stitchingOption === 'Stitched' ? paddingRequired : null,
        blouseDesign: stitchingOption === 'Stitched' ? blouseDesign : null
      };
    }

    // Determine saree add-ons
    let sareeAddOns = null;
    if (product.category?.toUpperCase() === 'SAREE') {
      sareeAddOns = {
        preDrape: preDrapeSelected,
        petticoat: petticoatSelected
      };
    }

    // Add main product
    addToCart(product, quantity, selectedSize, stitchingDetails, sareeAddOns);

    // Add selected add-ons
    selectedAddOns.forEach(item => {
      addToCart(item, 1, item.sizes?.[0] || 'M');
    });

    toast.success(`${1 + selectedAddOns.length} items added to cart!`);
  };

  const handleBuyNow = () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to continue with purchase");
      navigate('/login');
      return;
    }

    handleAddToCartWithAddOns();
    navigate('/checkout');
  };

  const handlePincodeCheck = () => {
    // Validate pincode (6 digits)
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPincodeError("Valid 6-digit PIN required");
      setPincodeChecked(false);
      setEstimatedDelivery("");
      return;
    }

    // Calculate estimated delivery (6 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 6);
    const options = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = deliveryDate.toLocaleDateString('en-GB', options);

    setPincodeError("");
    setPincodeChecked(true);
    setEstimatedDelivery(formattedDate);
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[100dvh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Combine images and video for gallery in specific arrangement: 
  // First 2 images, then 2 videos, then remaining images, then remaining videos
  const allImages = (product.images || (product.image ? [product.image] : [])).map(src => ({ type: "image", src }));
  const videoField = product.video;
  const allVideos = (Array.isArray(videoField) ? videoField : (videoField ? [videoField] : [])).map(src => ({ type: "video", src }));

  const galleryItems = [
    ...allImages.slice(0, 2),
    ...allVideos.slice(0, 2),
    ...allImages.slice(2),
    ...allVideos.slice(2)
  ];

  // Hover Zoom Logic
  const handleMouseMove = (e) => {
    if (activeMedia.type === "video") return;

    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)", // 2x Zoom level
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

        {/* Gallery Section */}
        <div className="lg:sticky lg:top-28">
          <div className="flex flex-col-reverse md:flex-row gap-4">

            {/* Thumbnails */}
            {galleryItems.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px] w-full md:w-20 flex-shrink-0 scrollbar-hide">
                {galleryItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveMedia(item)}
                    className={`relative flex-shrink-0 w-16 h-20 md:w-full md:h-24 rounded-lg overflow-hidden border-2 transition-all ${activeMedia.src === item.src
                      ? "border-primary-600 ring-2 ring-primary-50"
                      : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
                      }`}
                  >
                    {item.type === "video" ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                        <video src={item.src} className="w-full h-full object-cover opacity-60 absolute inset-0 pointer-events-none" />
                        <Play className="text-white w-8 h-8 z-10" strokeWidth={1.5} />
                      </div>
                    ) : (
                      <img src={item.src} alt={`View ${index}`} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main Media Display */}
            <div className="flex-1 relative group">
              <div
                className="overflow-hidden rounded-xl shadow-sm bg-gray-50 aspect-[4/5] md:aspect-[3/4] max-h-[500px] md:max-h-[600px] relative border border-gray-100 cursor-zoom-in"
                onDoubleClick={() => setIsLightboxOpen(true)}
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {activeMedia.type === "video" ? (
                  <video
                    src={activeMedia.src}
                    controls
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={activeMedia.src}
                    className="w-full h-full object-cover transition-transform duration-200 ease-out"
                    style={zoomStyle}
                    alt={product.name}
                  />
                )}
              </div>
              {/* Zoom Hint Overlay */}
              {activeMedia.type !== "video" && (
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-start py-4">
          <span className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold border-b border-gray-100 pb-1 w-fit">
            {product.category || "Exclusive Collection"}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-3xl font-medium text-purple-600">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${product.inStock && (product.countInStock > 0)
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
              }`}>
              {product.inStock && (product.countInStock > 0) ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed text-base mb-6 border-l-4 border-primary-100 pl-4">
            {product.description || "Experience elegance with this handcrafted masterpiece, designed for the modern woman who cherishes tradition."}
          </p>

          {/* Pincode Location Section - Available for all products */}
          <div className="mb-2">
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <label className="block text-gray-900 font-semibold text-sm mb-3">
                Express delivery? Start with your PIN
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPincode(value);
                    if (pincodeChecked) {
                      setPincodeChecked(false);
                      setEstimatedDelivery("");
                    }
                  }}
                  placeholder="Enter 6-digit PIN"
                  maxLength={6}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handlePincodeCheck}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-black transition-colors"
                >
                  Check Location
                </button>
              </div>
              {pincodeError && (
                <p className="text-red-600 text-xs mt-2 font-medium">{pincodeError}</p>
              )}
              {pincodeChecked && estimatedDelivery && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-blue-800 text-sm font-medium">
                    Est. Delivery by {estimatedDelivery}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className={`space-y-8 border-t border-gray-100 ${product.category?.toUpperCase() === 'SAREE' ? 'pt-4' : 'pt-8'} mb-8`}>
            {/* Size Selector */}
            {product.category?.toUpperCase() !== 'SAREE' && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-900 font-semibold tracking-wide text-sm">Select Size</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-primary-600 text-xs font-medium hover:underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || []).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-full border flex items-center justify-center font-medium transition-all duration-200 ${selectedSize === size
                        ? "border-primary-600 text-white bg-primary-600 shadow-md"
                        : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Guide Modal */}
            {isSizeGuideOpen && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={() => setIsSizeGuideOpen(false)}
              >
                <div
                  className={`bg-white rounded-3xl w-full ${product.category?.toUpperCase() === 'SAREE' ? 'max-w-4xl' : 'max-w-2xl'} max-h-[90dvh] overflow-y-auto shadow-2xl animate-scale-up scrollbar-hide`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 md:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-bold text-gray-900">Size Guide</h3>
                    <button
                      onClick={() => setIsSizeGuideOpen(false)}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>
                  <div className="p-3 md:p-6">
                    {product.category?.toUpperCase() === 'SAREE' ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
                        {/* Left Column: Size Chart Table */}
                        <div className="w-full">
                          <h4 className="text-sm md:text-lg font-bold text-gray-900 mb-2 md:mb-3 text-center lg:text-left">Size Guide</h4>
                          <div className="overflow-x-auto border rounded-xl border-gray-100">
                            <table className="w-full text-xs text-center">
                              <thead className="bg-orange-50 text-gray-900 font-bold border-b border-orange-100">
                                <tr>
                                  <th className="py-1 md:py-2 px-1 text-left pl-3">SIZE</th>
                                  <th className="py-1 md:py-2 px-1">Bust</th>
                                  <th className="py-1 md:py-2 px-1">Waist</th>
                                  <th className="py-1 md:py-2 px-1">Hip</th>
                                  <th className="py-1 md:py-2 px-1">Armhole</th>
                                  <th className="py-1 md:py-2 px-1">Size</th>
                                  <th className="py-1 md:py-2 px-1">UK</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-gray-600 bg-white">
                                {[
                                  { tag: "US 0", b: "33", w: "27", h: "37", a: "15", s: "XS", uk: "4" },
                                  { tag: "US 2", b: "34", w: "28", h: "38.5", a: "15.5", s: "XS", uk: "6" },
                                  { tag: "US 4", b: "35", w: "29", h: "39", a: "16", s: "S", uk: "8" },
                                  { tag: "US 6", b: "36", w: "30", h: "40", a: "16.5", s: "S", uk: "10" },
                                  { tag: "US 8", b: "37", w: "31", h: "42", a: "17", s: "M", uk: "12" },
                                  { tag: "US 10", b: "38", w: "32", h: "44", a: "18", s: "M", uk: "14" },
                                  { tag: "US 12", b: "39.5", w: "33.5", h: "45", a: "18.5", s: "L", uk: "16" },
                                  { tag: "US 14", b: "41", w: "35", h: "46", a: "19", s: "L", uk: "18" },
                                  { tag: "US 16", b: "42", w: "36", h: "48", a: "20", s: "XL", uk: "20" },
                                  { tag: "US 18", b: "44", w: "39", h: "50", a: "21", s: "XXL", uk: "24" },
                                  { tag: "US 19", b: "46", w: "41", h: "50", a: "21.5", s: "XXL", uk: "26" },
                                  { tag: "US 20", b: "47", w: "42", h: "50", a: "21.5", s: "XXXL", uk: "28" },
                                  { tag: "US 21", b: "48", w: "43", h: "52", a: "22", s: "XXXL", uk: "30" },
                                ].map((row, idx) => (
                                  <tr key={idx} className={`hover:bg-gray-50 transition-colors`}>
                                    <td className="py-1 md:py-2 px-1 font-bold text-gray-900 text-left pl-3">{row.tag}</td>
                                    <td className="py-1 md:py-2 px-1">{row.b}</td>
                                    <td className="py-1 md:py-2 px-1">{row.w}</td>
                                    <td className="py-1 md:py-2 px-1">{row.h}</td>
                                    <td className="py-1 md:py-2 px-1">{row.a}</td>
                                    {idx % 2 === 0 ? (
                                      <td className="py-1 md:py-2 px-1 align-middle border-l border-gray-100" rowSpan={row.s === 'XXL' || row.s === 'XXXL' ? 2 : 2}>
                                        {row.s}
                                      </td>
                                    ) : null}
                                    <td className="py-1 md:py-2 px-1 border-l border-gray-100">{row.uk}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Right Column: Measure Yourself */}
                        <div className="w-full flex flex-col">
                          <h4 className="text-sm md:text-lg font-bold text-gray-900 mb-2 md:mb-3 text-center lg:text-left">Measure yourself</h4>
                          <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 h-full">
                            <img
                              src="/measure-guide.png"
                              alt="Body Measurement Guide"
                              className="w-full h-auto max-h-[200px] md:max-h-[350px] object-contain"
                            />
                            {/* Hidden text descriptions as the image is comprehensive */}
                            <p className="sr-only">Refer to the diagram for chest, waist, and hip measurement points.</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-primary-50">
                                <th className="p-4 font-bold text-primary-900 border-b border-primary-100 rounded-tl-xl">Size</th>
                                <th className="p-4 font-bold text-primary-900 border-b border-primary-100">Bust (In)</th>
                                <th className="p-4 font-bold text-primary-900 border-b border-primary-100">Waist (In)</th>
                                <th className="p-4 font-bold text-primary-900 border-b border-primary-100 rounded-tr-xl">Hip (In)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {[
                                { s: "XS", b: "32", w: "26", h: "35" },
                                { s: "S", b: "34", w: "28", h: "37" },
                                { s: "M", b: "36", w: "30", h: "39" },
                                { s: "L", b: "38", w: "32", h: "41" },
                                { s: "XL", b: "40", w: "34", h: "43" },
                                { s: "XXL", b: "42", w: "36", h: "45" },
                              ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                  <td className="p-4 font-semibold text-gray-900">{row.s}</td>
                                  <td className="p-4 text-gray-600">{row.b}</td>
                                  <td className="p-4 text-gray-600">{row.w}</td>
                                  <td className="p-4 text-gray-600">{row.h}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                          <p className="text-sm text-orange-800 leading-relaxed">
                            <span className="font-bold">Note:</span> These are standard body measurements. Actual garment measurements may vary slightly based on the style and fabric.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stitching Options for Saree */}
            {product.category?.toUpperCase() === 'SAREE' && (
              <div className="space-y-6">
                <div>
                  {/* Header with Badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-gray-900 font-bold text-lg">Blouse Stitching Option :</h3>
                    <span className="px-3 py-1 rounded-full text-purple-600 bg-purple-50 text-xs font-bold border border-purple-100 uppercase tracking-wider">
                      {stitchingOption}
                    </span>
                  </div>

                  {/* Stitching Toggles */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStitchingOption("Unstitched")}
                      className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 ${stitchingOption === "Unstitched"
                        ? "bg-white border-purple-600 text-purple-600 ring-4 ring-purple-50/50 shadow-sm"
                        : "bg-white border-gray-100 text-gray-400 hover:bg-gray-50 hover:border-gray-200"
                        }`}
                    >
                      <span className="text-base font-bold">Unstitched</span>
                      <span className="text-xs font-medium opacity-80">(Fabric only)</span>
                    </button>
                    <button
                      onClick={() => setStitchingOption("Stitched")}
                      className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 ${stitchingOption === "Stitched"
                        ? "bg-white border-purple-600 text-purple-600 ring-4 ring-purple-50/50 shadow-sm"
                        : "bg-white border-gray-100 text-gray-400 hover:bg-gray-50 hover:border-gray-200"
                        }`}
                    >
                      <span className="text-base font-bold">Stitched</span>
                      <span className="text-xs font-medium opacity-80">(Custom Fit)</span>
                    </button>
                  </div>
                </div>

                {/* Stitched Options */}
                {stitchingOption === "Stitched" && (
                  <div className="space-y-8 animate-fade-in">
                    {/* Size Selection */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-gray-900 font-bold text-lg">Select Size</h3>
                          <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider flex items-center gap-1">
                            Fabric Only
                          </span>
                        </div>
                        <button
                          onClick={() => setIsSizeGuideOpen(true)}
                          className="text-purple-600 text-xs font-bold hover:underline bg-purple-50 px-3 py-1.5 rounded-lg transition-colors hover:bg-purple-100"
                        >
                          Size Guide
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:gap-3">


                        {/* Rest of Sizes */}
                        {stitchingSizes.filter(s => s !== "Fabric Only").map((size) => (
                          <div key={size} className="relative group/size">
                            <button
                              onClick={() => setStitchingSize(size)}
                              onMouseEnter={() => setHoveredSize(size)}
                              onMouseLeave={() => setHoveredSize(null)}
                              className={`w-16 sm:w-20 py-3 rounded-lg border transition-all duration-200 text-sm font-medium ${stitchingSize === size
                                ? "border-purple-600 bg-white text-purple-600 shadow-md ring-1 ring-purple-600 font-bold"
                                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                              {size}
                            </button>

                            {/* Tooltip - Laptop (Hover) & Mobile (Tap) */}
                            {hoveredSize === size && sizeMeasurements[size] && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[60] animate-fade-in pointer-events-none">
                                <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 min-w-[120px]">
                                  <h4 className="text-[#D4A373] font-bold text-lg mb-2">{size}</h4>
                                  <div className="space-y-1 text-gray-900 font-medium">
                                    <p className="flex justify-between items-center gap-4">Bust: <span className="font-bold">{sizeMeasurements[size].bust}</span></p>
                                    <p className="flex justify-between items-center gap-4">Waist: <span className="font-bold">{sizeMeasurements[size].waist}</span></p>
                                    <p className="flex justify-between items-center gap-4">Hip: <span className="font-bold">{sizeMeasurements[size].hip}</span></p>
                                  </div>
                                  <p className="text-gray-900 font-bold text-xs mt-3 select-none">*Units In Inches</p>

                                  {/* Tooltip Arrow */}
                                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Padding & Design Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Padding */}
                      <div>
                        <h3 className="text-gray-900 font-bold text-base mb-3">Padding Required? *</h3>
                        <div className="flex gap-3">
                          {["No", "Yes"].map((option) => {
                            const isSelected = paddingRequired === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setPaddingRequired(option)}
                                className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 ${isSelected
                                  ? "bg-gray-900 border-gray-900 text-white shadow-lg"
                                  : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                                  }`}
                              >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? "border-white bg-transparent" : "border-gray-300 bg-gray-50"
                                  }`}>
                                  {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                </div>
                                <span className="font-bold text-sm tracking-wide">{option}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Blouse Design */}
                      <div>
                        <h3 className="text-gray-900 font-bold text-base mb-3">Blouse Design *</h3>
                        <button
                          onClick={() => setIsBlouseModalOpen(true)}
                          className={`w-full py-3 px-4 rounded-xl border text-sm text-left flex justify-between items-center transition-all ${blouseDesign
                            ? "border-purple-600 bg-purple-50 text-purple-900"
                            : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                            }`}
                        >
                          <span className={`font-medium ${!blouseDesign && "opacity-70"}`}>
                            {blouseDesign || "Please Select Style"}
                          </span>
                          <ChevronRight size={18} className={`${blouseDesign ? "text-purple-600" : "text-gray-400"}`} />
                        </button>
                      </div>
                    </div>
                    {/* Return Policy Warning */}
                    <div className="pt-2">
                      <p className="text-red-500 text-xs font-bold leading-relaxed flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Note: Stitched or customized products are not eligible for returns or exchanges.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Saree Add-ons Section - Only for Saree */}
            {product.category?.toUpperCase() === 'SAREE' && (
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <h3 className="text-gray-900 font-bold text-lg mb-4">Enhance Your Look</h3>

                {/* Convert into Ready to Wear Saree */}
                <div className={`group relative bg-white p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${preDrapeSelected ? 'border-purple-600 ring-4 ring-purple-50' : 'border-gray-100 hover:border-purple-200'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={preDrapeSelected}
                          onChange={(e) => setPreDrapeSelected(e.target.checked)}
                          className="w-6 h-6 rounded-full border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-bold text-base">Ready to Wear Service</span>
                          <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Popular</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5">Professionally pre-stitched pleats for effortless draping</p>
                        <span className="text-purple-600 font-bold text-sm mt-1 block">+ ₹1,750</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="text-purple-600 text-xs font-bold hover:underline bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Learn More
                    </button>
                  </label>
                  {preDrapeSelected && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-red-500 text-xs font-bold leading-relaxed flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Note: Stitched or customized products are not eligible for returns or exchanges.
                      </p>
                    </div>
                  )}
                </div>

                {/* Satin Petticoat */}
                <div className={`group relative bg-white p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${petticoatSelected ? 'border-purple-600 ring-4 ring-purple-50' : 'border-gray-100 hover:border-purple-200'}`}>
                  <label className="flex items-start gap-5 cursor-pointer">
                    <div className="w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-purple-200 transition-colors shadow-sm">
                      <img
                        src="/petticoat.png"
                        alt="Satin Petticoat"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EPetticoat%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={petticoatSelected}
                            onChange={(e) => setPetticoatSelected(e.target.checked)}
                            className="w-6 h-6 rounded-full border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                          <span className="text-gray-900 font-bold text-base">Premium Satin Petticoat</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">High-quality satin fabric for a smooth finish and perfect fall</p>
                      <div className="bg-purple-50/50 p-2 rounded-lg inline-block">
                        <p className="text-gray-900 font-bold text-sm">
                          Add for <span className="text-purple-600 ml-1">₹1,245</span>
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-gray-900 font-semibold tracking-wide text-sm">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition border-r border-gray-200"
                  >-</button>
                  <span className="px-4 py-1 font-semibold text-gray-900 min-w-[2.5rem] text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.countInStock || 1, quantity + 1))}
                    disabled={quantity >= product.countInStock}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition border-l border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >+</button>
                </div>
              </div>
              {product.countInStock > 0 && product.countInStock <= 5 && (
                <p className="text-orange-600 text-sm font-bold flex items-center gap-2 animate-pulse">
                  <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                  Only {product.countInStock} left in stock - order soon!
                </p>
              )}
            </div>
          </div>

          <div className="hidden md:flex gap-3 mt-auto">
            <button
              className="flex-1 bg-primary-600 text-white text-base font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-primary-500/30 hover:bg-primary-700 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCartWithAddOns}
              disabled={!selectedSize && product.category?.toUpperCase() !== 'SAREE'}
            >
              {selectedSize || product.category?.toUpperCase() === 'SAREE' ? "Add to Cart" : "Select Size"}
            </button>
            <button
              className="flex-1 bg-gray-900 text-white text-base font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-black transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleBuyNow}
              disabled={!selectedSize || !product.inStock || product.countInStock <= 0}
            >
              {!product.inStock || product.countInStock <= 0 ? "Unavailable" : "Buy Now"}
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors ${isInWishlistState ? 'bg-red-50 border-red-200' : ''} `}
            >
              <Heart className={`w-5 h-5 ${isInWishlistState ? 'fill-red-500 text-red-500' : 'text-gray-600'} `} />
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <span className="text-gray-700 text-sm font-medium">{viewingCount} people are viewing this item. Don't wait!</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <p className="text-gray-900 text-sm">
                Estimated delivery : <span className="font-bold text-black">{(() => {
                  const date = new Date();
                  date.setDate(date.getDate() + 6);
                  return date.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
                })()}</span>
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-dashed border-gray-200 grid grid-cols-2 gap-x-4 gap-y-6 text-sm text-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-900 flex items-center justify-center flex-shrink-0">
                <Percent size={14} className="text-gray-900" />
              </div>
              <span className="font-medium leading-tight">100% Purchase Protection</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <RotateCcw size={22} className="text-gray-900" strokeWidth={1.5} />
              </div>
              <span className="font-medium leading-tight">This product is not returnable</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-900 flex items-center justify-center flex-shrink-0">
                <Star size={14} className="text-gray-900 fill-transparent" />
              </div>
              <span className="font-medium leading-tight">Assured Quality</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <Package size={22} className="text-gray-900" strokeWidth={1.5} />
              </div>
              <span className="font-medium leading-tight">Free shipping*</span>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="mt-10 border-t border-gray-100">
            {/* Product Details Accordion */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setActiveAccordion(activeAccordion === "details" ? "" : "details")}
                className="w-full py-5 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Product Details</span>
                {activeAccordion === "details" ? <Minus size={20} className="text-gray-400" /> : <Plus size={20} className="text-gray-400" />}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === "details" ? "max-h-[1000px] pb-6" : "max-h-0"} `}>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <span className="block text-gray-900 font-bold mb-1">Style No:</span>
                    <span className="text-gray-600">{product.styleNo || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-gray-900 font-bold mb-1">Design No:</span>
                    <span className="text-gray-600">{product.designNo || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-gray-900 font-bold mb-1">Color:</span>
                    <span className="text-gray-600">{product.color || product.category || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-gray-900 font-bold mb-1">Fabric:</span>
                    <span className="text-gray-600">{product.fabric || "Premium Fabric"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-gray-900 font-bold mb-1">Work:</span>
                    <span className="text-gray-600">{product.work || "Handcrafted Details"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-gray-900 font-bold mb-1">Pack Contains:</span>
                    <span className="text-gray-600">{product.packContains || "1 Product"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-gray-900 font-bold mb-1">Manufactured / Packed by:</span>
                    <span className="text-gray-600">{product.manufacturedBy || "Sheshri Fashion"}</span>
                  </div>
                  {product.productSpeciality && (
                    <div className="col-span-2 mt-2">
                      <span className="block text-gray-900 font-bold mb-1">Product Speciality:</span>
                      <p className="text-gray-600 leading-relaxed italic">
                        {product.productSpeciality}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Style & Fit Tips Accordion */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setActiveAccordion(activeAccordion === "tips" ? "" : "tips")}
                className="w-full py-5 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Style & Fit Tips</span>
                {activeAccordion === "tips" ? <Minus size={20} className="text-gray-400" /> : <Plus size={20} className="text-gray-400" />}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === "tips" ? "max-h-[500px] pb-6" : "max-h-0"} `}>
                <div className="space-y-4 text-sm">
                  {product.styleTips && (
                    <div>
                      <span className="block text-gray-900 font-bold mb-1">Style Tips:</span>
                      <p className="text-gray-600 leading-relaxed">{product.styleTips}</p>
                    </div>
                  )}
                  {product.fitTips && (
                    <div>
                      <span className="block text-gray-900 font-bold mb-1">Fit Tips:</span>
                      <p className="text-gray-600 leading-relaxed">{product.fitTips}</p>
                    </div>
                  )}
                  {!product.styleTips && !product.fitTips && (
                    <p className="text-gray-500 italic">Style and fit tips coming soon for this product.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping & Returns Accordion */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setActiveAccordion(activeAccordion === "shipping" ? "" : "shipping")}
                className="w-full py-5 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Shipping & Returns</span>
                {activeAccordion === "shipping" ? <Minus size={20} className="text-gray-400" /> : <Plus size={20} className="text-gray-400" />}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === "shipping" ? "max-h-[500px] pb-6" : "max-h-0"} `}>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Exchange and returns are available for products within 5 days of delivery.
                  Items must be in original condition with all tags intact.
                </p>
                <Link to="/returns-policy" className="inline-block mt-3 text-sm font-semibold text-primary-600 hover:underline">
                  Read more about return policy
                </Link>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setActiveAccordion(activeAccordion === "faqs" ? "" : "faqs")}
                className="w-full py-5 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">FAQs</span>
                {activeAccordion === "faqs" ? <Minus size={20} className="text-gray-400" /> : <Plus size={20} className="text-gray-400" />}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === "faqs" ? "max-h-[500px] pb-6" : "max-h-0"} `}>
                <div className="space-y-4 text-sm mt-2">
                  <div>
                    <p className="font-bold text-gray-900 mb-1">How can I track my order?</p>
                    <p className="text-gray-600">Once shipped, you will receive a tracking link via email and SMS.</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Do you offer international shipping?</p>
                    <p className="text-gray-600">Yes, we deliver across the globe with our courier partners.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add-on Items Section */}
      {addOns.length > 0 && (
        <div className="mt-12 lg:mt-16 bg-gray-50/50 rounded-3xl p-6 md:p-10 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                {isAddOnMapping ? "Complete the Look" : "You May Also Like"}
              </h2>
              <p className="text-gray-500">
                {isAddOnMapping
                  ? "Add these essential items to your order for a perfect ensemble."
                  : "Explore more stunning pieces from our latest collection."}
              </p>
            </div>
            {selectedAddOns.length > 0 && (
              <div className="bg-primary-50 text-primary-700 px-6 py-3 rounded-2xl font-semibold flex items-center gap-3 animate-slide-in-right">
                <CheckCircle2 size={20} />
                <span>{selectedAddOns.length} Add-on{selectedAddOns.length > 1 ? 's' : ''} Selected</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((item) => {
              const isSelected = !!selectedAddOns.find(a => a._id === item._id);
              // Manual add-ons are subdocuments and don't have their own product page or category field usually
              const isManualAddOn = !item.category;

              return (
                <div
                  key={item._id}
                  onClick={() => toggleAddOn(item)}
                  className={`group relative bg-white p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${isSelected ? 'border-primary-500 ring-4 ring-primary-50' : 'border-transparent hover:border-gray-200'
                    } `}
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                      <img
                        src={item.images?.[0] || item.image || "https://placehold.co/400x600?text=No+Image"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col pt-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors line-clamp-1">{item.name}</h3>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
                          } `}>
                          {isSelected && <CheckCircle2 size={16} className="text-white" />}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-auto line-clamp-2 leading-tight">
                        {isManualAddOn ? (item.description || "Add-on Item") : item.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-purple-600">₹{item.price.toLocaleString()}</span>
                        {!isManualAddOn && (
                          <Link
                            to={`/product/${item._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-400 hover:text-primary-600 transition-colors p-1"
                          >
                            <ChevronRight size={20} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && activeMedia.type === "image" && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X size={32} />
          </button>
          <img
            src={activeMedia.src}
            className="max-w-full max-h-full object-contain rounded shadow-2xl scale-100" // reset any scale
            alt="Full View"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />
        </div>
      )}

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="mt-12 md:mt-20">
          <BestsellerSection title="Similar Products" products={similarProducts} bgColor="bg-white" />
        </div>
      )}

      {/* Blouse Design Modal */}
      {isBlouseModalOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsBlouseModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">Select Blouse Design</h3>
              <button
                onClick={() => setIsBlouseModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {blouseDesigns.map((design) => (
                  <div
                    key={design.id}
                    onClick={() => {
                      setBlouseDesign(design.name);
                      setIsBlouseModalOpen(false);
                    }}
                    className={`group cursor-pointer rounded-2xl border-2 transition-all overflow-hidden bg-white hover:shadow-lg ${blouseDesign === design.name
                      ? 'border-purple-600 ring-2 ring-purple-100'
                      : 'border-gray-100 hover:border-purple-200'
                      }`}
                  >
                    <div className="aspect-square overflow-hidden bg-gray-50 relative">
                      <img
                        src={design.image}
                        alt={design.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${blouseDesign === design.name ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                          }`}>
                          {blouseDesign === design.name && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          #{design.id}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 leading-tight uppercase line-clamp-2">
                        {design.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 animate-slide-up pb-safe">
        {/* Top Info Bar */}
        <div className="px-4 py-2 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Eye className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-medium">{viewingCount} people are viewing this item. Don't wait!</span>
          </div>
          <button onClick={handleToggleWishlist} className="p-1 -mr-1">
            <Heart className={`w-4 h-4 ${isInWishlistState ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 bg-white text-gray-900 text-sm font-bold px-4 py-3 rounded border border-gray-900 hover:bg-gray-50 uppercase tracking-wide transition-colors"
              onClick={handleBuyNow}
              disabled={!selectedSize || !product.inStock || product.countInStock <= 0}
            >
              BUY IT NOW
            </button>
            <button
              className="flex-1 bg-gray-900 text-white text-sm font-bold px-4 py-3 rounded border border-gray-900 hover:bg-black uppercase tracking-wide transition-colors"
              onClick={handleAddToCartWithAddOns}
              disabled={!selectedSize && product.category?.toUpperCase() !== 'SAREE'}
            >
              ADD TO CART
            </button>
          </div>

          {/* Trust Badges */}
          <div className="text-center">
            <p className="text-[10px] text-gray-500 font-medium">Free Shipping within India* Easy Returns*</p>
          </div>
        </div>
      </div>
    </div>
  );
}
