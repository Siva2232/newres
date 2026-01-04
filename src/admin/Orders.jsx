import { useOrders } from "../context/OrderContext";
import StatusBadge from "../components/StatusBadge";

export default function Orders() {
  const { orders, updateOrderStatus } = useOrders();

  if (!orders.length) {
    return (
      <p className="text-gray-500 text-center mt-6">No orders yet.</p>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-5 rounded-xl border shadow-sm">
            {/* Table and Order ID */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-semibold text-lg">Table {order.table || "N/A"}</h3>
                <p className="text-sm text-gray-500">{order.id}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Items in order */}
            <div className="space-y-1 mb-3 border-t border-gray-200 pt-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.qty || 1}
                  </span>
                  <span>₹{(item.price || 0) * (item.qty || 1)}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-2">
              {["Preparing","Ready","Cooking","Served"].map((status) => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(order.id, status)}
                  className={`px-3 py-1 text-sm rounded-lg transition
                    ${
                      order.status === status
                        ? "bg-black text-white"
                        : "bg-gray-100 hover:bg-black hover:text-white"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
