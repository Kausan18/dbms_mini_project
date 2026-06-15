"use client"

import { useEffect, useState } from "react"
import { StatCard, LoadingSpinner } from "@/components/ui"
import { FileText, Clock, CheckCircle, XCircle, TrendingUp, HandCoins } from "lucide-react"

export default function ManagerDashboard() {
  const [data, setData] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const [allRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
          fetch("/api/manager/loans"),
          fetch("/api/loans/pending"),
          fetch("/api/manager/loans/approved"),
          fetch("/api/manager/loans/rejected")
        ])

        if (!allRes.ok || !pendingRes.ok || !approvedRes.ok || !rejectedRes.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const [all, pending, approved, rejected] = await Promise.all([
          allRes.json(),
          pendingRes.json(),
          approvedRes.json(),
          rejectedRes.json()
        ])

        setData({
          total: Array.isArray(all) ? all.length : (all.data?.length || 0),
          pending: Array.isArray(pending) ? pending.length : (pending.data?.length || 0),
          approved: Array.isArray(approved) ? approved.length : (approved.data?.length || 0),
          rejected: Array.isArray(rejected) ? rejected.length : (rejected.data?.length || 0),
        })
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching dashboard stats.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 mt-10 rounded-2xl bg-rose-50 border border-rose-200 text-center text-rose-600 max-w-lg mx-auto shadow-sm">
        <XCircle className="w-10 h-10 mx-auto mb-3 text-rose-500" />
        <p className="font-bold text-lg tracking-tight mb-1">Error Loading Dashboard</p>
        <p className="text-sm font-medium opacity-80">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-8 rounded-3xl bg-linear-to-tr from-slate-900 to-[#0f172a] shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <TrendingUp className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-widest mb-4 border border-indigo-500/20">
            <HandCoins className="w-3.5 h-3.5" /> Institutional Administration
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">Welcome, Manager</h1>
          <p className="text-slate-400 mt-2 font-medium text-lg max-w-xl">
            Live overview of loan originations, pending reviews, and portfolio status.
          </p>
        </div>
        <button onClick={() => window.location.reload()} className="relative z-10 h-11 px-6 rounded-xl bg-indigo-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:-translate-y-0.5">
          Refresh Overview
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Loans"
          value={data.total}
          icon={<FileText className="w-6 h-6 text-indigo-600" />}
          className="border-t-4 border-t-indigo-500"
        />
        <StatCard
          title="Pending Applications"
          value={data.pending}
          icon={<Clock className="w-6 h-6 text-amber-500" />}
          className="border-t-4 border-t-amber-500"
        />
        <StatCard
          title="Approved Loans"
          value={data.approved}
          icon={<CheckCircle className="w-6 h-6 text-emerald-500" />}
          className="border-t-4 border-t-emerald-500"
        />
        <StatCard
          title="Rejected Loans"
          value={data.rejected}
          icon={<XCircle className="w-6 h-6 text-rose-500" />}
          className="border-t-4 border-t-rose-500"
        />
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] opacity-90 relative overflow-hidden">
        <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
             <h2 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Pending Reviews Action Required</h2>
             <p className="text-slate-500 font-medium">
               You currently have <strong className="text-slate-800">{data.pending}</strong> pending loan applications in your queue.
             </p>
          </div>
          <div className="mt-6 sm:mt-0">
             <button onClick={() => window.location.href = '/manager/loans'} className="text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl transition-colors">
               Review Applications →
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
