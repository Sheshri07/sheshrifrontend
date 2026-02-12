import React from "react";
import { Briefcase, Heart, Star, Users, ArrowUpRight, Globe, Target, PenTool } from "lucide-react";
import { API } from "../utils/api";

const Careers = () => {
    const [openings, setOpenings] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await API.get("/jobs");
                setOpenings(data);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const benefits = [
        {
            icon: Heart,
            title: "Inclusive Culture",
            desc: "A creative and supportive environment where every voice matters."
        },
        {
            icon: Star,
            title: "Growth Opportunities",
            desc: "Regular workshops and mentorship to scale your fashion career."
        },
        {
            icon: Globe,
            title: "Modern Workspace",
            desc: "Work in a high-fashion studio with the latest tools and tech."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section - Reduced Height for Mobile */}
            <section className="relative h-[250px] md:h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/careers_banner.png"
                        alt="Careers Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in">
                    <span className="text-primary-400 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-2 md:mb-4 block">Join Sheshri Fashion</span>
                    <h1 className="text-3xl md:text-7xl font-serif font-bold text-white mb-4 md:mb-6 tracking-tight leading-tight">
                        Crafting the Future of <br className="hidden md:block" />
                        <span className="text-primary-400">Indian Couture</span>
                    </h1>
                    <p className="text-sm md:text-xl font-light leading-relaxed mb-6 md:mb-8 opacity-90 mx-auto max-w-2xl text-gray-200">
                        Become part of a team that celebrates tradition while embracing modern innovation. Let's create something beautiful together.
                    </p>
                    <a href="#openings" className="bg-white text-gray-900 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-xl inline-block text-[10px] md:text-sm">
                        View Openings
                    </a>
                </div>
            </section>

            {/* Why Sheshri Section - More Compact */}
            <section className="py-12 md:py-24 bg-gray-50/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-10 md:mb-20">
                        <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-2 md:mb-4">Why Work With Us?</h2>
                        <div className="h-1 w-16 md:w-20 bg-primary-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-50 rounded-xl md:rounded-2xl flex items-center justify-center text-primary-600 mb-4 md:mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                    <benefit.icon size={24} className="md:w-[30px] md:h-[30px]" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-4">{benefit.title}</h3>
                                <p className="text-xs md:text-base text-gray-600 leading-relaxed font-medium">
                                    {benefit.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote Section - Streamlined */}
            <section className="py-12 md:py-20 bg-primary-950 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary-800/20 rounded-full blur-3xl -ml-32 -mt-32"></div>
                <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                    <div className="max-w-3xl mx-auto italic text-lg md:text-3xl font-serif leading-relaxed opacity-90">
                        "At Sheshri, we don't just sell clothes; we build legacies. Every stitch we make is a testament to the artisans of India and the modern woman of the world."
                    </div>
                    <div className="mt-6 md:mt-8 flex items-center justify-center gap-4">
                        <div className="h-px w-6 md:w-8 bg-primary-500"></div>
                        <span className="uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-xs font-bold text-primary-400">The Sheshri Philosophy</span>
                        <div className="h-px w-6 md:w-8 bg-primary-500"></div>
                    </div>
                </div>
            </section>

            {/* Openings Section - Compact List */}
            <section id="openings" className="py-12 md:py-24">
                <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4 md:gap-6">
                        <div>
                            <span className="text-primary-600 font-bold tracking-[0.2em] md:tracking-widest uppercase text-[10px] md:text-xs mb-1 md:mb-2 block">Career Opportunities</span>
                            <h2 className="text-2xl md:text-5xl font-serif font-bold text-gray-900">Current Openings</h2>
                        </div>
                        <div className="text-gray-500 font-medium text-xs md:text-base">
                            Don't see a fit? <a href="mailto:sheshri07@gmail.com" className="text-primary-600 hover:underline">Send us your CV anyway!</a>
                        </div>
                    </div>

                    <div className="grid gap-4 md:gap-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                            </div>
                        ) : (
                            <>
                                {openings.map((job, i) => (
                                    <div key={i} className="group bg-white p-5 md:p-10 rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-500">
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                                            <div className="space-y-1.5 md:space-y-2">
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <span className="bg-primary-50 text-primary-600 text-[9px] md:text-[10px] uppercase font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full tracking-widest">
                                                        {job.category}
                                                    </span>
                                                    <span className="text-gray-400 text-[10px] md:text-xs flex items-center gap-1">
                                                        <Globe size={12} /> {job.location}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg md:text-2xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                                                    {job.title}
                                                </h3>
                                                <p className="text-gray-500 text-[11px] md:text-sm font-medium">{job.type} • Remote friendly available</p>
                                            </div>
                                            <a
                                                href={
                                                    job.link
                                                        ? job.link.startsWith("http") || job.link.startsWith("mailto:")
                                                            ? job.link
                                                            : `https://${job.link}`
                                                        : "mailto:sheshri07@gmail.com"
                                                }
                                                target={job.link && !job.link.startsWith("mailto:") ? "_blank" : "_self"}
                                                rel={job.link && !job.link.startsWith("mailto:") ? "noopener noreferrer" : ""}
                                                className="w-full md:w-auto bg-gray-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-primary-600 transition-all duration-300 text-[10px] md:text-xs"
                                            >
                                                Apply Now
                                                <ArrowUpRight size={18} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                                {openings.length === 0 && (
                                    <div className="text-center py-10 text-gray-500">
                                        <p>No current openings. Please check back later.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <PenTool className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                        <h2 className="text-3xl font-serif font-bold text-gray-900">Looking for an Internship?</h2>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            We are always on the lookout for young, passionate talent to join our internship programs across design, marketing, and operations.
                        </p>
                        <a
                            href="mailto:sheshri07@gmail.com"
                            className="inline-flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-sm hover:gap-3 transition-all"
                        >
                            Email us at sheshri07@gmail.com
                            <ArrowUpRight size={16} />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Careers;
