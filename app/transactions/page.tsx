"use client";

import Link from "next/link";
import { useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "Salary Credit",
      amount: 30000,
      date: "15 June 2026",
      status: "Completed",
      category: "Income"
    },
    {
      id: 2,
      type: "ATM Withdrawal",
      amount: -2000,
      date: "14 June 2026",
      status: "Completed",
      category: "Withdrawal"
    },
    {
      id: 3,
      type: "Online Shopping",
      amount: -5500,
      date: "13 June 2026",
      status: "Pending",
      category: "Spending"
    },
    {
      id: 4,
      type: "Interest Credit",
      amount: 1500,
      date: "12 June 2026",
      status: "Completed",
      category: "Income"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("deposit");
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    recipientAccount: "",
    fromAccount: ""
  });

  const totalTransactions = transactions.length;
  const moneyIn = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const moneyOut = Math.abs(
    transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) {
      alert("Please fill all fields");
      return;
    }

    let amount = parseFloat(formData.amount);
    let transactionType = formData.description;

    if (modalType === "withdrawal") {
      amount = -amount;
      transactionType = `Withdrawal - ${formData.description}`;
    } else if (modalType === "transfer") {
      amount = -amount;
      transactionType = `Transfer to ${formData.recipientAccount}`;
    }

    const newTransaction = {
      id: transactions.length + 1,
      type: transactionType,
      amount: amount,
      date: new Date().toLocaleDateString("en-GB"),
      status: "Completed",
      category: modalType === "deposit" ? "Income" : "Spending"
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({ amount: "", description: "", recipientAccount: "", fromAccount: "" });
    setShowModal(false);
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FC]">

      {/* Sidebar */}
      <div className="w-64 bg-[#020B2D] text-white p-6">
        <h1 className="text-3xl font-bold mb-10">
          BankManager
        </h1>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554]"
          >
            Dashboard
          </Link>

          <Link
            href="/accounts"
            className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554]"
          >
            Accounts
          </Link>

          <Link
            href="/transactions"
            className="block px-4 py-3 rounded-2xl bg-[#5B4DFF]"
          >
            Transactions
          </Link>

          <Link
            href="/loans"
            className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554]"
          >
            Loans
          </Link>

          <Link
            href="/login"
            className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554]"
          >
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Hero Section */}
        <div className="bg-[#020B2D] rounded-3xl p-10 text-white mb-8">
          <h1 className="text-4xl font-bold">
            Transactions
          </h1>

          <p className="text-gray-300 mt-2">
            Monitor and manage all your banking transactions.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">
            <p className="text-gray-500">
              Total Transactions
            </p>

            <h2 className="text-5xl font-bold mt-4">
              {totalTransactions}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">
            <p className="text-gray-500">
              Money In
            </p>

            <h2 className="text-4xl font-bold mt-4 text-green-600">
              +₹{(moneyIn / 1000).toFixed(0)}K
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">
            <p className="text-gray-500">
              Money Out
            </p>

            <h2 className="text-4xl font-bold mt-4 text-red-500">
              -₹{(moneyOut / 1000).toFixed(0)}K
            </h2>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => openModal("deposit")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl font-semibold transition shadow-lg"
          >
            💰 Deposit Funds
          </button>
          <button
            onClick={() => openModal("withdrawal")}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-semibold transition shadow-lg"
          >
            🏧 Withdraw Funds
          </button>
          <button
            onClick={() => openModal("transfer")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-2xl font-semibold transition shadow-lg"
          >
            💸 Transfer Funds
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 rounded-2xl font-semibold transition shadow-lg"
          >
            📊 View Report
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">
              Recent Transactions
            </h2>

            <p className="text-gray-500 mt-1">
              Latest activities from your accounts
            </p>
          </div>

          <div className="divide-y max-h-96 overflow-y-auto">

            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">

                  <div>
                    <p className="font-semibold text-lg">
                      {transaction.type}
                    </p>

                    <p className="text-gray-500">
                      {transaction.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold text-xl ${transaction.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                    </p>

                    <span className={`${getStatusColor(transaction.status)} px-3 py-1 rounded-full text-sm`}>
                      {transaction.status}
                    </span>
                  </div>

                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No transactions yet
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">
              {modalType === "deposit" && "Deposit Funds"}
              {modalType === "withdrawal" && "Withdraw Funds"}
              {modalType === "transfer" && "Transfer Funds"}
            </h2>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              
              {modalType === "transfer" && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    From Account
                  </label>
                  <select
                    name="fromAccount"
                    value={formData.fromAccount}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">Select Account</option>
                    <option>Savings Account (XXXX5678)</option>
                    <option>Current Account (XXXX1234)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              {modalType === "transfer" && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Recipient Account Number
                  </label>
                  <input
                    type="text"
                    name="recipientAccount"
                    value={formData.recipientAccount}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description / Reference
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={modalType === "deposit" ? "e.g., Salary, Bonus" : "e.g., Rent, Shopping"}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#5B4DFF] text-white py-2 rounded-lg hover:bg-[#7A6CFF] transition font-semibold"
                >
                  Confirm Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}