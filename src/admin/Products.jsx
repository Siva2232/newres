import { useProducts } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const { products, toggleAvailability } = useProducts();
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Products</h1>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          + Add Product
        </button>
      </div>

      {products.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No products added yet
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow p-3 flex flex-col"
          >
            <img
              src={p.image || "https://via.placeholder.com/300"}
              alt={p.name}
              className={`h-32 w-full object-cover rounded-md ${
                !p.available ? "grayscale" : ""
              }`}
            />

            <h3 className="mt-2 font-medium">{p.name}</h3>
            <p className="text-sm text-gray-500">₹{p.price}</p>

            <button
              onClick={() => toggleAvailability(p.id)}
              className={`mt-3 py-1 rounded-full text-xs font-semibold ${
                p.available
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {p.available ? "Available" : "Out of Stock"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
