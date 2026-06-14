"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, Search, ShieldCheck, LogOut } from "lucide-react"

export function Navbar() {
  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-indigo-900/50 bg-[#0f172a] px-8 shadow-xl">
      <div className="flex items-center md:hidden">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
          BankManager
        </Link>
      </div>
      
      <div className="hidden md:flex items-center bg-slate-800/50 rounded-full px-4 py-2 w-96 transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:bg-slate-800 border border-slate-700 focus-within:border-indigo-500/50 shadow-inner">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search records..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-200"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-300 hover:text-white transition-colors">
          <Bell className="w-5 h-5 cursor-pointer" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-700 decoration-slate-700"></div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold leading-tight text-white">Manager</span>
              <span className="text-xs font-medium text-slate-400">Admin Portal</span>
            </div>
            <div className="h-10 w-10 border border-slate-600 rounded-full bg-linear-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold shadow-md shadow-slate-900/50">
              M
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="ml-2 p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
