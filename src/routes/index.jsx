import { Routes, Route, Navigate } from "react-router-dom";

/* Layouts */
import AdminLayout from "../admin/AdminLayout";
import CustomerLayout from "../customer/CustomerLayout";

/* Admin Pages */
import Dashboard from "../admin/Dashboard";
import Products from "../admin/Products";
import Orders from "../admin/Orders";
import Tables from "../admin/Tables";
import AddProduct from "../admin/AddProduct";

/* Customer Pages */
import Menu from "../customer/Menu";
import Cart from "../customer/Cart";
import OrderStatus from "../customer/OrderStatus";
import OrderSummary from "../customer/OrderSummary";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------- CUSTOMER ---------- */}
     <Route element={<CustomerLayout />}>
  <Route path="/menu" element={<Menu />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/order-status/:orderId" element={<OrderStatus />} />
  <Route path="/order-summary" element={<OrderSummary />} />
</Route>


      {/* ---------- ADMIN ---------- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="/admin/products/add" element={<AddProduct />} />

        <Route path="orders" element={<Orders />} />
        <Route path="tables" element={<Tables />} />
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="/menu" />} />
    </Routes>
  );
}
