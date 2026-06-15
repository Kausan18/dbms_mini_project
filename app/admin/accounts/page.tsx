"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
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

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/accounts")
      .then((r) => r.json())
      .then((d) => setAccounts(d.data || []));
  }, []);

  const filtered = accounts.filter(
    (a) =>
      !search ||
      a.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.account_type.toLowerCase().includes(search.toLowerCase()) ||
      a.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-slate-900 to-[#0f172a] border border-slate-800 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-widest mb-4 border border-indigo-500/20">
          <CreditCard className="w-3.5 h-3.5" /> Account Overview
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">All Bank Accounts</h1>
        <p className="text-slate-400 mt-2 text-lg font-medium">{accounts.length} accounts total</p>
      </div>

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
    </div>
  );
}
