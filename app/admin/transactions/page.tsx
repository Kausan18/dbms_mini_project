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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function loadTransactions() {
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      setTransactions(data.data || []);
    }

    loadTransactions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Transaction Monitoring
      </h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.transaction_id}>
              <TableCell>{transaction.transaction_type}</TableCell>
              <TableCell>₹{transaction.amount}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                {new Date(transaction.transaction_date).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}