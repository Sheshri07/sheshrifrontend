import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="group relative bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-primary-100/30 h-full flex flex-col">
      <Link to={`/product/${product._id || product.id}`}>
        <div className="relative overflow-hidden aspect-[4/5]">
          <img
            src={product.images?.[0] || product.image || "/placeholder.jpg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/*!product.inStock || product.countInStock <= 0 ? (
            <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
              <span className="bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                Out of Stock
              </span>
            </div>
          ) : null}
          {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
            <div className="absolute top-2 right-2 md:top-3 right-3 z-10">
              <span className="bg-green-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% OFF
              </span>
            </div>
          )}

          {/* Quick Add Button Overlay */}
          <div className="absolute bottom-3 left-0 right-0 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full bg-white text-gray-900 font-semibold py-1.5 md:py-2 text-xs md:text-sm rounded shadow-lg hover:bg-gray-100 transition">
              View Details
            </button>
          </div>
        </div>

        <div className="p-2 md:p-3">
          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-0.5">{product.category || "Fashion"}</p>
          <h3 className="text-gray-900 font-medium text-sm md:text-base leading-tight mb-1 truncate group-hover:text-primary-700 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-purple-600 font-bold text-sm md:text-lg">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-[9px] md:text-[11px] line-through">₹{Number(product.originalPrice).toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
