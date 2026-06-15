"use client"

import { useEffect, useState } from "react"
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { LoadingSpinner } from "@/components/ui"

type Account = { account_no: string; account_type: string; balance: number; status: string }
type Transaction = {
  transaction_id: string
  transaction_type: string
  amount: number
  description?: string
  transaction_date: string
}

type Tab = "deposit" | "withdraw" | "transfer" | "history"

export default function TransactionsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("deposit")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // Form state
  const [accountNo, setAccountNo] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [receiverAccount, setReceiverAccount] = useState("")

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  const loadTx = async (accNo: string) => {
    const res = await fetch(`/api/accounts/${accNo}/transactions`)
    const d = await res.json()
    setTransactions(d.data || [])
  }

  useEffect(() => {
    const id = localStorage.getItem("bms_profile_id") || ""
    if (!id) { window.location.href = "/login"; return }

    fetch(`/api/customers/${id}/accounts`)
      .then((r) => r.json())
      .then((d) => {
        const accs: Account[] = d.data || []
        setAccounts(accs)
        if (accs.length > 0) {
          setAccountNo(accs[0].account_no)
          loadTx(accs[0].account_no)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAccountChange = (no: string) => {
    setAccountNo(no)
    loadTx(no)
  }

  const handleSubmit = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      showToast("Please enter a valid positive amount.", false)
      return
    }

    const endpoints: Record<Tab, string> = {
      deposit: "/api/transactions/deposit",
      withdraw: "/api/transactions/withdraw",
      transfer: "/api/transactions/transfer",
      history: "",
    }

    const bodies: Record<Tab, Record<string, unknown>> = {
      deposit: { account_no: accountNo, amount: parseFloat(amount), description },
      withdraw: { account_no: accountNo, amount: parseFloat(amount), description },
      transfer: { sender_account: accountNo, receiver_account: receiverAccount, amount: parseFloat(amount) },
      history: {},
    }

    if (activeTab === "transfer" && !receiverAccount) {
      showToast("Please enter the receiver account number.", false)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(endpoints[activeTab], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodies[activeTab]),
      })
      const d = await res.json()
      if (!d.success) {
        showToast(d.error || "Transaction failed", false)
        return
      }
      showToast("Transaction successful!", true)
      setAmount("")
      setDescription("")
      setReceiverAccount("")
      // Refresh account data
      const id = localStorage.getItem("bms_profile_id") || ""
      const accRes = await fetch(`/api/customers/${id}/accounts`)
      const accData = await accRes.json()
      setAccounts(accData.data || [])
      loadTx(accountNo)
    } catch {
      showToast("Network error. Please try again.", false)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><LoadingSpinner /></div>

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "deposit", label: "Deposit", icon: <ArrowDownLeft className="w-4 h-4" /> },
    { id: "withdraw", label: "Withdraw", icon: <ArrowUpRight className="w-4 h-4" /> },
    { id: "transfer", label: "Transfer", icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: "history", label: "History", icon: <span className="text-xs">📋</span> },
  ]

  const selectedAccount = accounts.find((a) => a.account_no === accountNo)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-slate-900 to-[#0f172a] border border-slate-800 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-widest mb-4 border border-indigo-500/20">
          <ArrowLeftRight className="w-3.5 h-3.5" /> Transactions
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Money Movement</h1>
        <p className="text-slate-400 mt-2 text-lg font-medium">Deposit, withdraw, transfer funds, and view history</p>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-semibold">No accounts found. Contact admin to set up an account.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm space-y-6">
          {/* Account selector + balance */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                Selected Account
              </label>
              <select
                value={accountNo}
                onChange={(e) => handleAccountChange(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {accounts.map((a) => (
                  <option key={a.account_no} value={a.account_no}>
                    {a.account_type.toUpperCase()} — {a.account_no.slice(0, 8)}...
                  </option>
                ))}
              </select>
            </div>
            {selectedAccount && (
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Balance</p>
                <p className="text-2xl font-extrabold text-indigo-600">
                  ₹{Number(selectedAccount.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl w-full border border-slate-200 shadow-inner gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${activeTab === t.id ? "bg-white text-indigo-700 shadow-md border border-slate-200/60" : "text-slate-500 hover:text-slate-800"}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Action forms */}
          {activeTab !== "history" && (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                />
              </div>

              {activeTab === "transfer" && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Receiver Account Number
                  </label>
                  <input
                    type="text"
                    value={receiverAccount}
                    onChange={(e) => setReceiverAccount(e.target.value)}
                    placeholder="Paste receiver's account UUID"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  />
                </div>
              )}

              {activeTab !== "transfer" && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Description <span className="text-slate-300 normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Monthly savings"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                  activeTab === "withdraw"
                    ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
                    : activeTab === "transfer"
                    ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/20"
                    : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                }`}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {activeTab === "deposit" && "Deposit Funds"}
                {activeTab === "withdraw" && "Withdraw Funds"}
                {activeTab === "transfer" && "Send Transfer"}
              </button>
            </div>
          )}

          {/* Transaction history */}
          {activeTab === "history" && (
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No transactions yet.</p>
              ) : (
                transactions.map((tx) => {
                  const isCredit = tx.transaction_type === "deposit" || tx.transaction_type === "transfer_in"
                  return (
                    <div key={tx.transaction_id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isCredit ? "bg-emerald-100" : "bg-rose-100"}`}>
                          {isCredit
                            ? <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                            : <ArrowUpRight className="w-4 h-4 text-rose-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 capitalize">{tx.transaction_type.replace(/_/g, " ")}</p>
                          {tx.description && <p className="text-xs text-slate-400">{tx.description}</p>}
                          <p className="text-xs text-slate-400">{new Date(tx.transaction_date).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${isCredit ? "text-emerald-600" : "text-rose-600"}`}>
                        {isCredit ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      )}

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
