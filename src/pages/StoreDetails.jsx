import React from 'react';
import { MapPin, Clock, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const StoreDetails = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px]">
                <img
                    src="/store-front.png"
                    alt="Sheshri Fashion Store Front"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
                    <span className="text-white/90 text-sm md:text-base tracking-[0.2em] uppercase font-bold mb-4">
                        Experience Luxury In Person
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                        Sheshri Fashion & Clothing
                    </h1>
                    <Link
                        to="/book-appointment"
                        className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
                    >
                        Book an Appointment
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* About */}
                        <section>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">About Our Store</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Located in the heart of Faridabad, Sheshri Fashion is more than just a boutique—it's a destination for style and elegance. Our flagship store showcases our complete range of handcrafted sarees, luxury lehengas, and contemporary ethnic wear.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Visit us to experience the premium feel of our fabrics, receive personalized styling consultations, and find the perfect outfit for your special occasions. Our dedicated staff is here to provide you with an exceptional shopping experience.
                            </p>
                        </section>

                        {/* Gallery Grid (Simulated with placeholders/existing images) */}
                        <section>
                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">Store Gallery</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-2xl overflow-hidden aspect-video shadow-md">
                                    <img src="/store-front.png" alt="Store Front" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="rounded-2xl overflow-hidden aspect-video shadow-md bg-gray-100 flex items-center justify-center">
                                    <img src="/store-logo.png" alt="Store Interior" className="w-1/2 h-auto object-contain hover:scale-105 transition-transform duration-500" />
                                </div>
                            </div>
                        </section>

                        {/* Map */}
                        <section>
                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">Location</h3>
                            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-[400px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14030.141705663673!2d77.31682496977539!3d28.411656900000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cddbe68e82a6f%3A0x6b772426cd32a537!2sSector%2016%2C%20Faridabad%2C%20Haryana!5e0!3m2!1sen!2sin!4v1705510000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Store Location Map"
                                ></iframe>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-3xl p-8 sticky top-24 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Store Information</h3>

                            <div className="space-y-8">
                                {/* Address */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Address</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                            Shop No. 1, Sector 16,<br />
                                            Faridabad, Haryana 121002
                                        </p>
                                        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 text-xs font-bold uppercase hover:underline">
                                            Get Directions
                                        </a>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Opening Hours</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex justify-between gap-4">
                                                <span>Mon - Sun</span>
                                                <span className="font-medium text-gray-900">10:00 AM - 9:00 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Contact Us</h4>
                                        <p className="text-gray-600 text-sm mb-1">+91 98765 43210</p>
                                        <p className="text-gray-600 text-sm">support@sheshrifashion.com</p>
                                    </div>
                                </div>

                                {/* Social */}
                                <div className="pt-6 border-t border-gray-200">
                                    <p className="font-bold text-gray-900 mb-4 text-sm">Follow Us</p>
                                    <div className="flex gap-4">
                                        <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-600 shadow-sm hover:scale-110 transition-transform">
                                            <Instagram size={20} />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm hover:scale-110 transition-transform">
                                            <Facebook size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreDetails;
