import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";

export default function Dashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Products" value={products.length} />
        <Card title="Orders" value={orders.length} />
        <Card
          title="Active Orders"
          value={orders.filter(o => o.status !== "Served").length}
        />
      </div>
    </>
  );
}

const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);
