import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Play, Volume2, VolumeX, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { getAllProducts } from '../services/productService';

const VideoCard = ({ product, isActive, videoUrl }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${isActive ? 'ring-2 ring-primary-500' : ''}`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        muted={isMuted}
        loop
        playsInline
      />

      {/* Overlay Content - Always visible but styled better */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
        <div className={`transition-all duration-500 transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h3 className="text-white font-serif text-xl mb-2 line-clamp-1">{product.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-primary-200 font-bold">₹{product.price.toLocaleString()}</p>
            <div className="flex gap-2">
              <button
                onClick={toggleMute}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <Link
                to={`/product/${product._id}`}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-primary-50 transition-colors"
              >
                <Eye size={14} /> View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Play Icon for non-active slides */}
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Play size={24} className="text-white fill-current ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

export default function ShopTheLook() {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();

        // Filter products that have at least one video
        const productsWithVideo = allProducts.filter(p =>
          (Array.isArray(p.video) && p.video.length > 0) || (p.video && typeof p.video === 'string')
        );

        // Map products to use the first video in the array as 'videoUrl'
        const featured = productsWithVideo.map(p => ({
          ...p,
          videoUrl: Array.isArray(p.video) ? p.video[0] : p.video
        }));

        setProducts(featured);
      } catch (err) {
        console.error("Failed to fetch products for Shop The Look", err);
      }
    };
    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bg-[#FAF5FF] py-8 md:py-10 mb-0">

      <div className="container mx-auto px-4 mb-2 text-center">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-2">Shop The Look</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Explore our latest styles in motion. Shop directly from our curated video showcase.</p>
      </div>

      <div className="shop-the-look-slider relative max-w-[1400px] mx-auto">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={'auto'}
          initialSlide={2}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="w-full py-4"
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              spaceBetween: 20
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 30
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40
            }
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={product._id || index} className="w-[260px] h-[360px] md:w-[320px] md:h-[450px] rounded-2xl overflow-hidden">
              {({ isActive }) => (
                <VideoCard
                  product={product}
                  isActive={isActive}
                  videoUrl={product.videoUrl}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .shop-the-look-slider .swiper-slide {
          background-position: center;
          background-size: cover;
          width: 260px;
          height: 360px;
          filter: blur(1px) scale(0.9);
          transition: all 0.5s ease;
          opacity: 0.7;
        }
        
        @media (min-width: 768px) {
          .shop-the-look-slider .swiper-slide {
             width: 320px;
             height: 450px;
          }
        }

        .shop-the-look-slider .swiper-slide-active {
          filter: blur(0) scale(1.1);
          opacity: 1;
          z-index: 10;
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .swiper-pagination-bullet-active {
          background-color: #000 !important;
        }
        
        .swiper-button-next, .swiper-button-prev {
          color: #000 !important;
          background: rgba(255,255,255,0.8);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
        }
        
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 20px !important;
        }
      `}</style>
    </section>
  );
}
