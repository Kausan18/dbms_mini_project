"use client";

import { useEffect, useState } from "react";

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4 shadow">
          <h2 className="text-lg font-semibold">
            Total Customers
          </h2>
          <p className="text-3xl">{customerCount}</p>
        </div>

        <div className="border rounded p-4 shadow">
          <h2 className="text-lg font-semibold">
            Total Accounts
          </h2>
          <p className="text-3xl">{accountCount}</p>
        </div>

        <div className="border rounded p-4 shadow">
          <h2 className="text-lg font-semibold">
            Total Transactions
          </h2>
          <p className="text-3xl">{transactionCount}</p>
        </div>
      </div>
    </div>
  );
}