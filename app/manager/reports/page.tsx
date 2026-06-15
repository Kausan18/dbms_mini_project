"use client"

import { useEffect, useState } from "react"
import { StatCard, LoadingSpinner, DataTable } from "@/components/ui"
import { IndianRupee, CheckCircle, XCircle, BarChart2 } from "lucide-react"

export default function ReportsPage() {
  const [approvedLoans, setApprovedLoans] = useState<any[]>([])
  const [rejectedLoans, setRejectedLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true)
        const [appRes, rejRes] = await Promise.all([
          fetch("/api/manager/loans/approved"),
          fetch("/api/manager/loans/rejected")
        ])

        if (!appRes.ok || !rejRes.ok) throw new Error("Failed to fetch reports data")

        const [appData, rejData] = await Promise.all([
          appRes.json(),
          rejRes.json()
        ])

        setApprovedLoans(Array.isArray(appData) ? appData : appData.data || [])
        setRejectedLoans(Array.isArray(rejData) ? rejData : rejData.data || [])

      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReportsData()
  }, [])

  const totalApprovedAmount = approvedLoans.reduce((sum, loan) => sum + (Number(loan.loan_amount) || 0), 0)

  const columns = [
    { key: "loan_id", label: "ID", render: (row: any) => <span className="font-mono text-slate-500">#{row.loan_id || row.id}</span> },
    { key: "customer_id", label: "Customer ID", render: (row: any) => <span className="font-semibold">{row.customer_id}</span> },
    { key: "loan_amount", label: "Amount", render: (row: any) => <span className="font-bold text-slate-800 tracking-tight">₹{(row.loan_amount || 0).toLocaleString("en-IN")}</span> },
    { key: "interest_rate", label: "Rate", render: (row: any) => <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-bold">{row.interest_rate}%</span> }
  ]

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
        <p className="font-bold text-lg tracking-tight mb-1">Error Loading Reports</p>
        <p className="text-sm font-medium opacity-80">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs mb-4">
            <BarChart2 className="w-4 h-4" /> Analytics
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Reports & Metrics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Detailed breakdown of approved and rejected loan applications.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Approved Amount"
          value={`₹${totalApprovedAmount.toLocaleString("en-IN")}`}
          icon={<IndianRupee className="w-6 h-6 text-emerald-100" />}
          className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-0 shadow-lg shadow-emerald-500/20"
        />
        <StatCard
          title="Approved Loans Count"
          value={approvedLoans.length}
          icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
          className="bg-white border-slate-200/60"
        />
        <StatCard
          title="Rejected Loans Count"
          value={rejectedLoans.length}
          icon={<XCircle className="w-6 h-6 text-rose-600" />}
          className="bg-white border-slate-200/60"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Latest Approved</h2>
              <p className="text-sm font-medium text-slate-500">Recently authorized disbursements</p>
            </div>
          </div>
          <DataTable columns={columns} data={approvedLoans.slice(0, 5)} className="border-0 shadow-none border-t rounded-none border-slate-100" />
        </div>
        
        <div className="space-y-4 bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Latest Rejected</h2>
              <p className="text-sm font-medium text-slate-500">Recently declined applications</p>
            </div>
          </div>
          <DataTable columns={columns} data={rejectedLoans.slice(0, 5)} className="border-0 shadow-none border-t rounded-none border-slate-100" />
        </div>
      </div>
    </div>
  )
}
