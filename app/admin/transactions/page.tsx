"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Tx = {
  transaction_id: string;
  account_no: string;
  transaction_type: string;
  amount: number;
  description?: string;
  transaction_date: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/transactions")
      .then((r) => r.json())
      .then((d) => setTransactions(d.data || []));
  }, []);

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.transaction_type === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-slate-900 to-[#0f172a] border border-slate-800 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-widest mb-4 border border-indigo-500/20">
          <ArrowLeftRight className="w-3.5 h-3.5" /> Transaction Monitor
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">All Transactions</h1>
        <p className="text-slate-400 mt-2 text-lg font-medium">{transactions.length} total transactions</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex gap-2">
          {["all", "deposit", "withdrawal"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize ${filter === f ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 bg-slate-50">
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs py-4 px-6">Type</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Amount</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Account</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Description</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase tracking-widest text-xs">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 font-semibold">No transactions found.</TableCell>
              </TableRow>
            ) : filtered.map((tx) => {
              const isCredit = tx.transaction_type === "deposit" || tx.transaction_type === "transfer_in";
              return (
                <TableRow key={tx.transaction_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isCredit ? "bg-emerald-100" : "bg-rose-100"}`}>
                        {isCredit ? <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />}
                      </div>
                      <span className="font-semibold text-slate-700 capitalize">{tx.transaction_type.replace(/_/g, " ")}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`font-bold ${isCredit ? "text-emerald-600" : "text-rose-600"}`}>
                    {isCredit ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">{tx.account_no.slice(0, 8)}...</TableCell>
                  <TableCell className="text-slate-500 text-sm">{tx.description || "—"}</TableCell>
                  <TableCell className="text-slate-400 text-sm">{new Date(tx.transaction_date).toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
