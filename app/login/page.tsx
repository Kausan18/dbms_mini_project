"use client"

import { useState } from "react"
import Link from "next/link"
import { ShieldCheck, User, Settings, Briefcase, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"

type Role = "customer" | "admin" | "manager"

const ROLES: { id: Role; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "customer", label: "Customer", icon: <User className="w-4 h-4" />, color: "indigo" },
  { id: "admin", label: "Admin", icon: <Settings className="w-4 h-4" />, color: "amber" },
  { id: "manager", label: "Manager", icon: <Briefcase className="w-4 h-4" />, color: "emerald" },
]

const colorMap: Record<string, string> = {
  indigo: "border-indigo-500 bg-indigo-500/10 text-indigo-400",
  amber: "border-amber-500 bg-amber-500/10 text-amber-400",
  emerald: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
}

export default function LoginPage() {
  const [role, setRole] = useState<Role>("customer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Email and password are required.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      })
      const json = await res.json()
      if (!json.success) {
        setError(json.error || "Login failed")
        return
      }
      localStorage.setItem("bms_role", json.data.role)
      localStorage.setItem("bms_profile_id", json.data.profile_id)
      localStorage.setItem("bms_profile", JSON.stringify(json.data.profile))

      const redirects: Record<Role, string> = {
        customer: "/customer",
        admin: "/admin",
        manager: "/manager",
      }
      window.location.href = redirects[role]
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Bank Management System</p>
        </div>

        {/* Role selector */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Sign in as</p>
          <div className="grid grid-cols-3 gap-3">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-center ${
                  role === r.id ? colorMap[r.color] : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600"
                }`}
              >
                {r.icon}
                <span className="text-xs font-bold">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
