import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ProductCard({ product, onAdd }) {
  const {
    name,
    description,
    price,
    image,
    available = true,
  } = product;

  const [added, setAdded] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();

    if (!available) return;

    // Trigger visual feedback
    setAdded(true);
    setShowCheck(true);

    // Call the actual add to cart
    onAdd();

    // Reset checkmark after animation
    setTimeout(() => setShowCheck(false), 800);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-[4/5]">

        {/* Image */}
        <img
          src={image || "https://via.placeholder.com/600x800"}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            !available ? "grayscale" : ""
          }`}
        />

        {/* OUT OF STOCK Overlay */}
        {!available && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <span className="bg-red-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Added Quantity Badge (Top Right) */}
        <AnimatePresence>
          {added && available && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-3 right-3 z-30"
            >
              <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                ✓
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Info Gradient */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5 pt-10">
          <h3 className="text-white text-lg font-bold line-clamp-2">{name}</h3>

          {description && (
            <p className="text-white/80 text-xs mt-1 line-clamp-2">
              {description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-white text-2xl font-extrabold">
              ₹{price}
            </span>

            {/* Enhanced + Button */}
            {available && (
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.85 }}
                className="relative bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
              >
                {/* Ripple Effect */}
                <AnimatePresence>
                  {showCheck && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 2.5 }}
                      exit={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-green-400 rounded-full"
                    />
                  )}
                </AnimatePresence>

                {/* Icon: + → ✓ */}
                <AnimatePresence mode="wait">
                  {showCheck ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      className="text-green-600 text-3xl font-bold z-10"
                    >
                      ✓
                    </motion.span>
                  ) : (
                    <motion.span
                      key="plus"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1 }}
                      className="text-green-600 text-3xl font-bold z-10"
                    >
                      +
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}