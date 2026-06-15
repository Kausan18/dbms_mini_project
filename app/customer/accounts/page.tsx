"use client"

import { useEffect, useState } from "react"
import { CreditCard, ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from "lucide-react"
import { LoadingSpinner, Badge } from "@/components/ui"

type Account = {
  account_no: string
  account_type: string
  balance: number
  status: string
  created_at: string
}

type Transaction = {
  transaction_id: string
  transaction_type: string
  amount: number
  description?: string
  transaction_date: string
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selected, setSelected] = useState<Account | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [txLoading, setTxLoading] = useState(false)

  useEffect(() => {
    const id = localStorage.getItem("bms_profile_id") || ""
    if (!id) { window.location.href = "/login"; return }

    fetch(`/api/customers/${id}/accounts`)
      .then((r) => r.json())
      .then((d) => {
        const accs: Account[] = d.data || []
        setAccounts(accs)
        if (accs.length > 0) loadTx(accs[0])
      })
      .finally(() => setLoading(false))
  }, [])

  const loadTx = async (acc: Account) => {
    setSelected(acc)
    setTxLoading(true)
    try {
      const res = await fetch(`/api/accounts/${acc.account_no}/transactions`)
      const d = await res.json()
      setTransactions(d.data || [])
    } finally {
      setTxLoading(false)
    }
  }

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><LoadingSpinner /></div>

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-slate-900 to-[#0f172a] border border-slate-800 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-widest mb-4 border border-indigo-500/20">
          <CreditCard className="w-3.5 h-3.5" /> My Accounts
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Your Bank Accounts</h1>
        <p className="text-slate-400 mt-2 text-lg font-medium">Select an account to view its transaction history</p>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold">No accounts found. Contact your bank admin.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((acc) => (
              <button
                key={acc.account_no}
                onClick={() => loadTx(acc)}
                className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 ${selected?.account_no === acc.account_no
                    ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest capitalize">
                    {acc.account_type}
                  </span>
                  <Badge variant={acc.status === "active" ? "active" : "inactive"}>{acc.status.toUpperCase()}</Badge>
                </div>
                <p className="text-2xl font-extrabold text-slate-800 mb-1">
                  ₹{Number(acc.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  {acc.account_no.slice(0, 8)}...{acc.account_no.slice(-4)}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Opened {new Date(acc.created_at).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>

          {selected && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <ArrowLeftRight className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-800">
                  Transaction History — <span className="text-indigo-600 capitalize">{selected.account_type}</span>
                </h2>
              </div>

              {txLoading ? (
                <div className="flex justify-center py-12"><LoadingSpinner /></div>
              ) : transactions.length === 0 ? (
                <p className="text-center text-slate-400 py-12">No transactions for this account yet.</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => {
                    const isCredit = tx.transaction_type === "deposit" || tx.transaction_type === "transfer_in"
                    return (
                      <div key={tx.transaction_id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isCredit ? "bg-emerald-100" : "bg-rose-100"}`}>
                            {isCredit
                              ? <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                              : <ArrowUpRight className="w-4 h-4 text-rose-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 capitalize">
                              {tx.transaction_type.replace(/_/g, " ")}
                            </p>
                            {tx.description && <p className="text-xs text-slate-400">{tx.description}</p>}
                            <p className="text-xs text-slate-400">
                              {new Date(tx.transaction_date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className={`font-bold text-sm ${isCredit ? "text-emerald-600" : "text-rose-600"}`}>
                          {isCredit ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
