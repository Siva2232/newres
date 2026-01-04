import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, ShoppingCart, Receipt, Sparkles, ChefHat, Menu as MenuIcon } from "lucide-react";
import { useState } from "react";

export default function Navbar({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const links = [
    { path: "/menu", label: "Menu", icon: Utensils, color: "from-orange-500 to-red-500" },
    { path: "/cart", label: "Cart", icon: ShoppingCart, color: "from-blue-500 to-indigo-500" },
    { path: "/order-summary", label: "Orders", icon: Receipt, color: "from-emerald-500 to-teal-500" },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* Desktop & Tablet Premium Navbar */}
      <nav className="hidden md:block sticky top-0 z-50 backdrop-blur-2xl bg-gradient-to-r from-white/95 via-orange-50/80 to-white/95 border-b border-orange-200/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Premium Restaurant Logo & Title */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 group cursor-pointer"
              onClick={() => navigate("/menu")}
            >
              {/* Animated Logo Container */}
              <div className="relative">
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ChefHat className="w-7 h-7 text-white" strokeWidth={2.5} />
                </motion.div>
                {/* Sparkle Effect */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-yellow-400" fill="currentColor" />
                </motion.div>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity -z-10"></div>
              </div>

              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                  {title || "Delicio"}
                </h1>
                <p className="text-xs font-semibold text-slate-500 tracking-wide">FINE DINING EXPERIENCE</p>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              {links.map((link, idx) => {
                const active = isActive(link.path);
                const Icon = link.icon;

                return (
                  <motion.button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className="relative group"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`
                      relative flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm
                      transition-all duration-300 overflow-hidden
                      ${active 
                        ? "text-white shadow-2xl scale-105" 
                        : "text-slate-700 bg-white/70 hover:bg-white shadow-md hover:shadow-xl"
                      }
                    `}>
                      <Icon 
                        size={22} 
                        className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}
                        strokeWidth={active ? 2.5 : 2}
                      />
                      <span className="relative z-10">{link.label}</span>

                      {/* Active Gradient Background */}
                      {active && (
                        <motion.div
                          layoutId="desktopActivePill"
                          className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-2xl`}
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}

                      {/* Active Glow */}
                      {active && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-2xl blur-xl opacity-50 -z-10`}></div>
                      )}

                      {/* Hover Effect for Inactive */}
                      {!active && (
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      )}
                    </div>

                    {/* Bottom Active Indicator */}
                    {active && (
                      <motion.div
                        layoutId="desktopBottomIndicator"
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r ${link.color} rounded-full`}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile: Premium Top Bar */}
      <div className="md:hidden sticky top-0 z-50 backdrop-blur-2xl bg-gradient-to-r from-white/95 via-orange-50/80 to-white/95 border-b border-orange-200/30 shadow-xl">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
              onClick={() => navigate("/menu")}
            >
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ChefHat className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <motion.div
                  className="absolute -top-0.5 -right-0.5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" fill="currentColor" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  {title || "Delicio"}
                </h1>
                <p className="text-[10px] font-bold text-slate-500 tracking-wider">RESTAURANT</p>
              </div>
            </motion.div>

            {/* Menu Button (Optional for mobile) */}
            {/* <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center shadow-md"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <MenuIcon className="w-5 h-5 text-orange-600" />
            </motion.button> */}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Optional) */}
      {/* <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-[76px] left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-orange-200/30 shadow-xl"
          >
            <div className="px-5 py-4 space-y-2">
              {links.map((link) => {
                const active = isActive(link.path);
                const Icon = link.icon;
                return (
                  <button
                    key={link.path}
                    onClick={() => {
                      navigate(link.path);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold transition-all ${
                      active 
                        ? `bg-gradient-to-r ${link.color} text-white shadow-lg` 
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Icon size={24} />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Mobile Bottom Navigation - Premium Floating Style */}
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-50 px-3 pb-2 pointer-events-none">
  <motion.div
    initial={{ y: 80, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 280, damping: 28 }}
    className="relative max-w-sm mx-auto pointer-events-auto"
  >
    {/* Soft Glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl blur-xl opacity-25"></div>

    {/* Container */}
    <div className="relative backdrop-blur-xl bg-white/95 rounded-2xl shadow-xl border border-white/50 overflow-hidden">
      {/* Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>

      <div className="flex items-center justify-around px-1.5 py-2">
        {links.map((link, idx) => {
          const active = isActive(link.path);
          const Icon = link.icon;

          return (
            <motion.button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="relative flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl group"
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              {/* Icon */}
              <div
                className={`
                  relative w-9 h-9 rounded-xl flex items-center justify-center
                  transition-all duration-300
                  ${
                    active
                      ? `bg-gradient-to-br ${link.color} shadow-md`
                      : "bg-slate-100 group-hover:bg-slate-200"
                  }
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.5 : 2}
                  className={`transition-all duration-300 ${
                    active
                      ? "text-white scale-105"
                      : "text-slate-600 group-hover:scale-105"
                  }`}
                />

                {active && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${link.color} rounded-xl blur-md opacity-30 -z-10`}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  text-[10px] font-semibold mt-0.5 transition-all
                  ${
                    active
                      ? "text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text"
                      : "text-slate-600"
                  }
                `}
              >
                {link.label}
              </span>

              {/* Active Dot */}
              {active && (
                <motion.div
                  layoutId="mobileActiveIndicator"
                  className={`absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gradient-to-r ${link.color} rounded-full`}
                />
              )}

              {/* Active BG */}
              {active && (
                <motion.div
                  layoutId="mobileActiveBg"
                  className="absolute inset-0 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl -z-10"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>

    {/* Safe Area */}
    <div className="h-[env(safe-area-inset-bottom)]" />
  </motion.div>
</nav>

    </>
  );
}