"use client"

import { useEffect, useState } from "react"
import { DataTable, Badge, LoadingSpinner, ConfirmDialog } from "@/components/ui"
import { Button } from "@/components/ui/button"

function formatDate(dateString: string) {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString()
}

type LoanRecord = Record<string, unknown> & {
  id?: string | number
  loan_id?: string | number
  customer_id?: string | number
  loan_amount?: number | string
  amount?: number | string
  interest_rate?: number | string
  application_date?: string
  created_at?: string
  applied_date?: string
  status?: string
}

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending")
  const [loans, setLoans] = useState<LoanRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Action state
  const [actionLoan, setActionLoan] = useState<Record<string, unknown> | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchLoans = async (tab: "pending" | "all") => {
    try {
      setLoading(true)
      setError(null)
      const url = tab === "pending" ? "/api/loans/pending" : "/api/manager/loans"
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch loans")
      const json = await res.json()
      
      let allLoans: LoanRecord[] = []
      
      // handle different structures gracefully
      if (Array.isArray(json)) {
        allLoans = json
      } else if (json.data && typeof json.data === "object" && !Array.isArray(json.data)) {
        // Handle object with pending/approved/rejected arrays
        allLoans = [
          ...(Array.isArray(json.data.pending) ? json.data.pending : []),
          ...(Array.isArray(json.data.approved) ? json.data.approved : []),
          ...(Array.isArray(json.data.rejected) ? json.data.rejected : [])
        ]
      } else if (json.data && Array.isArray(json.data)) {
        allLoans = json.data
      }
      
      setLoans(Array.isArray(allLoans) ? allLoans : [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch loans")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadLoans = async () => {
      await fetchLoans(activeTab)
    }

    void loadLoans()
  }, [activeTab])

  const [toastMessage, setToastMessage] = useState<{ msg: string; type: "error" | "success" } | null>(null)
  
  // Clear toast after 3s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const handleAction = async () => {
    if (!actionLoan || !actionType) return
    
    const previousLoans = [...loans]
    
    try {
      setActionLoading(true)
      
      // Optimistic update: instantly remove from the pending list
      if (activeTab === "pending") {
        setLoans(loans.filter((l) => (l.id || l.loan_id) !== (actionLoan.id || actionLoan.loan_id)))
      } else {
        // For all tab, optimistically update status
        setLoans(loans.map((l) => {
          if ((l.id || l.loan_id) === (actionLoan.id || actionLoan.loan_id)) {
            return { ...l, status: actionType === "approve" ? "approved" : "rejected" }
          }
          return l
        }))
      }

      const res = await fetch(`/api/loans/${actionLoan.id || actionLoan.loan_id}/${actionType}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manager_id: localStorage.getItem("manager_id") || "" }),
      })

      if (!res.ok) {
        setLoans(previousLoans) // revert
        throw new Error(`Failed to ${actionType} loan application`)
      }
      
      setActionLoan(null)
      setActionType(null)
      setToastMessage({ msg: "Loan successfully processed", type: "success" })
      
      // Silently sync background data
      fetchLoans(activeTab) 
    } catch (err: unknown) {
      setToastMessage({
        msg: err instanceof Error ? err.message : "Failed to process loan application",
        type: "error",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const allColumns = [
    { key: "customer_id", label: "Customer ID" },
    { key: "loan_type", label: "Loan Type" },
    { 
      key: "loan_amount", 
      label: "Amount", 
      render: (row: LoanRecord) => `₹${(Number(row.loan_amount ?? row.amount ?? 0)).toLocaleString("en-IN")}`
    },
    { 
      key: "interest_rate", 
      label: "Interest Rate", 
      render: (row: LoanRecord) => `${row.interest_rate ?? 0}%`
    },
    { 
      key: "application_date", 
      label: "Applied Date", 
      render: (row: LoanRecord) => formatDate(String(row.application_date ?? row.created_at ?? row.applied_date ?? ""))
    },
    {
      key: "status",
      label: "Status",
      render: (row: LoanRecord) => (
        <Badge variant={
          row.status === "approved" ? "approved" :
          row.status === "rejected" ? "rejected" :
          row.status === "pending" ? "pending" : "default"
        }>
          {String(row.status ?? "UNKNOWN").toUpperCase()}
        </Badge>
      )
    }
  ]

  const pendingColumns = [
    ...allColumns.filter(c => c.key !== "status"),
    {
      key: "actions",
      label: "Actions",
      render: (row: LoanRecord) => (
        <div className="flex gap-2 justify-end">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-green-600 border-green-600 hover:bg-green-50"
            onClick={() => { setActionLoan(row); setActionType("approve") }}
          >
            Approve
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={() => { setActionLoan(row); setActionType("reject") }}
          >
            Reject
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_2px_15px_rgba(0,0,0,0.03)] relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-widest mb-4 border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            Loans Operations
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Loans Management</h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">Review, evaluate, and manage institution loan applications flows.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-6 relative overflow-hidden">
        <div className="flex bg-slate-100 p-1.5 rounded-xl w-max border border-slate-200 shadow-inner relative z-10">
          <button
            className={`px-8 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === "pending" ? "bg-white text-indigo-700 shadow-md border border-slate-200/60" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Review
          </button>
          <button
            className={`px-8 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === "all" ? "bg-white text-indigo-700 shadow-md border border-slate-200/60" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"}`}
            onClick={() => setActiveTab("all")}
          >
            All Loans Portfolio
          </button>
        </div>

        {error ? (
          <div className="p-8 mt-4 rounded-2xl bg-rose-50 border border-rose-200 text-center text-rose-600 w-full shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-rose-500"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
            <p className="font-bold text-lg tracking-tight mb-1">Data Retrieval Failed</p>
            <p className="text-sm font-medium opacity-80">{error}</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center p-24 border border-slate-100 rounded-3xl bg-slate-50/50">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="relative z-10 w-full">
            <DataTable
              columns={activeTab === "pending" ? pendingColumns : allColumns}
              data={loans}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={actionLoan !== null}
        onOpenChange={(open) => { if (!open) setActionLoan(null) }}
        title={`${actionType === "approve" ? "Approve" : "Reject"} Loan Application`}
        description={`Are you sure you want to ${actionType} this loan request for Customer ${actionLoan?.customer_id}? This action completes the workflow and will notify the customer.`}
        onConfirm={handleAction}
        isConfirming={actionLoading}
        confirmLabel={actionType === "approve" ? "Yes, Authorize Approval" : "Yes, Decline Application"}
        variant={actionType === "reject" ? "destructive" : "default"}
      />

      {/* Minimal Toast Wrapper */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl font-semibold text-white animate-in slide-in-from-bottom-2 ${toastMessage.type === "error" ? "bg-rose-600" : "bg-emerald-600"}`}>
          {toastMessage.msg}
        </div>
      )}
    </div>
  )
}
