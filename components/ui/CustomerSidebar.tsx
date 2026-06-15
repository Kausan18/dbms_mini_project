"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Accounts", href: "/accounts", icon: "🏦" },
    { name: "Transactions", href: "/transactions", icon: "💸" },
    { name: "Loans", href: "/loans", icon: "📄" },
    { name: "Logout", href: "/login", icon: "🚪" },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#020B2D] text-white p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">BankManager</h1>
        <p className="text-gray-400 mt-2">
          Customer Portal
        </p>
      </div>

      <div className="space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
              pathname === item.href
                ? "bg-[#5B4DFF]"
                : "hover:bg-[#1A2554]"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}