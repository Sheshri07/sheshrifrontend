import React, { useState } from "react";
import { API } from "../utils/api";
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Twitter, Youtube, Loader2 } from "lucide-react";
import { useToast } from "../context/ToastContext";

const Contact = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        message: ""
    });

    const validateForm = () => {
        const mobileRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.subject.trim()) {
            toast.error("Please enter a subject.");
            return false;
        }

        if (!formData.message.trim()) {
            toast.error("Please enter a message.");
            return false;
        }

        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }

        if (!mobileRegex.test(formData.mobile)) {
            toast.error("Please enter a valid 10-digit mobile number.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await API.post("/messages", formData);
            toast.success("Message sent successfully! We will get back to you soon.");
            setFormData({ name: "", email: "", mobile: "", subject: "", message: "" });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section - Reduced Height */}
            <section className="relative h-[200px] md:h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/contact_banner.png"
                        alt="Contact Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-2xl md:text-5xl font-serif font-bold text-white mb-2 tracking-tight">
                        Contact Us
                    </h1>
                    <div className="h-1 w-12 md:w-16 bg-primary-500 mx-auto rounded-full mb-3 md:mb-4"></div>
                    <p className="text-gray-200 text-xs md:text-base max-w-xl mx-auto font-light leading-relaxed opacity-90">
                        We're here to assist you. Reach out for styling advice or any inquiries.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-4 md:px-6 py-10 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-start">

                    {/* Left: Contact Info - More Compact */}
                    <div className="space-y-6 md:space-y-8">
                        <div>
                            <span className="text-primary-600 font-bold tracking-[0.2em] uppercase text-[9px] md:text-[10px] mb-2 block">Get in Touch</span>
                            <h2 className="text-xl md:text-3xl font-serif font-bold text-gray-900 mb-4 md:mb-6">
                                We'd Love to Hear From You
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="flex gap-3 p-3 md:p-4 bg-[#fafafa] rounded-2xl border border-gray-100/50 hover:shadow-md transition-all duration-300">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 shrink-0">
                                    <Mail size={16} className="md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs md:text-sm text-gray-900 mb-0.5">Email Us</h4>
                                    <p className="text-[10px] md:text-xs text-gray-500 break-all font-medium">sheshri07@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex gap-3 p-3 md:p-4 bg-[#fafafa] rounded-2xl border border-gray-100/50 hover:shadow-md transition-all duration-300">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 shrink-0">
                                    <Phone size={16} className="md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs md:text-sm text-gray-900 mb-0.5">Call Us</h4>
                                    <p className="text-[10px] md:text-xs text-gray-500 font-medium">+91 7838418308</p>
                                </div>
                            </div>

                            <div className="flex gap-3 p-3 md:p-4 bg-[#fafafa] rounded-2xl border border-gray-100/50 hover:shadow-md transition-all duration-300 md:col-span-2">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 shrink-0">
                                    <MapPin size={16} className="md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs md:text-sm text-gray-900 mb-0.5">Visit Our Store</h4>
                                    <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed font-medium">
                                        Puri High Street, 101B, Sector 81, Faridabad, Haryana 121004
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 p-3 md:p-4 bg-[#fafafa] rounded-2xl border border-gray-100/50 hover:shadow-md transition-all duration-300 md:col-span-2">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 shrink-0">
                                    <Clock size={16} className="md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs md:text-sm text-gray-900 mb-0.5">Store Hours</h4>
                                    <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed font-medium">
                                        Mon - Sat: 10:00 AM - 8:00 PM | Sun: 11:00 AM - 6:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="pt-2">
                            <h4 className="text-[10px] font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                                Follow our journey
                                <div className="h-px flex-1 bg-gray-100 ml-2"></div>
                            </h4>
                            <div className="flex gap-3">
                                {[
                                    { Icon: Facebook, url: "#" },
                                    { Icon: Instagram, url: "https://www.instagram.com/sheshri07/" },
                                    { Icon: Twitter, url: "#" },
                                    { Icon: Youtube, url: "#" }
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.url}
                                        target={social.url !== "#" ? "_blank" : undefined}
                                        rel={social.url !== "#" ? "noopener noreferrer" : undefined}
                                        className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-primary-600 transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <social.Icon size={16} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form - More Compact */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
                        <h3 className="text-lg md:text-xl font-serif font-bold text-gray-900 mb-6">Send us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-0 transition-all duration-300 text-xs md:text-sm"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-0 transition-all duration-300 text-xs md:text-sm"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required
                                        title="Please enter a valid 10-digit mobile number"
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-0 transition-all duration-300 text-xs md:text-sm"
                                        placeholder="Enter your mobile number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Subject <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-0 transition-all duration-300 text-xs md:text-sm"
                                    placeholder="Subject of inquiry"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Message <span className="text-red-500">*</span></label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-0 transition-all duration-300 resize-none text-xs md:text-sm"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-primary-700 transition-all duration-300 shadow-lg disabled:opacity-70 text-[10px] md:text-xs"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send size={14} className="md:w-4 md:h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Map Section - Slightly Shorter */}
            <section className="w-full h-[400px] bg-gray-100 relative grayscale hover:grayscale-0 transition-all duration-700 border-t border-gray-100">
                <iframe
                    title="Sheshri Store Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3511.135219213854!2d77.352467176182!3d28.355346096590217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cdc0043836d59%3A0x29eaec04da94348a!2sPuri%20High%20Street!5e0!3m2!1sen!2sin!4v1704886161491!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                <div className="absolute top-6 left-6 hidden md:block z-10">
                    <div className="bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-xl border border-white/50 max-w-[280px]">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                                <MapPin size={16} />
                            </div>
                            <h4 className="font-serif font-bold text-gray-900 text-base">Visit Us</h4>
                        </div>
                        <p className="text-gray-600 text-[11px] leading-relaxed mb-3 font-medium">
                            Puri High Street, 101B, Sector 81, Faridabad, Haryana 121004
                        </p>
                        <a
                            href="https://maps.app.goo.gl/mn3d7C8FrdkKWUbh7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-primary-600 uppercase tracking-widest hover:text-primary-800 transition-colors"
                        >
                            Get Directions →
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
