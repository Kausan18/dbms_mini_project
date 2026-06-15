"use client";

import { useEffect, useState } from "react";
import { CreditCard, Plus, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Account = {
  account_no: string;
  account_type: string;
  balance: number;
  status: string;
  created_at: string;
  customer?: { name?: string; email?: string };
};

type Customer = {
  customer_id: string;
  name: string;
  email: string;
};

const ACCOUNT_TYPES = ["savings", "checking", "current"];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Form state
  const [customerId, setCustomerId] = useState("");
  const [accountType, setAccountType] = useState("savings");

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAccounts = () =>
    fetch("/api/admin/accounts")
      .then((r) => r.json())
      .then((d) => setAccounts(d.data || []));

  useEffect(() => {
    fetchAccounts();
    // Also fetch customers for the dropdown
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.data || []));
  }, []);

  const handleCreate = async () => {
    if (!customerId) {
      showToast("Please select a customer.", false);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: customerId, account_type: accountType }),
      });
      const d = await res.json();
      if (!d.success) {
        showToast(d.error || "Failed to create account.", false);
        return;
      }
      showToast("Account created successfully!", true);
      setShowForm(false);
      setCustomerId("");
      setAccountType("savings");
      await fetchAccounts();
    } catch {
      showToast("Network error. Please try again.", false);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = accounts.filter(
    (a) =>
      !search ||
      a.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.account_type.toLowerCase().includes(search.toLowerCase()) ||
      a.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-slate-900 to-[#0f172a] border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-widest mb-4 border border-indigo-500/20">
            <CreditCard className="w-3.5 h-3.5" /> Account Overview
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">All Bank Accounts</h1>
          <p className="text-slate-400 mt-2 text-lg font-medium">{accounts.length} accounts total</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Account
        </button>
      </div>

      {/* Create account form */}
      {showForm && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Create Bank Account</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 max-w-2xl">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                Customer
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">— Select a customer —</option>
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 capitalize"
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={submitting}
            className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create Account
          </button>
        </div>
      )}

      {/* Accounts table */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <input
            type="text"
            placeholder="Filter by customer name, type, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 bg-slate-50">
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs py-4 px-6">Customer</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Type</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Balance</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Status</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Account No</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Opened</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-slate-400 font-semibold">No accounts found.</TableCell>
              </TableRow>
            ) : filtered.map((a) => (
              <TableRow key={a.account_no} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <TableCell className="py-4 px-6">
                  <p className="font-semibold text-slate-800">{a.customer?.name || "—"}</p>
                  <p className="text-xs text-slate-400">{a.customer?.email || ""}</p>
                </TableCell>
                <TableCell className="capitalize font-semibold text-slate-700">{a.account_type}</TableCell>
                <TableCell className="font-bold text-indigo-600">₹{Number(a.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell><Badge variant={a.status === "active" ? "active" : "inactive"}>{a.status.toUpperCase()}</Badge></TableCell>
                <TableCell className="font-mono text-xs text-slate-400">{a.account_no.slice(0, 8)}...{a.account_no.slice(-4)}</TableCell>
                <TableCell className="text-slate-400 text-sm">{new Date(a.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl font-semibold text-white animate-in slide-in-from-bottom-2 ${toast.ok ? "bg-emerald-600" : "bg-rose-600"}`}>
          {toast.ok ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}