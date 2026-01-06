import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import RestaurantLoader from "../components/RestaurantLoader";
import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  Search,
  X,
  ShoppingCart,
  Utensils,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function Menu() {
  const { products } = useProducts();
  const { addToCart, cart = [], table, setTable } = useCart();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [slide, setSlide] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const sectionRefs = useRef({});
  const [showLoader, setShowLoader] = useState(false);

  // Premium carousel slides (fixed URLs without < >)
  const slides = [
    {
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
      title: "Welcome to Our Restaurant",
      subtitle: "Experience Culinary Excellence",
    },
    {
      img: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Fresh & Healthy",
      subtitle: "Farm to Table Goodness",
    },
    {
      img: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Start Your Day Right",
      subtitle: "Breakfast Delights Await",
    },
    {
      img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",
      title: "Fine Dining Experience",
      subtitle: "Where Every Meal is Special",
    },
    {
      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1600&q=80",
      title: "Artisan Pizza",
      subtitle: "Handcrafted with Love",
    },
  ];

  // Auto slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Set table from URL params
  useEffect(() => {
    const t = searchParams.get("table");
    if (t) setTable(t);
  }, [searchParams, setTable]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category || "Other");
    return ["All", ...new Set(cats)];
  }, [products]);

  // Cart total items
  const totalItems = cart.reduce(
    (sum, item) => sum + (item.qty || item.quantity || 1),
    0
  );

  // Search suggestions (autocomplete)
  const suggestions = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) return [];

    const q = trimmed.toLowerCase();
    let matches = products.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const desc = p.description?.toLowerCase() || "";
      return name.includes(q) || desc.includes(q);
    });

    // Prioritize names starting with query
    matches.sort((a, b) => {
      const aName = a.name?.toLowerCase() || "";
      const bName = b.name?.toLowerCase() || "";
      if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
      if (!aName.startsWith(q) && bName.startsWith(q)) return 1;
      return aName.localeCompare(bName);
    });

    return matches.slice(0, 10);
  }, [products, searchQuery]);

  // Show loader once per session
  useEffect(() => {
    const hasShown = sessionStorage.getItem("menuLoaderShown");
    if (!hasShown) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        sessionStorage.setItem("menuLoaderShown", "true");
        setShowLoader(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex flex-col">
      {showLoader && <RestaurantLoader />}

      {!showLoader && (
        <>
          {/* Sticky Premium Header */}
          <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/90 border-b border-slate-200/50 shadow-xl">
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
                    <p className="text-xs text-slate-500 font-medium">
                      Crafted with passion
                    </p>
                  </div>
                </div>

                {table && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-bold">Table #{table}</span>
                  </div>
                )}
              </div>

              {/* Search Bar with Suggestions */}
              <div className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                    isSearchFocused ? "opacity-30" : ""
                  }`}
                ></div>

                <div className="relative">
                  <Search
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      isSearchFocused ? "text-orange-500" : "text-slate-400"
                    }`}
                  />
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

                {/* Suggestions Dropdown */}
                {searchQuery.trim().length >= 2 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                    {suggestions.length > 0 ? (
                      <ul className="max-h-96 overflow-y-auto">
                        {suggestions.map((product) => (
                          <li
                            key={product.id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setSearchQuery(product.name)}
                            className="flex items-center gap-4 px-6 py-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 cursor-pointer transition-all border-b border-slate-100 last:border-none"
                          >
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-14 h-14 rounded-xl object-cover shadow-md flex-shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gradient-to-br from-orange-200 to-pink-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Utensils className="w-8 h-8 text-white/70" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-800 truncate">
                                {product.name}
                              </p>
                              {product.description && (
                                <p className="text-sm text-slate-500 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-orange-600">
                                $
                                {typeof product.price === "number"
                                  ? product.price.toFixed(2)
                                  : "N/A"}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (product.available !== false) {
                                  addToCart(product);
                                }
                                setSearchQuery("");
                              }}
                              disabled={product.available === false}
                              className="ml-4 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-6 py-10 text-center">
                        <p className="text-slate-500 text-sm">
                          No dishes found for "
                          <span className="font-medium">{searchQuery}</span>"
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          Try a different spelling or browse categories
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Category Navigation */}
              <div className="mt-5 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                <div className="flex gap-3 pb-2">
                  {categories.map((cat, idx) => (
                    <button
                      key={cat}
                      onClick={() => {
                        if (cat === "All") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        } else {
                          const section = sectionRefs.current[cat];
                          if (section) {
                            section.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }
                      }}
                      className="group relative px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 bg-white text-slate-700 hover:bg-slate-50 shadow-md hover:shadow-lg border border-slate-200 hover:scale-105"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {cat === "All" && "🍽️"}
                        {(cat === "Appetizers" || cat === "Starters") && "🥗"}
                        {(cat === "Main Course" || cat === "Mains") && "🍛"}
                        {cat === "Desserts" && "🍰"}
                        {(cat === "Beverages" || cat === "Drinks") && "🍹"}
                        {cat === "Snacks" && "🍟"}
                        {cat}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Hero Carousel */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-900/30 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
                    <div
                      className={`transform transition-all duration-1000 ${
                        slide === i
                          ? "translate-y-0 opacity-100"
                          : "translate-y-10 opacity-0"
                      }`}
                    >
                      <div className="inline-block bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 px-4 py-2 rounded-full mb-3">
                        <span className="text-orange-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-3 h-3" /> Special Offer
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

                  <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() =>
                setSlide((slide - 1 + slides.length) % slides.length)
              }
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

            {/* Dots Indicator */}
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

          {/* Main Menu Sections */}
          <main className="flex-1 overflow-y-auto pb-32 px-4 sm:px-6 max-w-7xl mx-auto w-full">
            <div className="py-8">
              {(() => {
                const q = searchQuery.toLowerCase().trim();
                const hasSearch = q.length > 0;
                const sections = [];
                let hasAnyMatch = false;

                const catList = categories
                  .filter((c) => c !== "All")
                  .sort((a, b) => a.localeCompare(b));

                catList.forEach((cat) => {
                  const catProducts = products.filter(
                    (p) => (p.category || "Other") === cat
                  );

                  const displayedProducts = hasSearch
                    ? catProducts.filter(
                        (p) =>
                          p.name?.toLowerCase().includes(q) ||
                          p.description?.toLowerCase().includes(q)
                      )
                    : catProducts;

                  if (displayedProducts.length > 0) {
                    hasAnyMatch = true;
                    sections.push(
                      <section
                        key={cat}
                        ref={(el) => el && (sectionRefs.current[cat] = el)}
                        className="mb-16 scroll-mt-40"
                      >
                        <div className="mb-6 flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
                              {(cat === "Appetizers" || cat === "Starters") &&
                                "🥗 "}
                              {(cat === "Main Course" || cat === "Mains") &&
                                "🍛 "}
                              {cat === "Desserts" && "🍰 "}
                              {(cat === "Beverages" || cat === "Drinks") &&
                                "🍹 "}
                              {cat === "Snacks" && "🍟 "}
                              {cat}
                              <span className="text-base font-normal text-slate-500">
                                ({displayedProducts.length})
                              </span>
                            </h2>
                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              Fresh dishes available now
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                          {displayedProducts.map((product, idx) => (
                            <div
                              key={product.id}
                              style={{ animationDelay: `${idx * 50}ms` }}
                              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                            >
                              <ProductCard
                                product={product}
                                searchQuery={searchQuery}
                                onAdd={() =>
                                  product.available !== false &&
                                  addToCart(product)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  }
                });

                if (hasSearch && !hasAnyMatch) {
                  sections.push(
                    <div
                      key="no-results"
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-16 h-16 text-slate-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-700 mb-2">
                        No dishes found
                      </h3>
                      <p className="text-slate-500 mb-6">
                        Try adjusting your search or browse the categories
                      </p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      >
                        Clear Search
                      </button>
                    </div>
                  );
                }

                return sections;
              })()}
            </div>
          </main>

          {/* Floating Cart Button */}
          {totalItems > 0 && (
            <Link
              to={`/cart${table ? `?table=${table}` : ""}`}
              className="fixed bottom-4 left-3 right-3 z-50 max-w-md mx-auto"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl px-4 py-3 flex justify-between items-center shadow-lg transition-all transform group-hover:scale-[1.01] active:scale-95">
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
                      <p className="text-emerald-100 text-xs font-medium">
                        Tap to review
                      </p>
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
        </>
      )}
    </div>
  );
}