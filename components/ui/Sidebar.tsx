"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CreditCard, BarChart3, ShieldCheck } from "lucide-react"

const NAV_BY_ROLE: Record<string, { name: string; href: string; icon: React.ElementType }[]> = {
  manager: [
    { name: 'Overview', href: '/manager', icon: LayoutDashboard },
    { name: 'Loans Application', href: '/manager/loans', icon: CreditCard },
    { name: 'Financial Reports', href: '/manager/reports', icon: BarChart3 },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Customers', href: '/admin/customers', icon: CreditCard },
    { name: 'Accounts', href: '/admin/accounts', icon: BarChart3 },
    { name: 'Transactions', href: '/admin/transactions', icon: ShieldCheck },
  ],
  customer: [
    { name: 'Dashboard', href: '/customer', icon: LayoutDashboard },
    { name: 'Accounts', href: '/customer/accounts', icon: CreditCard },
    { name: 'Transactions', href: '/customer/transactions', icon: BarChart3 },
    { name: 'Loans', href: '/customer/loans', icon: ShieldCheck },
  ],
}
export function Sidebar() {
  const pathname = usePathname()
   const [role, setRole] = React.useState("manager")
  React.useEffect(() => {
    const getRole = () => {
      try { return localStorage.getItem("bms_role") || "manager" } catch { return "manager" }
    }
    setRole(getRole())
  }, [])
  const navigation = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.manager
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div className={cn(
      "hidden border-r border-indigo-900/50 bg-linear-to-b from-[#0f172a] to-slate-950 md:flex flex-col shrink-0 h-full min-h-screen shadow-2xl z-20 transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-72"
    )}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-indigo-600 text-white rounded-full p-1 shadow-lg hover:bg-indigo-500 z-50 border border-indigo-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cn("transition-transform duration-300", isCollapsed && "rotate-180")}>
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <div className={cn("flex h-full flex-col gap-4 py-8", isCollapsed ? "px-2" : "px-5")}>
        <div className={cn("flex items-center gap-3 px-3 mb-8", isCollapsed && "justify-center px-0")}>
          <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-indigo-600 bg-linear-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300">
              <span className="font-bold text-xl tracking-tight text-white leading-tight">BankManager</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">Administration</span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="px-3 mb-1 mt-2">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-500 whitespace-nowrap overflow-hidden">Core Navigation</h2>
          </div>
        )}
        
        <nav className="grid gap-2 px-1 font-medium">
          {navigation.map((item) => {
            const isActive = pathname === item.href 
              || (item.href !== '/manager' && pathname.startsWith(item.href))
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3.5 rounded-xl transition-all duration-300 relative",
                  isCollapsed ? "px-0 py-3.5 justify-center" : "px-4 py-3.5",
                  isActive 
                    ? "bg-slate-800/80 text-white shadow-md border border-slate-700" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-md"></div>
                )}
                <Icon className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-300",
                  isActive ? "text-indigo-400" : "text-slate-500 group-hover:scale-110 group-hover:text-slate-300"
                )} />
                {!isCollapsed && (
                  <span className="text-sm font-semibold whitespace-nowrap overflow-hidden">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
