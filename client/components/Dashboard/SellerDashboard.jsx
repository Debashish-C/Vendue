import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/seller/Sidebar";

export default function SellerDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* nested pages render here */}
      </main>
    </div>
  );
}
