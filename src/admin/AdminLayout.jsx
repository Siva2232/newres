import { NavLink, Outlet } from "react-router-dom";
import Notification from "../components/Notification";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 font-bold text-xl">Admin Panel</div>
        <nav className="px-4 space-y-2">
          {["dashboard", "products", "orders", "tables"].map((item) => (
            <NavLink
              key={item}
              to={`/admin/${item}`}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {item.toUpperCase()}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white border-b px-6 h-14">
          <h1 className="font-bold text-lg">Admin Panel</h1>

          {/* Notification Icon */}
          <div className="flex items-center gap-4">
            <Notification />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
