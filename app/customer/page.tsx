"use client"

import { useEffect, useState } from "react"
import { CreditCard, ArrowLeftRight, FileText, TrendingUp, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react"
import { LoadingSpinner, Badge } from "@/components/ui"
import Link from "next/link"

type Account = {
  account_no: string
  account_type: string
  balance: number
  status: string
}

type Transaction = {
  transaction_id: string
  transaction_type: string
  amount: number
  description?: string
  transaction_date: string
}

type Loan = {
  loan_id: string
  loan_type: string
  loan_amount: number
  status: string
  application_date: string
}

export default function CustomerDashboard() {
  const [customerId, setCustomerId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = localStorage.getItem("bms_profile_id") || ""
    const profile = JSON.parse(localStorage.getItem("bms_profile") || "{}")
    setCustomerId(id)
    setCustomerName(profile.name || "Customer")

    if (!id) {
      window.location.href = "/login"
      return
    }

    const load = async () => {
      try {
        const [accRes, loanRes] = await Promise.all([
          fetch(`/api/customers/${id}/accounts`),
          fetch(`/api/customers/${id}/loans`),
        ])
        const accData = await accRes.json()
        const loanData = await loanRes.json()

        const accs: Account[] = accData.data || []
        setAccounts(accs)
        setLoans(loanData.data || [])

        // Fetch recent transactions for first account
        if (accs.length > 0) {
          const txRes = await fetch(`/api/accounts/${accs[0].account_no}/transactions`)
          const txData = await txRes.json()
          const all: Transaction[] = txData.data || []
          setTransactions(all.slice(0, 5))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0)

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-8 rounded-3xl bg-gradient-to-tr from-slate-900 to-[#0f172a] shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <TrendingUp className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-widest mb-4 border border-indigo-500/20">
            <CreditCard className="w-3.5 h-3.5" /> Customer Banking
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            Welcome, {customerName}
          </h1>
          <p className="text-slate-400 mt-2 font-medium text-lg">Here&apos;s your financial overview</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="relative z-10 h-11 px-5 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-indigo-500 transition-all hover:-translate-y-0.5"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Total balance + quick stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-600/20">
          <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-2">Total Balance</p>
          <p className="text-4xl font-extrabold tracking-tight">
            ₹{totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-indigo-200 text-sm mt-2">{accounts.length} account{accounts.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">
            <ArrowLeftRight className="w-4 h-4" /> Transactions
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{transactions.length}</p>
          <p className="text-slate-400 text-sm">Recent activity</p>
          <Link href="/customer/transactions" className="mt-auto text-indigo-600 text-sm font-bold hover:text-indigo-800 flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">
            <FileText className="w-4 h-4" /> Loans
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{loans.length}</p>
          <p className="text-slate-400 text-sm">Applications</p>
          <Link href="/customer/loans" className="mt-auto text-indigo-600 text-sm font-bold hover:text-indigo-800 flex items-center gap-1">
            View loans <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Accounts */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">My Accounts</h2>
          <Link href="/customer/accounts" className="text-indigo-600 text-sm font-bold hover:text-indigo-800">
            View all →
          </Link>
        </div>
        {accounts.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No accounts yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {accounts.map((acc) => (
              <div key={acc.account_no} className="border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{acc.account_type}</span>
                  <Badge variant={acc.status === "active" ? "active" : "inactive"}>{acc.status.toUpperCase()}</Badge>
                </div>
                <p className="text-2xl font-extrabold text-slate-800">
                  ₹{Number(acc.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  {acc.account_no.slice(0, 8)}...{acc.account_no.slice(-4)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Recent Transactions</h2>
          <Link href="/customer/transactions" className="text-indigo-600 text-sm font-bold hover:text-indigo-800">
            View all →
          </Link>
        </div>
        {transactions.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.transaction_id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.transaction_type === "deposit" || tx.transaction_type === "transfer_in" ? "bg-emerald-100" : "bg-rose-100"}`}>
                    {tx.transaction_type === "deposit" || tx.transaction_type === "transfer_in" ? (
                      <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 capitalize">{tx.transaction_type.replace("_", " ")}</p>
                    <p className="text-xs text-slate-400">{new Date(tx.transaction_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${tx.transaction_type === "deposit" || tx.transaction_type === "transfer_in" ? "text-emerald-600" : "text-rose-600"}`}>
                  {tx.transaction_type === "deposit" || tx.transaction_type === "transfer_in" ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loan status */}
      {loans.length > 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Loan Applications</h2>
            <Link href="/customer/loans" className="text-indigo-600 text-sm font-bold hover:text-indigo-800">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {loans.slice(0, 3).map((loan) => (
              <div key={loan.loan_id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-800 capitalize">{loan.loan_type} Loan</p>
                  <p className="text-xs text-slate-400">₹{Number(loan.loan_amount).toLocaleString("en-IN")}</p>
                </div>
                <Badge variant={loan.status as "pending" | "approved" | "rejected"}>
                  {loan.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
