"use client"

import { useEffect, useState } from "react"
import { FileText, CheckCircle, XCircle, Loader2, Clock } from "lucide-react"
import { LoadingSpinner, Badge } from "@/components/ui"

type Loan = {
  loan_id: string
  loan_type: string
  loan_amount: number
  interest_rate: number
  status: string
  application_date: string
}

const LOAN_TYPES = ["personal", "home", "education", "car"]

export default function LoansPage() {
  const [customerId] = useState(() => {
    try { return localStorage.getItem("bms_profile_id") || "" } catch { return "" }
  })
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // Form state
  const [loanType, setLoanType] = useState("personal")
  const [loanAmount, setLoanAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchLoans = async (id: string) => {
    const res = await fetch(`/api/customers/${id}/loans`)
    const d = await res.json()
    setLoans(d.data || [])
  }

  useEffect(() => {
    if (!customerId) { window.location.href = "/login"; return }
    const init = async () => {
      await fetchLoans(customerId)
      setLoading(false)
    }
    init()
  }, [customerId])
  const handleApply = async () => {
    if (!loanAmount || isNaN(parseFloat(loanAmount)) || parseFloat(loanAmount) <= 0) {
      showToast("Please enter a valid loan amount.", false)
      return
    }
    if (!interestRate || isNaN(parseFloat(interestRate)) || parseFloat(interestRate) <= 0) {
      showToast("Please enter a valid interest rate.", false)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          loan_type: loanType,
          loan_amount: parseFloat(loanAmount),
          interest_rate: parseFloat(interestRate),
        }),
      })
      const d = await res.json()
      if (!d.success) {
        showToast(d.error || "Failed to apply for loan.", false)
        return
      }
      showToast("Loan application submitted! The manager will review it.", true)
      setLoanAmount("")
      setInterestRate("")
      setLoanType("personal")
      await fetchLoans(customerId)
    } catch {
      showToast("Network error. Please try again.", false)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><LoadingSpinner /></div>

  const pending = loans.filter((l) => l.status === "pending")
  const approved = loans.filter((l) => l.status === "approved")
  const rejected = loans.filter((l) => l.status === "rejected")

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-slate-900 to-[#0f172a] border border-slate-800 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-widest mb-4 border border-indigo-500/20">
          <FileText className="w-3.5 h-3.5" /> Loans
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Loan Management</h1>
        <p className="text-slate-400 mt-2 text-lg font-medium">Apply for a loan and track your applications</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-amber-500">{pending.length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-emerald-600">{approved.length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Approved</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-rose-500">{rejected.length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Rejected</p>
        </div>
      </div>

      {/* Apply form */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-6">Apply for a Loan</h2>
        <div className="grid gap-5 md:grid-cols-2 max-w-2xl">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Loan Type
            </label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 capitalize"
            >
              {LOAN_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)} Loan</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Loan Amount (₹)
            </label>
            <input
              type="number"
              min="1000"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="e.g. 500000"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Interest Rate (% per annum)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="e.g. 8.5"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-semibold"
            />
          </div>

          {/* EMI preview */}
          {loanAmount && interestRate && parseFloat(loanAmount) > 0 && parseFloat(interestRate) > 0 && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col justify-center">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Estimated Monthly EMI</p>
              <p className="text-xl font-extrabold text-indigo-700">
                ₹{Math.round(
                  (parseFloat(loanAmount) * (parseFloat(interestRate) / 100 / 12)) /
                  (1 - Math.pow(1 + parseFloat(interestRate) / 100 / 12, -60))
                ).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-indigo-400 mt-1">Based on 5-year tenure</p>
            </div>
          )}
        </div>

        <button
          onClick={handleApply}
          disabled={submitting}
          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          Submit Application
        </button>
      </div>

      {/* All loan applications */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-6">My Applications</h2>
        {loans.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No loan applications yet.</p>
        ) : (
          <div className="space-y-3">
            {loans.map((loan) => (
              <div key={loan.loan_id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    loan.status === "approved" ? "bg-emerald-100" :
                    loan.status === "rejected" ? "bg-rose-100" : "bg-amber-100"
                  }`}>
                    {loan.status === "approved" && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                    {loan.status === "rejected" && <XCircle className="w-5 h-5 text-rose-500" />}
                    {loan.status === "pending" && <Clock className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 capitalize">{loan.loan_type} Loan</p>
                    <p className="text-xs text-slate-400">
                      ₹{Number(loan.loan_amount).toLocaleString("en-IN")} at {loan.interest_rate}% p.a.
                    </p>
                    <p className="text-xs text-slate-400">
                      Applied {new Date(loan.application_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <Badge variant={loan.status as "pending" | "approved" | "rejected"}>
                  {loan.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl font-semibold text-white animate-in slide-in-from-bottom-2 ${toast.ok ? "bg-emerald-600" : "bg-rose-600"}`}>
          {toast.ok ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}
    </div>
  )
}