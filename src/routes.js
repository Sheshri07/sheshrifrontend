import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Collections from "./pages/Collections";
import About from "./pages/About";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import ProductList from "./pages/admin/ProductList";
import ProductEdit from "./pages/admin/ProductEdit";
import OrderList from "./pages/admin/OrderList";
import OrderDetails from "./pages/admin/OrderDetails";
import Customers from "./pages/admin/Customers";
import AllUsers from "./pages/admin/AllUsers";
import UserDetails from "./pages/admin/UserDetails";
import UserEdit from "./pages/admin/UserEdit";
// import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Messages from "./pages/admin/Messages";
import Banners from "./pages/admin/Banners";
import Categories from "./pages/admin/Categories";
import JobList from "./pages/admin/JobList";
import JobEdit from "./pages/admin/JobEdit";
import Checkout from "./pages/Checkout";

import Wishlist from "./pages/Wishlist";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
import CustomerOrderDetails from "./pages/CustomerOrderDetails";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import InfoPage from "./pages/InfoPage";
import Contact from "./pages/Contact";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnsPolicy from "./pages/ReturnsPolicy";
import BookAppointment from "./pages/BookAppointment";
import CustomFitting from "./pages/CustomFitting";
import StoreDetails from "./pages/StoreDetails";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";

function RoutesConfig() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/visit-store" element={<StoreDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Footer Links - Functional Placeholders */}
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Protected Routes - Require Authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/order/:id" element={<CustomerOrderDetails />} />
          <Route path="/track/:orderId" element={<OrderTracking />} />
        </Route>

        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/media" element={<InfoPage title="Press & Media" />} />
        <Route path="/shipping" element={<InfoPage title="Shipping & Delivery"
          toc={[
            { name: 'Introduction', id: 'introduction' },
            { name: 'Domestic Delivery', id: 'data-protection' },
            { name: 'International Logistics', id: 'your-rights' }
          ]}
          content={`
          <div class="space-y-12">
            <section id="introduction" class="space-y-6">
              <p class="text-xl text-gray-800 font-serif italic">Craftsmanship delivered with precision to your doorstep.</p>
            </section>
            
            <section id="data-protection" class="space-y-6">
              <h3 class="text-2xl font-serif font-bold text-gray-900">Domestic Delivery (India)</h3>
              <p>We provide complimentary standard shipping on all orders within India. Every package is insured and tracked for your peace of mind.</p>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Processing Time:</strong> 2-3 business days</li>
                <li><strong>Delivery Time:</strong> 5-7 business days</li>
                <li><strong>Courier Partners:</strong> Blue Dart, Delhivery, and Ecom Express</li>
              </ul>
            </section>

            <section id="your-rights" class="space-y-6">
              <h3 class="text-2xl font-serif font-bold text-gray-900">International Logistics</h3>
              <p>We bridge the gap between Indian heritage and the world, shipping to over 150 countries.</p>
              <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p class="text-sm font-medium">Flat Rate International Shipping: $45 USD per order.</p>
              </div>
            </section>
          </div>
        `} />} />
        <Route path="/returns" element={<InfoPage title="Returns & Exchange"
          toc={[
            { name: 'Introduction', id: 'introduction' },
            { name: 'Return Window', id: 'data-protection' },
            { name: 'Non-Returnable Items', id: 'your-rights' }
          ]}
          content={`
          <div class="space-y-12">
            <section id="introduction" class="space-y-6">
                <p class="text-xl text-gray-800 font-serif italic">Seamless returns for an effortless shopping experience.</p>
            </section>
            
            <section id="data-protection" class="space-y-6">
              <h3 class="text-2xl font-serif font-bold text-gray-900">Return Window</h3>
              <p>We accept returns within 7 calendar days of delivery. The item must be in its original, pristine condition with all Sheshri tags intact.</p>
            </section>

            <section id="your-rights" class="space-y-6">
              <h3 class="text-2xl font-serif font-bold text-gray-900">Non-Returnable Items</h3>
              <p>Due to their bespoke nature, the following items are final sale:</p>
              <ul class="list-disc pl-5 space-y-3">
                <li>Custom-tailored or altered garments</li>
                <li>Accessories and jewelry for hygiene reasons</li>
                <li>Final Sale / Clearance collection items</li>
              </ul>
            </section>
          </div>
        `} />} />
        <Route path="/terms" element={<InfoPage title="Terms & Conditions"
          toc={[
            { name: 'Introduction', id: 'introduction' },
            { name: 'Intellectual Property', id: 'data-protection' },
            { name: 'Support', id: 'contact-us' }
          ]}
          content={`
          <div class="space-y-12">
            <section id="introduction" class="space-y-6">
              <h3 class="text-2xl font-serif font-bold text-gray-900">1. Acceptance of Terms</h3>
              <p>By accessing the Sheshri Fashion platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.</p>
            </section>

            <section id="data-protection" class="space-y-6">
              <h3 class="text-2xl font-serif font-bold text-gray-900">2. Intellectual Property</h3>
              <p>All designs, textile patterns, and visual media on this platform are the exclusive intellectual property of Sheshri Fashion and are protected under international copyright laws.</p>
            </section>

            <section id="contact-us" class="space-y-4">
               <h3 class="text-2xl font-serif font-bold text-gray-900">3. Support</h3>
               <p>For any queries regarding these terms, please contact our legal team.</p>
            </section>
          </div>
        `} />} />
        <Route path="/privacy" element={<InfoPage title="Privacy Policy"
          toc={[
            { name: 'Introduction', id: 'introduction' },
            { name: 'Information Security', id: 'data-protection' },
            { name: 'Your Data Rights', id: 'your-rights' }
          ]}
          content={`
          <div class="space-y-12">
            <section id="introduction" class="space-y-6">
              <h3 class="text-2xl font-serif font-bold text-gray-900">1. Data Governance</h3>
              <p class="text-lg">Your personal information is handled with the utmost discretion. We collect data solely to provide a personalized luxury experience and to facilitate seamless logistics.</p>
            </section>

            <section id="data-protection" class="space-y-6">
              <h3 class="text-2xl font-serif font-bold text-gray-900">2. Information Security</h3>
              <p>We implement advanced technical safeguards, including AES-256 encryption, to protect your sensitive data from unauthorized access or disclosure.</p>
            </section>

            <section id="your-rights" class="space-y-6">
              <h3 class="text-2xl font-serif font-bold text-gray-900">3. Your Data Rights</h3>
              <p>You have the legal right to access, rectify, or request the deletion of your personal information at any time through your account dashboard.</p>
            </section>
          </div>
        `} />} />

        {/* New Feature Routes */}
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/returns-policy" element={<ReturnsPolicy />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/custom-fitting" element={<CustomFitting />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes */}
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="banners" element={<Banners />} />
          <Route path="categories" element={<Categories />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="product/create" element={<ProductEdit />} />
          <Route path="product/:id/edit" element={<ProductEdit />} />
          <Route path="orderlist" element={<OrderList />} />
          <Route path="order/:id" element={<OrderDetails />} />
          <Route path="customers" element={<Customers />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="users/:id/edit" element={<UserEdit />} />
          <Route path="messages" element={<Messages />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="job/create" element={<JobEdit />} />
          <Route path="job/:id/edit" element={<JobEdit />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default RoutesConfig;
