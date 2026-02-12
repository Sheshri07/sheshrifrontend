import React from "react";
import { Clock, User, ArrowRight, Share2, Heart, Tag, ChevronRight } from "lucide-react";

const Blog = () => {
    const posts = [
        {
            title: "The Return of Traditional Silhouettes in 2026",
            excerpt: "Discover how classic Indian silhouettes are making a comeback with a modern twist. From floor-length Anarkalis to structured silk sarees...",
            image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2070&auto=format&fit=crop",
            date: "Jan 12, 2026",
            author: "Priya Sharma",
            category: "Trends"
        },
        {
            title: "5 Essential Styling Tips for Your Wedding Guest Look",
            excerpt: "Attending a winter wedding? Here's how to balance elegance and comfort with our curated collection of velvet suits and heavy dupattas...",
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2070&auto=format&fit=crop",
            date: "Jan 08, 2026",
            author: "Ananya Iyer",
            category: "Styling"
        },
        {
            title: "Behind the Scenes: Crafting the 'Sheshri' Silk Collection",
            excerpt: "Go inside our studio and see the intricate process of hand-weaving and embroidery that brings our signature silk pieces to life...",
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop",
            date: "Jan 05, 2026",
            author: "Meera Reddy",
            category: "Behind the Design"
        },
        {
            title: "Sustainable Fashion: The Future of Ethnic Wear",
            excerpt: "Explore how we are incorporating eco-friendly fabrics and ethical production methods into our latest collections without compromising on luxury...",
            image: "https://images.unsplash.com/photo-1545007807-321ff24b6c12?q=80&w=2070&auto=format&fit=crop",
            date: "Dec 28, 2025",
            author: "Rahul Verma",
            category: "Ethics"
        },
        {
            title: "Mastering the Art of Draping: Beyond the Basics",
            excerpt: "Learn five innovative ways to drape your saree for every occasion, from corporate events to festive celebrations. Expert tips inside...",
            image: "https://images.unsplash.com/photo-1563223019-33b764b85777?q=80&w=2070&auto=format&fit=crop",
            date: "Dec 22, 2025",
            author: "Priya Sharma",
            category: "Styles"
        },
        {
            title: "Color Palette of the Season: Emerald & Gold",
            excerpt: "Why this classic combination is dominating the runways this season and how you can incorporate it into your wardrobe for a regal touch...",
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
            date: "Dec 15, 2025",
            author: "Ananya Iyer",
            category: "Trends"
        }
    ];

    const popularTags = ["Saree Styling", "Wedding Collection", "Silk Weaver", "Embroidery", "Festive Wear", "Luxury"];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section - Reduced Height for Mobile */}
            <section className="relative h-[250px] md:h-[550px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/blog_banner.png"
                        alt="Blog Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in">
                    <span className="text-primary-300 font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs mb-3 md:mb-4 block">Editorial</span>
                    <h1 className="text-3xl md:text-7xl font-serif font-bold text-white mb-4 md:mb-6 tracking-tight">
                        Sheshri <span className="italic font-light">Journal</span>
                    </h1>
                    <p className="text-gray-200 text-xs md:text-xl font-light leading-relaxed mb-4 opacity-90 mx-auto max-w-2xl px-4">
                        A curation of fashion trends, styling insights, and the stories behind our creations.
                    </p>
                </div>
            </section>

            {/* Main Content Area - Responsive Spacing */}
            <section className="py-12 md:py-28 container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-10 md:gap-16">

                    {/* Posts Grid */}
                    <div className="flex-1">
                        {/* Featured Post - Optimized for Mobile */}
                        <div className="group cursor-pointer mb-12 md:mb-20 relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-gray-50 border border-gray-100 flex flex-col md:flex-row shadow-sm hover:shadow-2xl transition-all duration-700">
                            <div className="w-full md:w-[55%] h-[250px] md:h-[400px] overflow-hidden">
                                <img
                                    src={posts[0].image}
                                    alt={posts[0].title}
                                    className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-6 md:p-12 flex-1 flex flex-col justify-center">
                                <span className="text-primary-600 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3 md:mb-4 block">{posts[0].category}</span>
                                <h2 className="text-xl md:text-4xl font-serif font-bold text-gray-900 mb-4 md:mb-6 group-hover:text-primary-700 transition-colors leading-tight">
                                    {posts[0].title}
                                </h2>
                                <p className="text-xs md:text-base text-gray-600 leading-relaxed mb-6 line-clamp-2 md:line-clamp-3 font-medium">
                                    {posts[0].excerpt}
                                </p>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-5 md:pt-6">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold uppercase text-[10px] md:text-sm">
                                            {posts[0].author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[11px] md:text-sm font-bold text-gray-900">{posts[0].author}</p>
                                            <p className="text-[10px] md:text-xs text-gray-500">{posts[0].date}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-primary-600 size={14} md:size={20} opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
                                </div>
                            </div>
                        </div>

                        {/* Secondary Posts Grid - Responsive Gaps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            {posts.slice(1).map((post, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="relative h-[200px] md:h-[300px] rounded-2xl md:rounded-3xl overflow-hidden mb-4 md:mb-6 shadow-md shadow-black/5 group-hover:shadow-xl transition-all duration-500">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-3 left-3 md:top-4 md:left-4">
                                            <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[9px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-1 md:px-2">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-primary-600 transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-4 md:mb-6 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-400 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} className="md:w-3.5 md:h-3.5" />
                                                <span>5 min read</span>
                                            </div>
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        <div className="text-center mt-20">
                            <button className="px-10 py-4 border-2 border-gray-900 text-gray-900 font-bold uppercase tracking-widest rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 transform active:scale-95">
                                Discover More
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-[350px] space-y-16">
                        {/* Search Widget */}
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Search Journal</h4>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Keywords..."
                                    className="w-full px-5 py-3 rounded-2xl bg-white border border-transparent focus:border-primary-500 outline-none shadow-sm text-sm"
                                />
                                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer hover:text-primary-600 transition-colors" />
                            </div>
                        </div>

                        {/* Newsletter Widget */}
                        <div className="bg-primary-950 p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <h4 className="text-white text-2xl font-serif font-bold mb-4">Elegance in Your Inbox</h4>
                                <p className="text-primary-200/80 text-sm leading-relaxed mb-8">
                                    Subscribe to our weekly editorial for styling tips and exclusive collection reveals.
                                </p>
                                <form className="space-y-4">
                                    <input
                                        type="email"
                                        required
                                        placeholder="Your email address"
                                        className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition-all text-sm font-medium"
                                    />
                                    <button className="w-full bg-primary-500 hover:bg-primary-400 text-white font-bold uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] text-xs">
                                        Join Editorial
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-8 flex items-center gap-3">
                                Categories
                                <div className="h-px flex-1 bg-gray-100"></div>
                            </h4>
                            <div className="space-y-3">
                                {["Collections", "Styling Tips", "Behind the Design", "Trends", "Sustainable Fashion"].map((cat, i) => (
                                    <a key={i} href="#" className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary-50 group transition-all duration-300">
                                        <span className="text-gray-600 group-hover:text-primary-700 font-medium">{cat}</span>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-500 transform group-hover:translate-x-1 transition-all" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Tag Cloud */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-8 flex items-center gap-3">
                                Popular Topics
                                <div className="h-px flex-1 bg-gray-100"></div>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.map((tag, i) => (
                                    <a key={i} href="#" className="px-4 py-2 bg-gray-100 hover:bg-primary-600 text-gray-600 hover:text-white text-xs font-bold rounded-full transition-all duration-300">
                                        #{tag.replace(/\s/g, "")}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Social Connect */}
                        <div className="pt-8">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 text-center">Follow the Journey</h4>
                            <div className="flex justify-center gap-4">
                                {[Heart, Share2, Tag].map((Icon, i) => (
                                    <button key={i} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 shadow-sm">
                                        <Icon size={18} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
};

export default Blog;
