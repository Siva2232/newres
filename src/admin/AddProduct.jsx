import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { generateId } from "../utils/generateId";

export default function AddProduct() {
  const { addProduct } = useProducts();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.description || !form.image) {
      alert("Please fill all fields and upload an image");
      return;
    }

    addProduct({
      id: generateId("PROD"),
      name: form.name,
      price: Number(form.price),
      description: form.description,
      image: form.image,
      available: true,
    });

    navigate("/admin/products"); // Go back to product list
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded-xl shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Add New Product</h1>

      <div className="grid gap-3">
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-3 py-2"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded px-3 py-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border rounded px-3 py-2"
        />

        {/* Image Preview */}
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg mt-2"
          />
        )}

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition mt-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
