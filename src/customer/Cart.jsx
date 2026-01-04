import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { generateId } from "../utils/generateId";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // ← added useEffect
import { ShoppingBag, Trash2, Plus, Minus, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import confetti from 'canvas-confetti'; // ← new import

export default function Cart() {
  const {
    cart,
    table,
    setTable,
    clearCart,
    totalAmount,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [notes, setNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedDetails, setPlacedDetails] = useState(null);

  // Confetti animation when order is placed
  useEffect(() => {
    if (showSuccess) {
      const count = 200;
      const defaults = { origin: { y: 0.6 } };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });

      // Second wave after a short delay for extra celebration
      setTimeout(() => {
        fire(0.25, { spread: 30, startVelocity: 50 });
        fire(0.2, { spread: 70 });
      }, 800);
    }
  }, [showSuccess]);

  const placeOrder = () => {
    if (!table || cart.length === 0) return;

    const orderId = generateId("ORD");

    addOrder({
      id: orderId,
      table,
      items: cart,
      status: "Preparing",
      createdAt: new Date().toISOString(),
      notes: notes.trim(),
    });

    localStorage.setItem("lastOrderId", orderId);

    setPlacedDetails({
      orderId,
      table,
      total: totalAmount,
      notes: notes.trim(),
    });

    clearCart();
    setNotes("");
    setShowSuccess(true); // ← this triggers the confetti via useEffect
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-24 lg:pb-8">
      {/* Header with Glassmorphism */}
      <header className="top-0 backdrop-blur-xl bg-white/80 shadow-lg z-30 border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex justify-between items-center mb-4">
            <Link
              to={`/menu${table ? `?table=${table}` : ""}`}
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base">Menu</span>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Your Cart
              </h1>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1 sm:gap-2 text-red-500 hover:text-red-600 transition-colors font-medium text-sm sm:text-base group"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>

          {/* Table Input - Responsive */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <label className="text-slate-600 font-semibold text-xs sm:text-sm uppercase tracking-wide">
              Table Number
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={table || ""}
                onChange={(e) => setTable(e.target.value)}
                placeholder="00"
                className="w-20 sm:w-24 px-4 sm:px-5 py-3 text-center text-2xl font-bold border-2 sm:border-3 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white shadow-sm"
              />
              {table && (
                <div className="absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                  #{table}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {showSuccess ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 text-center max-w-md w-full border border-slate-100">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={3} />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">Order Placed Successfully!</h2>
              <p className="text-slate-500 mb-6 text-sm sm:text-base">Your delicious food is on its way</p>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 sm:p-6 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-600 font-medium text-sm sm:text-base">Table</span>
                  <span className="text-xl sm:text-2xl font-bold text-blue-600">#{placedDetails.table}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-600 font-medium text-sm sm:text-base">Order ID</span>
                  <span className="font-mono text-xs sm:text-sm text-slate-700 bg-white px-3 py-1 rounded-lg">
                    {placedDetails.orderId}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-semibold text-base sm:text-lg">Total Amount</span>
                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{placedDetails.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {placedDetails.notes && (
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-4 mb-6 text-left">
                  <p className="font-semibold text-amber-800 text-sm mb-1">Special Instructions:</p>
                  <p className="text-slate-700 italic text-sm sm:text-base">"{placedDetails.notes}"</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/order-summary")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  View Order Summary
                </button>
                <Link
                  to={`/menu?table=${placedDetails.table}`}
                  className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-4 rounded-xl text-base sm:text-lg text-center transition-all"
                >
                  Add More Items
                </Link>
              </div>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center px-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-14 h-14 sm:w-16 sm:h-16 text-slate-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-3">Your cart is empty</h3>
              <p className="text-slate-500 mb-8 text-sm sm:text-base">Add some delicious items to get started</p>
              <Link
                to={`/menu${table ? `?table=${table}` : ""}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>Order Items</span>
                <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                  {cart.length}
                </span>
              </h2>
              
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-4 sm:p-5 border border-slate-100"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center shadow-inner">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl sm:text-4xl">🍽️</span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-1 line-clamp-2">{item.name}</h3>
                        <p className="text-blue-600 font-semibold text-sm sm:text-base">₹{item.price.toFixed(2)} each</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 sm:gap-3 bg-slate-100 rounded-full px-2 py-2 shadow-inner">
                          <button
                            onClick={() => updateQuantity(item.id, item.qty - 1)}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-slate-50 shadow-md flex items-center justify-center transition-all touch-manipulation"
                          >
                            <Minus className="w-4 h-4 text-slate-700" />
                          </button>
                          <span className="font-bold text-base sm:text-lg w-10 sm:w-12 text-center text-slate-800">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.qty + 1)}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-slate-50 shadow-md flex items-center justify-center transition-all touch-manipulation"
                          >
                            <Plus className="w-4 h-4 text-slate-700" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg sm:text-xl text-slate-800">
                            ₹{(item.price * item.qty).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600 text-xs sm:text-sm font-medium mt-1 flex items-center gap-1 ml-auto transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Stacks below on mobile */}
            <div className="space-y-4">
              {/* Special Instructions */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-100">
                <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-3">Special Instructions</h3>
                <textarea
                  placeholder="e.g. Less spicy, no onions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 resize-none transition-all text-sm sm:text-base text-slate-700"
                />
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl text-white">
                <h3 className="font-bold text-base sm:text-lg mb-4 text-slate-200">Order Summary</h3>
                
                <div className="space-y-3 mb-4 pb-4 border-b border-slate-700">
                  <div className="flex justify-between text-slate-300 text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-sm sm:text-base">
                    <span>Items</span>
                    <span>{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-lg sm:text-xl">Total</span>
                  <span className="font-bold text-2xl sm:text-3xl text-emerald-400">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={!table}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg py-4 rounded-xl shadow-lg transition-all touch-manipulation"
                >
                  {!table ? "Enter Table Number" : "Place Order"}
                </button>
              </div>

              {!table && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 font-medium text-xs sm:text-sm">
                    Please enter your table number to place your order
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Fixed Bottom Bar */}
      {cart.length > 0 && !showSuccess && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-slate-200 shadow-2xl z-40 px-4 py-4 safe-area-bottom">
          <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Grand Total</p>
              <p className="text-2xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                ₹{totalAmount.toFixed(2)}
              </p>
            </div>
            <button
              onClick={placeOrder}
              disabled={!table}
              className="bg-gradient-to-r from-emerald-500 to-green-500 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold text-base px-6 py-4 rounded-xl shadow-lg transition-all touch-manipulation min-w-32"
            >
              {table ? "Place Order" : "Enter Table"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}