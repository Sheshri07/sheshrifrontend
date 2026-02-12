import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Smartphone } from "lucide-react";

export default function Footer() {
  const location = useLocation();

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
    <footer className="bg-primary-50/20 border-t border-primary-100/50 pt-16 pb-8 text-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-2 gap-y-8 md:gap-8 mb-8 md:mb-12">
          {/* Column 1: Designer Wear */}
          <div>
            <h4 className="font-serif font-bold text-gray-900 mb-2 md:mb-6 uppercase tracking-wider text-[10px] md:text-xs">Designer Wear</h4>
            <ul className="space-y-1.5 md:space-y-3 text-gray-500 text-[10px] md:text-sm">
              <li><Link to="/products" onClick={(e) => handleNavClick(e, "/products")} className="hover:text-primary-600 transition">All Products</Link></li>
              <li><Link to="/products?category=suit" onClick={(e) => handleNavClick(e, "/products?category=suit")} className="hover:text-primary-600 transition">Suits</Link></li>
              <li><Link to="/products?category=kurti" onClick={(e) => handleNavClick(e, "/products?category=kurti")} className="hover:text-primary-600 transition">Kurtis</Link></li>
              <li><Link to="/products?category=dupatta" onClick={(e) => handleNavClick(e, "/products?category=dupatta")} className="hover:text-primary-600 transition">Dupattas</Link></li>
              <li><Link to="/products?category=saree" onClick={(e) => handleNavClick(e, "/products?category=saree")} className="hover:text-primary-600 transition">Sarees</Link></li>
              <li><Link to="/products?category=western%20dress" onClick={(e) => handleNavClick(e, "/products?category=western%20dress")} className="hover:text-primary-600 transition">Western Dress</Link></li>
            </ul>
          </div>

          {/* Column 2: About Us */}
          <div>
            <h4 className="font-serif font-bold text-gray-900 mb-2 md:mb-6 uppercase tracking-wider text-[10px] md:text-xs">About Us</h4>
            <ul className="space-y-1.5 md:space-y-3 text-gray-500 text-[10px] md:text-sm">
              <li><Link to="/about" onClick={(e) => handleNavClick(e, "/about")} className="hover:text-primary-600 transition">About Sheshri</Link></li>
              <li><Link to="/contact" onClick={(e) => handleNavClick(e, "/contact")} className="hover:text-primary-600 transition">Contact Us</Link></li>
              <li><Link to="/careers" onClick={(e) => handleNavClick(e, "/careers")} className="hover:text-primary-600 transition">Careers</Link></li>
              <li><Link to="/media" onClick={(e) => handleNavClick(e, "/media")} className="hover:text-primary-600 transition">Press & Media</Link></li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div>
            <h4 className="font-serif font-bold text-gray-900 mb-2 md:mb-6 uppercase tracking-wider text-[10px] md:text-xs">Policies</h4>
            <ul className="space-y-1.5 md:space-y-3 text-gray-500 text-[10px] md:text-sm">
              <li><Link to="/shipping" onClick={(e) => handleNavClick(e, "/shipping")} className="hover:text-primary-600 transition">Shipping & Delivery</Link></li>
              <li><Link to="/returns" onClick={(e) => handleNavClick(e, "/returns")} className="hover:text-primary-600 transition">Returns & Exchange</Link></li>
              <li><Link to="/terms" onClick={(e) => handleNavClick(e, "/terms")} className="hover:text-primary-600 transition">Terms & Conditions</Link></li>
              <li><Link to="/privacy" onClick={(e) => handleNavClick(e, "/privacy")} className="hover:text-primary-600 transition">Privacy Policy</Link></li>

            </ul>
          </div>

          {/* Column 4: My Account */}
          <div>
            <h4 className="font-serif font-bold text-gray-900 mb-2 md:mb-6 uppercase tracking-wider text-[10px] md:text-xs">My Account</h4>
            <ul className="space-y-1.5 md:space-y-3 text-gray-500 text-[10px] md:text-sm">
              <li><Link to="/login" onClick={(e) => handleNavClick(e, "/login")} className="hover:text-primary-600 transition">Login / Register</Link></li>
              <li><Link to="/cart" onClick={(e) => handleNavClick(e, "/cart")} className="hover:text-primary-600 transition">Shopping Bag</Link></li>
              <li><Link to="/wishlist" onClick={(e) => handleNavClick(e, "/wishlist")} className="hover:text-primary-600 transition">Wishlist</Link></li>
              <li><Link to="/orders" onClick={(e) => handleNavClick(e, "/orders")} className="hover:text-primary-600 transition">Order History</Link></li>
            </ul>
          </div>

          {/* Column 5: Connect & App */}
          <div className="col-span-2 lg:col-span-1 mt-4 lg:mt-0">
            <h4 className="font-serif font-bold text-gray-900 mb-2 md:mb-6 uppercase tracking-wider text-[10px] md:text-xs">Get the App</h4>
            <div className="flex flex-row md:flex-col gap-3 mb-6 md:mb-8">
              <button className="flex items-center gap-2 md:gap-3 bg-black text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-gray-800 transition">
                <Smartphone size={16} className="md:w-5 md:h-5" />
                <div className="text-left">
                  <div className="text-[8px] md:text-[10px] leading-tight">Download on the</div>
                  <div className="text-[10px] md:text-xs font-bold">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-2 md:gap-3 bg-black text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-gray-800 transition">
                <div className="text-xl md:text-2xl leading-none">▶</div>
                <div className="text-left">
                  <div className="text-[8px] md:text-[10px] leading-tight">GET IT ON</div>
                  <div className="text-[10px] md:text-xs font-bold">Google Play</div>
                </div>
              </button>
            </div>

            <h4 className="font-serif font-bold text-gray-900 mb-2 md:mb-4 uppercase tracking-wider text-[10px] md:text-xs">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white transition">
                <Facebook size={12} className="md:w-4 md:h-4" />
              </a>
              <a href="https://www.instagram.com/sheshri07/" target="_blank" rel="noopener noreferrer" className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white transition">
                <Instagram size={12} className="md:w-4 md:h-4" />
              </a>

              <a href="#" className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white transition">
                <Youtube size={12} className="md:w-4 md:h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info Bar - Redesigned */}
        {/* Contact Info Bar - Redesigned */}
        <div className="border-t border-gray-100 py-4 md:py-10 mt-4 md:mt-12 bg-white/40 backdrop-blur-sm rounded-3xl mb-4 md:mb-12 shadow-sm border-x border-b overflow-hidden">
          <div className="flex flex-row flex-nowrap justify-between md:justify-around items-start md:items-center gap-2 md:gap-8 text-gray-700 px-2 md:px-6 overflow-x-auto md:overflow-visible scrollbar-hide">
            <div className="flex flex-col items-center gap-1 md:gap-3 group cursor-pointer flex-1 min-w-[60px]">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-primary-100/50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1 shadow-sm">
                <Mail size={14} className="md:w-6 md:h-6" />
              </div>
              <span className="font-medium tracking-wide text-[8px] md:text-sm text-center break-all">sheshri07@gmail.com</span>
            </div>

            <div className="hidden md:block h-12 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

            <div className="flex flex-col items-center gap-1 md:gap-3 group cursor-pointer flex-1 min-w-[60px]">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-primary-100/50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1 shadow-sm">
                <Phone size={14} className="md:w-6 md:h-6" />
              </div>
              <span className="font-medium tracking-wide text-[8px] md:text-sm text-center whitespace-nowrap">+91 7838418308</span>
            </div>

            <div className="hidden md:block h-12 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

            <div className="flex flex-col items-center gap-1 md:gap-3 group cursor-pointer flex-1 min-w-[60px]">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-primary-100/50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1 shadow-sm">
                <MapPin size={14} className="md:w-6 md:h-6" />
              </div>
              <span className="font-medium tracking-wide text-[8px] md:text-sm text-center leading-tight">Puri High Street, Faridabad</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Designer - Redesigned */}
        <div className="border-t border-gray-100 pt-6 md:pt-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 pb-6">
          <div className="flex flex-col gap-1 md:gap-2 items-center md:items-start text-center md:text-left">
            <p className="text-gray-400 text-[8px] md:text-[10px] font-medium tracking-widest uppercase mb-1">
              © 2025 Sheshri Fashion. All Rights Reserved.
            </p>
            {/* DESIGNER CREDIT */}
            <div className="flex items-center gap-2 group justify-center md:justify-start">
              <span className="text-gray-400 text-[10px] md:text-xs font-light">Crafted with passion by</span>
              <a
                href="#"
                className="relative overflow-hidden group/link flex items-center"
              >
                <span className="text-[10px] md:text-sm font-black tracking-tighter bg-gradient-to-r from-primary-600 via-primary-800 to-primary-950 bg-clip-text text-transparent transform transition-all duration-500 group-hover/link:scale-105">
                  FIVRA
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary-600 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500 origin-left"></div>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <img src="https://cdn-icons-png.flaticon.com/512/349/349221.png" alt="Visa" className="h-4 md:h-5 w-auto" />
            <img src="https://cdn-icons-png.flaticon.com/512/349/349228.png" alt="Mastercard" className="h-4 md:h-5 w-auto" />
            <img src="https://cdn-icons-png.flaticon.com/512/349/349230.png" alt="Amex" className="h-4 md:h-5 w-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-2.5 md:h-3 w-auto" />
          </div>
        </div>

        {/* SEO Links Block */}
        <div className="mt-8 pt-8 border-t border-gray-100 hidden lg:block text-[10px] text-gray-400 leading-relaxed text-justify">
          <p>
            Women's Suits | Designer Kurtis | Dupatta | Sarees | Wedding Sarees | Silk Sarees | Georgette Sarees | Chiffon Sarees | Net Sarees | Printed Sarees | Embroidered Sarees | Party Wear Sarees | Bridal Sarees | Salwar Kameez | Anarkali Suits | Palazzo Suits | Sharara Suits | Straight Suits | Dhoti Suits | Indian Ethnic Wear | Festive Collection | New Arrivals | Best Sellers | Sale
          </p>
        </div>
      </div>
    </footer>
  );
}
