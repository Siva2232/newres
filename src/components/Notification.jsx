import React, { useEffect, useRef, useState } from "react";
import { useOrders } from "../context/OrderContext";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Notification() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Filter pending orders
  const pendingOrders = orders.filter((o) => o.status === "Pending");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Optional: Play sound when new order arrives
  // Uncomment if you have a sound file
  /*
  const prevCount = useRef(pendingOrders.length);
  useEffect(() => {
    if (pendingOrders.length > prevCount.current && pendingOrders.length > 0) {
      new Audio("/notification.mp3").play().catch(() => {});
    }
    prevCount.current = pendingOrders.length;
  }, [pendingOrders.length]);
  */

  return (
    <div className="relative" ref={ref}>
      {/* Bell Icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="relative p-2 rounded-lg hover:bg-gray-100 focus:outline-none transition"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {pendingOrders.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse font-bold">
            {pendingOrders.length > 99 ? "99+" : pendingOrders.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl border rounded-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b font-bold text-gray-800 flex justify-between items-center">
            <span>New Orders</span>
            <span className="text-sm font-normal text-gray-500">
              ({pendingOrders.length})
            </span>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No new orders
            </div>
          ) : (
            pendingOrders.map((order) => {
              const total = order.items.reduce(
                (sum, item) => sum + item.price * item.qty,
                0
              );

              return (
                <div
                  key={order.id}
                  onClick={() => {
                    navigate("/admin/orders");
                    setOpen(false);
                  }}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">
                      Order #{order.id}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Table {order.table}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.name} × {item.qty}
                        </span>
                        <span>₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-right font-bold text-gray-900">
                    Total: ₹{total}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}