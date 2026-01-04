import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Search, X, ShoppingCart, Utensils, Sparkles, ChevronRight } from "lucide-react";

export default function Menu() {
  const { products } = useProducts();
  const { addToCart, cart = [], table, setTable } = useCart();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [slide, setSlide] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Premium restaurant carousel images
  const slides = [
    {
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
      title: "Welcome to Our Restaurant",
      subtitle: "Experience Culinary Excellence"
    },
    {
      img: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Fresh & Healthy",
      subtitle: "Farm to Table Goodness"
    },
    {
      img: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Start Your Day Right",
      subtitle: "Breakfast Delights Await"
    },
    {
      img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",
      title: "Fine Dining Experience",
      subtitle: "Where Every Meal is Special"
    },
    {
      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1600&q=80",
      title: "Artisan Pizza",
      subtitle: "Handcrafted with Love"
    },
  ];

  /* Auto slider */
  useEffect(() => {
    const timer = setInterval(
      () => setSlide((prev) => (prev + 1) % slides.length),
      5000
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  /* Table from URL */
  useEffect(() => {
    const t = searchParams.get("table");
    if (t) setTable(t);
  }, [searchParams, setTable]);

  const categories = useMemo(() => {
    const cats = products.map((p) => p.category || "Other");
    return ["All", ...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== "All" && p.category !== selectedCategory)
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const totalItems = cart.reduce(
    (sum, item) => sum + (item.qty || item.quantity || 1),
    0
  );

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex flex-col">
      {/* Premium Sticky Header */}
      <header className="top-0 z-40 backdrop-blur-2xl bg-white/90 border-b border-slate-200/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                  Our Menu
                </h1>
                <p className="text-xs text-slate-500 font-medium">Crafted with passion</p>
              </div>
            </div>
            
            {table && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold">Table #{table}</span>
              </div>
            )}
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${isSearchFocused ? 'opacity-30' : ''}`}></div>
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isSearchFocused ? 'text-orange-500' : 'text-slate-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search for delicious dishes..."
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white border-2 border-slate-200 text-sm font-medium focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Categories with Icons */}
          <div className="mt-5 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-2">
              {categories.map((cat, idx) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`group relative px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl scale-105"
                      : "bg-white text-slate-700 hover:bg-slate-50 shadow-md hover:shadow-lg border border-slate-200"
                  }`}
                  style={{
                    animationDelay: `${idx * 50}ms`
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {cat === "All" && "🍽️"}
                    {cat === "Appetizers" && "🥗"}
                    {cat === "Main Course" && "🍛"}
                    {cat === "Desserts" && "🍰"}
                    {cat === "Beverages" && "🍹"}
                    {cat === "Snacks" && "🍟"}
                    {cat}
                  </span>
                  {selectedCategory === cat && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-xl opacity-50 -z-10"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Premium Hero Carousel with Parallax Effect */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden shadow-2xl">
        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {slides.map((slideData, i) => (
            <div key={i} className="w-full flex-shrink-0 relative">
              <img
                src={slideData.img}
                alt={slideData.title}
                className="w-full h-full object-cover scale-110 transition-transform duration-1000"
              />
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-900/30 to-transparent" />
              
              {/* Animated Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
                <div className={`transform transition-all duration-1000 ${slide === i ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="inline-block bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 px-4 py-2 rounded-full mb-3">
                    <span className="text-orange-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Special Offer
                    </span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2 leading-tight">
                    {slideData.title}
                  </h2>
                  <p className="text-lg sm:text-xl md:text-2xl text-orange-100 font-medium">
                    {slideData.subtitle}
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Navigation Arrows */}
        <button
          onClick={() => setSlide((slide - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        >
          <ChevronRight className="w-6 h-6 text-slate-700 rotate-180 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => setSlide((slide + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        >
          <ChevronRight className="w-6 h-6 text-slate-700 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Premium Slider Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                slide === i 
                  ? "bg-white w-10 h-2.5 shadow-lg" 
                  : "bg-white/50 w-2.5 h-2.5 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="mt-8 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
              {selectedCategory}
              <span className="text-base font-normal text-slate-500">
                ({filteredProducts.length})
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Fresh dishes available now
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
              <Search className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No dishes found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or browse other categories</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              View All Dishes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredProducts.map((product, idx) => (
              <div
                key={product.id}
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animationFillMode: 'both'
                }}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <ProductCard
                  product={product}
                  searchQuery={searchQuery}
                  onAdd={() => product.available && addToCart(product)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Premium Floating Cart Button */}
      {totalItems > 0 && (
      <Link
  to={`/cart${table ? `?table=${table}` : ""}`}
  className="fixed bottom-4 left-3 right-3 z-50 max-w-md mx-auto"
>
  <div className="relative group">
    {/* Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>

    {/* Main Button */}
    <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl px-4 py-3 flex justify-between items-center shadow-lg transition-all transform group-hover:scale-[1.01] active:scale-95 mb-19">
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
            {totalItems}
          </span>
        </div>
        <div>
          <p className="font-bold text-base">
            {totalItems} item{totalItems > 1 ? "s" : ""}
          </p>
          <p className="text-emerald-100 text-xs font-medium">Tap to review</p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
        <span className="font-semibold text-base">View Cart</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
</Link>

      )}
    </div>
  );
}