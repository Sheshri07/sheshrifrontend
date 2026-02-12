import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Search, ShoppingBag, User, Heart, ChevronDown, Shield, Sparkles, ArrowRight, ChevronRight, Package } from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [placeholderText, setPlaceholderText] = useState("Search for Suits");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen) {
      getAllProducts().then(setAllProducts).catch(err => console.error(err));
    }
  }, [searchOpen]);

  const [dynamicNavCategories, setDynamicNavCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        const mappedCats = cats
          .map(c => ({
            name: c.name,
            link: `/products?category=${c.name.trim().toLowerCase()}`,
            image: c.image || "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=200",
            isNew: false
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setDynamicNavCategories(mappedCats);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const navCategories = dynamicNavCategories.length > 0
    ? dynamicNavCategories
    : [
      { name: "Suits", link: "/products?category=suit", image: "https://img.theloom.in/blog/wp-content/uploads/2022/08/binu8746-e1659700914390.png", isNew: false },
      { name: "Kurtis", link: "/products?category=kurti", image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=200", isNew: false },
      { name: "Dupattas", link: "/products?category=dupatta", image: "https://images.unsplash.com/photo-1621111848501-8d3be2465241?q=80&w=200", isNew: false },
      { name: "Sarees", link: "/products?category=saree", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=200", isNew: false },
      { name: "Western Dress", link: "/products?category=western", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=200", isNew: true },
    ];

  // Animated placeholder text synced with categories
  useEffect(() => {
    const placeholderItems = navCategories.map(c => c.name);
    if (placeholderItems.length === 0) return;

    let categoryIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    const typeText = () => {
      const currentCategory = placeholderItems[categoryIndex];
      if (!currentCategory) return;
      const baseText = "Search for ";

      if (!isDeleting) {
        setPlaceholderText(baseText + currentCategory.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentCategory.length) {
          timeout = setTimeout(() => {
            isDeleting = true;
            typeText();
          }, 2000);
          return;
        }
        timeout = setTimeout(typeText, 100);
      } else {
        setPlaceholderText(baseText + currentCategory.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          categoryIndex = (categoryIndex + 1) % placeholderItems.length;
          timeout = setTimeout(typeText, 500);
          return;
        }
        timeout = setTimeout(typeText, 50);
      }
    };

    timeout = setTimeout(typeText, 500);
    return () => clearTimeout(timeout);
  }, [navCategories]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const handleProductClick = (id) => {
    setSearchOpen(false);
    navigate(`/product/${id}`);
  };

  const handleNavClick = (e, path) => {
    // Check if we're already on this path
    const currentPath = location.pathname + location.search;
    const targetPath = path;

    if (currentPath === targetPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <>

      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-primary-50/90 backdrop-blur-xl shadow-xl py-1 md:py-2"
          : "bg-shuttle-purple/10 backdrop-blur-lg border-b border-white/20 py-2 md:py-4"
          }`}
      >
        <div className="w-full px-3 md:container md:mx-auto md:px-8">
          <div className="flex items-center justify-between h-20 md:h-24 relative">
            {/* Mobile: Hamburger Menu */}
            <div className="md:hidden flex items-center">
              <button
                className="text-gray-800 p-1 -ml-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>

            {/* Mobile: Centered Logo */}
            <div className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <Link to="/" className="flex-shrink-0" onClick={(e) => handleNavClick(e, "/")}>
                <img src="/logo_v2.png" alt="Sheshri" className="h-20 w-auto object-contain" />
              </Link>
            </div>

            {/* Desktop Logo (Hidden on Mobile) */}
            <Link to="/" className="hidden md:block" onClick={(e) => handleNavClick(e, "/")}>
              <img src="/logo_v2.png" alt="Sheshri" className="h-28 w-auto object-contain" />
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
              <input
                type="text"
                placeholder="Search for style, collections & more..."
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-md py-2.5 pl-4 pr-10 text-sm focus:outline-none transition-all"
                onClick={() => setSearchOpen(true)}
                readOnly
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2.5 md:gap-6 md:mr-0">

              <Link to="/orders" className="hidden md:block text-gray-700 hover:text-black transition">
                <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  Order History
                </span>
              </Link>

              <div className="h-4 w-px bg-gray-300 hidden md:block"></div>

              {user ? (
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="md:hidden">
                    <NotificationBell iconSize={18} buttonClassName="p-1" />
                  </div>
                  <div className="hidden md:block">
                    <NotificationBell />
                  </div>

                  <div className="relative group flex items-center gap-2 cursor-pointer py-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold border border-gray-200 text-xs md:text-sm">
                      {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-700">{user.username}</span>

                    <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-md shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 z-50">
                      <Link
                        to="/my-profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors border-b border-gray-50"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      >
                        Logout
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex flex-col items-center group">
                  <User className="w-5 h-5 text-gray-700 group-hover:text-black transition" />
                  <span className="text-[10px] uppercase font-medium mt-1 text-gray-600 hidden md:block group-hover:text-black">Log in</span>
                </Link>
              )}

              {/* Admin Portal Button - Only for Admin Users */}
              {user && (user.role === 'admin' || user.isAdmin) && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-2 py-1 md:px-3 md:py-1.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-[10px] md:text-xs font-semibold"
                >
                  <Shield size={14} className="md:w-4 md:h-4" />
                  <span className="hidden lg:inline">Admin</span>
                </Link>
              )}

              <Link to="/wishlist" className="flex flex-col items-center group hidden md:flex">
                <Heart className="w-5 h-5 text-gray-700 group-hover:text-black transition" />
                <span className="text-[10px] uppercase font-medium mt-1 text-gray-600 group-hover:text-black">Wishlist</span>
              </Link>

              <Link to="/cart" className="flex flex-col items-center group relative">
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 md:w-5 md:h-5 text-gray-700 group-hover:text-black transition" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] md:text-[10px] font-bold rounded-full h-3.5 w-3.5 md:h-4 md:w-4 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] uppercase font-medium mt-1 text-gray-600 hidden md:block group-hover:text-black">Cart</span>
              </Link>

            </div>
          </div>

          {/* Mobile Search Bar - Below Main Navbar */}
          <div className="md:hidden pb-2 px-2 mt-2">
            <div className="relative">
              <input
                type="text"
                placeholder={placeholderText}
                className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-gray-300 transition-all"
                onClick={() => setSearchOpen(true)}
                readOnly
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Category Navigation (Desktop) */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-6 lg:space-x-12 py-3.5">
              {navCategories.map((cat, index) => (
                <li key={index}>
                  <Link
                    to={cat.link}
                    onClick={(e) => handleNavClick(e, cat.link)}
                    className="group relative text-xs lg:text-[13px] font-bold tracking-[0.15em] hover:text-primary-600 transition-all uppercase text-gray-800 py-2"
                  >
                    {cat.name}
                    {cat.isNew && (
                      <span className="absolute -top-2 -right-6 flex items-center gap-0.5 bg-gradient-to-r from-primary-500 to-primary-600 text-[8px] text-white px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                        <Sparkles size={8} /> NEW
                      </span>
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div className="relative bg-white w-[85%] max-w-sm h-full shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-left duration-500 ease-out border-r border-gray-100">
            {/* Header with Background Pattern */}
            <div className="relative p-6 border-b border-gray-50 bg-gradient-to-br from-primary-50 to-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/30 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="relative flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <img src="/logo_v2.png" alt="Sheshri" className="h-16 w-auto object-contain" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Enhanced User Profile / Login */}
              <div className="mt-8">
                {user ? (
                  <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-primary-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-primary-500">Welcome back</p>
                      <p className="font-serif font-bold text-gray-900 text-lg leading-tight">{user.username}</p>
                      <button onClick={handleLogout} className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter hover:text-red-500 transition-colors mt-0.5">Logout Account</button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="group flex items-center justify-between w-full p-4 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl transition-all hover:bg-black overflow-hidden relative"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">Login / Register</span>
                    <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-600 to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </Link>
                )}
              </div>
            </div>

            {/* Menu List */}
            <div className="flex-1 px-4 py-8 overflow-y-auto">
              <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-100"></span>
                Collections
              </h3>

              <div className="space-y-4">
                {navCategories.map((cat, index) => (
                  <Link
                    key={index}
                    to={cat.link}
                    className="group block relative animate-in fade-in slide-in-from-left duration-700"
                    style={{ animationDelay: `${200 + index * 50}ms` }}
                    onClick={(e) => {
                      handleNavClick(e, cat.link);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/50 group-hover:bg-primary-50 transition-all border border-gray-100/50 group-hover:border-primary-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm overflow-hidden border border-gray-100 transform transition-transform group-hover:scale-110">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-900 group-hover:text-primary-700 transition-colors uppercase tracking-widest leading-none mb-0.5">{cat.name}</p>
                          <p className="text-[8px] text-gray-400 font-medium tracking-tighter">View Store</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-500 transition-all group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Quick Links Section */}
              <div className="mt-10 px-2 pt-10 border-t border-gray-50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-gray-100"></span>
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/orders"
                    className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="w-6 h-6 opacity-50" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Orders</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="w-6 h-6 opacity-50" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Wishlist</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer Contact */}
            <div className="p-8 bg-gray-50 mt-auto border-t border-gray-100">
              <div className="flex justify-center gap-6 mb-6">
                {['Instagram', 'Facebook', 'WhatsApp'].map(social => (
                  <span key={social} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary-500 cursor-pointer transition">
                    {social}
                  </span>
                ))}
              </div>
              <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                © 2026 SHESHRI CLOTHING<br />
                Handcrafted Luxury
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-md flex items-start justify-center pt-10 md:pt-20 animate-fade-in" onClick={() => setSearchOpen(false)}>
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden relative mx-3 md:mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-3 md:p-4 border-b border-gray-100 flex items-center">
              <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2 md:mr-3" />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={handleSearch}
                className="flex-1 text-sm md:text-lg outline-none placeholder:text-gray-400"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full">
                <X className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh]">
              {searchQuery && searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map(product => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product._id || product.id)}
                      className="flex items-center gap-3 md:gap-4 p-2 md:p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition group"
                    >
                      <img src={product.image} alt={product.name} className="w-12 h-16 md:w-16 md:h-20 object-cover rounded-md" />
                      <div>
                        <h4 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-primary-600 transition">{product.name}</h4>
                        <p className="text-gray-500 text-xs md:text-sm mt-1">₹{product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8 md:py-12 text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <div>
                  <h3 className="text-[10px] md:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">Trending Searches</h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {["Suit", "Kurti", "Dupatta", "Saree", "Western"].map(tag => (
                      <button
                        key={tag}
                        className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm transition"
                        onClick={() => { setSearchQuery(tag); handleSearch({ target: { value: tag } }); }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
