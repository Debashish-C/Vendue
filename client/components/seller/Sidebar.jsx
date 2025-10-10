import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Clock, Archive, MessagesSquare, Plus, Bell } from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { id: "all", label: "All Products", icon: <Home />, path: "/seller" },
    {
      id: "live",
      label: "Live Products",
      icon: <Clock />,
      path: "/seller/live",
    },
    {
      id: "history",
      label: "History",
      icon: <Archive />,
      path: "/seller/history",
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MessagesSquare />,
      path: "/seller/chat",
    },
    { id: "add", label: "Add Product", icon: <Plus />, path: "/seller/add" },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell />,
      path: "/seller/notifications",
    },
  ];

  return (
    <aside className="w-64 bg-white shadow flex flex-col h-screen">
      <div className="p-5 font-bold text-xl border-b">Seller Dashboard</div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            <span className="w-5 h-5">{item.icon}</span> {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
