import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Lock, FileText, Truck, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';

const InfoPage = ({ title, content, toc }) => {
    const location = useLocation();

    // Default TOC items if none provided
    const defaultToc = [
        { name: 'Introduction', id: 'introduction' },
        { name: 'General Information', id: 'general-info' },
        { name: 'Key Details', id: 'key-details' },
        { name: 'Support', id: 'contact-us' }
    ];

    const tocItems = toc || defaultToc;

    // Scroll to top when page path changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Fallback title logic
    const pageTitle = title || location.pathname.substring(1).replace(/-/g, ' ').toUpperCase();

    // Icon selection based on title/path
    const getIcon = () => {
        const path = location.pathname.toLowerCase();
        if (path.includes('privacy')) return <Lock className="text-primary-600" size={28} />;
        if (path.includes('security')) return <Shield className="text-primary-600" size={28} />;
        if (path.includes('shipping')) return <Truck className="text-primary-600" size={28} />;
        if (path.includes('returns')) return <RefreshCw className="text-primary-600" size={28} />;
        if (path.includes('terms')) return <FileText className="text-primary-600" size={28} />;
        return <HelpCircle className="text-primary-600" size={28} />;
    }

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900">
            {/* Minimalist Premium Header */}
            <div className="pt-2 md:pt-6 pb-6 md:pb-10 border-b border-gray-50 bg-[#fafafa]">
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 animate-fade-in">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                                {React.cloneElement(getIcon(), { size: 20, className: "md:w-7 md:h-7 text-primary-600" })}
                            </div>
                            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">Policy Center</span>
                        </div>
                        <h1 className="text-3xl md:text-6xl font-serif font-bold text-gray-900 mb-4 md:mb-6 leading-tight animate-slide-up">
                            {pageTitle}
                        </h1>
                        <div className="flex items-center gap-3 md:gap-4 text-gray-400 text-[10px] md:text-xs font-medium animate-fade-in delay-200">
                            <span>Updated: Jan 2026</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>Effective immediately</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="py-12 md:py-24">
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-10 md:gap-20">
                        {/* Improved Sidebar */}
                        <aside className="lg:w-1/4 hidden lg:block">
                            <div className="sticky top-32">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-primary-600 mb-8">Table of Contents</h4>
                                <nav className="space-y-1">
                                    {tocItems.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className="block py-3 text-sm text-gray-500 hover:text-gray-900 transition-colors relative group font-medium"
                                        >
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-primary-600 group-hover:w-4 transition-all duration-300"></span>
                                            <span className="group-hover:pl-6 transition-all duration-300">{item.name}</span>
                                        </a>
                                    ))}
                                </nav>

                                <div className="mt-16 p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                    <h5 className="text-sm font-bold text-gray-900 mb-3">Questions?</h5>
                                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">Reach out to our compliance team for further clarification.</p>
                                    <a href="mailto:privacy@sheshri.com" className="text-primary-600 font-bold text-xs uppercase tracking-widest hover:text-primary-700 transition-colors">
                                        Email Support →
                                    </a>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="lg:w-3/4">
                            <div className="bg-white">
                                {content ? (
                                    <div
                                        className="info-content prose prose-sm md:prose-lg prose-primary max-w-none text-gray-600 leading-[1.6] md:leading-[1.8] font-light"
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                ) : (
                                    <div className="space-y-10 md:space-y-16 animate-fade-in delay-300">
                                        <section id="introduction" className="space-y-4 md:space-y-6">
                                            <h2 className="text-xl md:text-3xl font-serif font-bold text-gray-900">1. Introduction</h2>
                                            <p className="text-sm md:text-lg">
                                                At Sheshri Fashion, your trust is our most valued possession. This <strong>{pageTitle}</strong> serves as our formal commitment to transparency, security, and the highest standards of professional conduct in the fashion industry.
                                            </p>
                                        </section>

                                        <section id="key-information" className="space-y-4 md:space-y-6">
                                            <h2 className="text-xl md:text-3xl font-serif font-bold text-gray-900">2. Key Information</h2>
                                            <p className="text-sm md:text-lg">
                                                We continuously review our internal processes to ensure that your experience with our 브랜드 (brand) remains exquisite and secure. This document is part of our ongoing effort to provide clear and accessible information to our community.
                                            </p>
                                        </section>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 my-10 md:my-16">
                                            <div className="p-6 md:p-10 bg-[#fafafa] rounded-2xl md:rounded-[2rem] border border-gray-100 hover:border-primary-100 transition-colors group">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                                    <Lock className="text-primary-600" size={20} />
                                                </div>
                                                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-2">Secure Transactions</h4>
                                                <p className="text-[11px] md:text-sm text-gray-500 leading-relaxed font-medium">All payment and personal data are encrypted using industry-leading SSL technology.</p>
                                            </div>
                                            <div className="p-6 md:p-10 bg-[#fafafa] rounded-2xl md:rounded-[2rem] border border-gray-100 hover:border-primary-100 transition-colors group">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                                    <Shield className="text-primary-600" size={20} />
                                                </div>
                                                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-2">Privacy Control</h4>
                                                <p className="text-[11px] md:text-sm text-gray-500 leading-relaxed font-medium">You maintain full control over your data with easy access to your profile settings.</p>
                                            </div>
                                        </div>

                                        <section id="contact-us" className="pt-10 md:pt-16 border-t border-gray-100">
                                            <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-6 md:mb-8">Questions or Concerns?</h3>
                                            <div className="flex flex-wrap gap-8 md:gap-12">
                                                <div>
                                                    <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1 md:mb-2">Primary Email</p>
                                                    <p className="text-primary-600 font-semibold text-sm">sheshri07@gmail.com</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1 md:mb-2">Support Helpline</p>
                                                    <p className="text-gray-900 font-semibold text-sm">+91 7838418308</p>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            {/* Minimal Sticky Footer for Navigation */}
            <div className="py-10 md:py-12 bg-[#fafafa] border-t border-gray-50">
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                        <p className="text-[10px] md:text-xs text-gray-400 font-medium tracking-wide text-center">
                            Sheshri Fashion • Modern Heritage • 2025
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                            {["Terms", "Privacy", "Security", "Shipping"].map((p) => (
                                <a
                                    key={p}
                                    href={`/${p.toLowerCase()}`}
                                    className="text-[10px] md:text-[11px] font-bold text-gray-400 hover:text-primary-600 uppercase tracking-widest transition-colors"
                                >
                                    {p}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
