import { useOrders } from "../context/OrderContext";
import { useNavigate, Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import OrderProgress from "../components/OrderProgress";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function OrderSummary() {
  const { orders } = useOrders();
  const lastOrderId = localStorage.getItem("lastOrderId");
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === lastOrderId);

  const totalAmount =
    order?.items?.reduce(
      (sum, i) => sum + (i.price || 0) * (i.qty || 1),
      0
    ) || 0;

  const orderTime = order?.createdAt
    ? format(new Date(order.createdAt), "h:mm a • d MMM yyyy")
    : "";

  /* 🎉 CONFETTI WHEN SERVED */
  useEffect(() => {
    if (order?.status === "Served") {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [order?.status]);

  if (!order || !order.items || order.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-sm w-full">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-bold mb-2">No Active Order</h2>
          <p className="text-sm text-gray-500 mb-6">
            Place an order to see live updates
          </p>
          <Link
            to="/menu"
            className="block bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            Go to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 font-semibold text-sm"
          >
            ← Back
          </button>
          <h1 className="font-extrabold text-lg">Order Summary</h1>
          <div className="w-8" />
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pb-28 pt-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* TOP INFO */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs opacity-90">Order ID</p>
                <p className="text-lg font-bold">{order.id}</p>
                <p className="text-xs opacity-90 mt-1">{orderTime}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-90">Table</p>
                <p className="text-3xl font-extrabold">#{order.table}</p>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50">
            <span className="text-sm font-semibold text-gray-700">
              Order Status
            </span>
            <StatusBadge status={order.status} />
          </div>

          {/* 📍 PROGRESS TRACKER */}
          <OrderProgress status={order.status} />

          {/* 🎉 SERVED MESSAGE */}
          {order.status === "Served" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-4 mb-4 bg-green-50 border border-green-200 rounded-2xl p-4 text-center"
            >
              <p className="text-lg font-extrabold text-green-700">
                🎉 Order Served!
              </p>
              <p className="text-sm text-green-600 mt-1">
                Enjoy your meal 🍽️
              </p>
            </motion.div>
          )}

          {/* ITEMS */}
          <div className="p-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 items-center bg-slate-50 rounded-2xl p-3"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">🍽️</span>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.qty} × ₹{item.price.toFixed(2)}
                  </p>
                </div>

                <p className="font-extrabold text-gray-800">
                  ₹{(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="px-5 py-4 bg-slate-50 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">
                Grand Total
              </span>
              <span className="text-2xl font-extrabold text-gray-900">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* NOTES */}
          {order.notes && (
            <div className="px-5 py-4 bg-amber-50 border-t border-amber-200">
              <p className="text-xs font-bold text-amber-800 mb-1">
                Special Instructions
              </p>
              <p className="text-sm italic text-amber-900">
                “{order.notes}”
              </p>
            </div>
          )}
        </motion.div>

        <p className="text-center text-xs text-gray-500">
          Live kitchen updates 📡
        </p>
      </main>

      {/* BOTTOM ACTION */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t shadow-2xl px-4 py-4">
        <div className="max-w-md mx-auto">
          <Link
            to={`/menu?table=${order.table}`}
            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3 rounded-2xl font-extrabold"
          >
            Order More Items
          </Link>
        </div>
      </div>
    </div>
  );
}
