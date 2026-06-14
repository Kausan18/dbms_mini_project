"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    async function loadAccounts() {
      const res = await fetch("/api/admin/accounts");
      const data = await res.json();
      setAccounts(data.data || []);
    }

    loadAccounts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Account Management
      </h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.account_no}>
              <TableCell>{account.customer?.name}</TableCell>
              <TableCell>{account.customer?.email}</TableCell>
              <TableCell>{account.account_type}</TableCell>
              <TableCell>₹{account.balance}</TableCell>
              <TableCell>{account.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}