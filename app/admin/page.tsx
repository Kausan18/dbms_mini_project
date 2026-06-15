"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui";
import { Users, CreditCard, ArrowLeftRight } from "lucide-react";

export default function AdminDashboard() {
  const [customerCount, setCustomerCount] = useState(0);
  const [accountCount, setAccountCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const customersRes = await fetch("/api/admin/customers");
        const customersData = await customersRes.json();

        const accountsRes = await fetch("/api/admin/accounts");
        const accountsData = await accountsRes.json();

        const transactionsRes = await fetch("/api/admin/transactions");
        const transactionsData = await transactionsRes.json();

        setCustomerCount(customersData.data?.length || 0);
        setAccountCount(accountsData.data?.length || 0);
        setTransactionCount(transactionsData.data?.length || 0);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  return (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-8 rounded-3xl bg-linear-to-tr from-slate-900 to-[#0f172a] shadow-2xl relative overflow-hidden border border-slate-800">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-widest mb-4 border border-indigo-500/20">
          Administrative Control Center
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Admin Dashboard
        </h1>

        <p className="text-slate-400 mt-2 font-medium text-lg">
          Overview of customers, accounts and transactions.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="h-11 px-6 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg hover:bg-indigo-500"
      >
        Refresh Overview
      </button>
    </div>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      <StatCard
        title="Total Customers"
        value={customerCount}
        icon={<Users className="w-6 h-6 text-indigo-600" />}
        className="border-t-4 border-t-indigo-500"
      />

      <StatCard
        title="Total Accounts"
        value={accountCount}
        icon={<CreditCard className="w-6 h-6 text-emerald-600" />}
        className="border-t-4 border-t-emerald-500"
      />

      <StatCard
        title="Total Transactions"
        value={transactionCount}
        icon={<ArrowLeftRight className="w-6 h-6 text-amber-500" />}
        className="border-t-4 border-t-amber-500"
      />

    </div>
  </div>
)
}