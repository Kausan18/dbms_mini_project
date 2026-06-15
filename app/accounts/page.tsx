"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      type: "Savings Account",
      balance: 50000,
      accountNumber: "XXXX5678",
      status: "Active",
      branch: "Chennai Main",
      gradient: "from-[#5B4DFF] to-[#7A6CFF]",
      interestRate: 4.5,
      createdDate: "01 Jan 2024"
    },
    {
      id: 2,
      type: "Current Account",
      balance: 20000,
      accountNumber: "XXXX1234",
      status: "Active",
      branch: "Chennai City",
      gradient: "from-[#020B2D] to-[#1A2554]",
      interestRate: 0,
      createdDate: "15 Mar 2024"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactionType, setTransactionType] = useState("deposit");
  
  const [formData, setFormData] = useState({
    accountType: "Savings Account",
    initialBalance: "",
    branch: ""
  });

  const [transactionData, setTransactionData] = useState({
    amount: "",
    description: ""
  });

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const activeAccounts = accounts.filter(acc => acc.status === "Active").length;
  const totalAccounts = accounts.length;

  // Load from localStorage on mount
  useEffect(() => {
    const storedAccounts = localStorage.getItem('bankAccounts');
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    }
  }, []);

  // Listen for updates from other pages
  useEffect(() => {
    const handleDataUpdate = (event) => {
      const { detail } = event;
      if (detail?.accounts) setAccounts(detail.accounts);
    };

    window.addEventListener('bankDataUpdate', handleDataUpdate);
    return () => window.removeEventListener('bankDataUpdate', handleDataUpdate);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!formData.initialBalance || !formData.branch) {
      alert("Please fill all fields");
      return;
    }

    const gradients = [
      "from-[#00D084] to-[#00A86B]",
      "from-[#FF6B6B] to-[#FF4444]",
      "from-[#FFD93D] to-[#FFA500]",
      "from-[#6BCB77] to-[#4D96A9]"
    ];

    const newAccount = {
      id: Math.max(...accounts.map(a => a.id), 0) + 1,
      type: formData.accountType,
      balance: parseFloat(formData.initialBalance),
      accountNumber: `XXXX${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      status: "Active",
      branch: formData.branch,
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      interestRate: formData.accountType === "Savings Account" ? 4.5 : 0,
      createdDate: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    
    // Save to localStorage
    localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
    
    // Dispatch event for dashboard
    window.dispatchEvent(new CustomEvent('bankDataUpdate', {
      detail: { accounts: updatedAccounts }
    }));

    setFormData({ accountType: "Savings Account", initialBalance: "", branch: "" });
    setShowModal(false);
  };

  const handleDeleteAccount = (id) => {
    if (confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
      const updatedAccounts = accounts.filter(acc => acc.id !== id);
      setAccounts(updatedAccounts);
      
      localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
      window.dispatchEvent(new CustomEvent('bankDataUpdate', {
        detail: { accounts: updatedAccounts }
      }));
    }
  };

  const handleTransaction = (e, account) => {
    e.preventDefault();
    
    if (!transactionData.amount || !transactionData.description) {
      alert("Please fill all fields");
      return;
    }

    const amount = parseFloat(transactionData.amount);
    let newBalance = account.balance;

    if (transactionType === "deposit") {
      newBalance += amount;
    } else if (transactionType === "withdraw") {
      if (amount > account.balance) {
        alert("Insufficient balance");
        return;
      }
      newBalance -= amount;
    }

    const updatedAccounts = accounts.map(acc => 
      acc.id === account.id ? { ...acc, balance: newBalance } : acc
    );

    setAccounts(updatedAccounts);
    
    localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
    window.dispatchEvent(new CustomEvent('bankDataUpdate', {
      detail: { accounts: updatedAccounts }
    }));

    setTransactionData({ amount: "", description: "" });
    setShowTransactionModal(false);
  };

  const openTransactionModal = (account, type) => {
    setSelectedAccount(account);
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  const openDetailsModal = (account) => {
    setSelectedAccount(account);
    setShowDetailsModal(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FC]">

      {/* Sidebar */}
      <div className="w-64 bg-[#020B2D] text-white p-6 fixed h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold mb-10">
          BankManager
        </h1>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554] transition"
          >
            Dashboard
          </Link>

          <Link
            href="/accounts"
            className="block px-4 py-3 rounded-2xl bg-[#5B4DFF]"
          >
            Accounts
          </Link>

          <Link
            href="/transactions"
            className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554] transition"
          >
            Transactions
          </Link>

          <Link
            href="/loans"
            className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554] transition"
          >
            Loans
          </Link>

          <Link
            href="/login"
            className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554] transition"
          >
            Logout
          </Link>
        </div>

        {/* Live Balance */}
        <div className="mt-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
          <p className="text-xs opacity-80">💰 Total Balance</p>
          <p className="text-2xl font-bold mt-2">₹{(totalBalance / 1000).toFixed(1)}K</p>
          <p className="text-xs mt-2 opacity-80">Across {totalAccounts} accounts</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#020B2D] to-[#1A2554] rounded-3xl p-10 text-white mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              My Accounts
            </h1>
            <p className="text-gray-300 mt-2">
              Manage and monitor all your bank accounts.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#5B4DFF] hover:bg-[#7A6CFF] px-6 py-3 rounded-2xl font-semibold transition shadow-lg"
          >
            + Add Account
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Total Accounts</p>
                <h2 className="text-5xl font-bold mt-4">{totalAccounts}</h2>
                <p className="text-xs text-green-600 mt-2">✓ All Active</p>
              </div>
              <div className="text-4xl">💳</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Total Balance</p>
                <h2 className="text-4xl font-bold mt-4 text-green-600">₹{(totalBalance / 1000).toFixed(0)}K</h2>
                <p className="text-xs text-gray-500 mt-2">Live updated</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Active Accounts</p>
                <h2 className="text-5xl font-bold mt-4 text-green-600">{activeAccounts}</h2>
                <p className="text-xs text-gray-500 mt-2">Operating status</p>
              </div>
              <div className="text-4xl">✓</div>
            </div>
          </div>

        </div>

        {/* Account Cards */}
        <div className="space-y-6">
          {accounts.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {accounts.map((account) => (
                <div key={account.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition">

                  {/* Account Header */}
                  <div className={`bg-gradient-to-r ${account.gradient} p-8 text-white`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm opacity-80">{account.type}</p>
                        <h2 className="text-4xl font-bold mt-4">₹{account.balance.toLocaleString()}</h2>
                      </div>
                      <div className="text-right text-sm">
                        <p className="opacity-80">Account Number</p>
                        <p className="font-bold text-lg">{account.accountNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="p-6 space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Status</p>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold inline-block mt-1">
                          {account.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Branch</p>
                        <p className="font-semibold mt-1">{account.branch}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Interest Rate</p>
                        <p className="font-semibold text-blue-600 mt-1">{account.interestRate}% p.a.</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Created</p>
                        <p className="font-semibold mt-1">{account.createdDate}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t pt-6 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => openTransactionModal(account, "deposit")}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      >
                        💰 Deposit
                      </button>
                      <button
                        onClick={() => openTransactionModal(account, "withdraw")}
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      >
                        🏧 Withdraw
                      </button>
                      <button
                        onClick={() => openDetailsModal(account)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
                      >
                        📋 Details
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg">No accounts yet. Create your first account!</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 bg-[#5B4DFF] text-white px-6 py-2 rounded-lg hover:bg-[#7A6CFF] transition"
              >
                + Create Account
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Add Account Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 shadow-2xl max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Account</h2>

            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Account Type</label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5B4DFF] focus:border-transparent"
                >
                  <option>Savings Account</option>
                  <option>Current Account</option>
                  <option>Student Account</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Initial Balance (₹)</label>
                <input
                  type="number"
                  name="initialBalance"
                  value={formData.initialBalance}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5B4DFF] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  placeholder="Enter branch name"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5B4DFF] focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#5B4DFF] text-white py-2 rounded-lg hover:bg-[#7A6CFF] transition font-semibold"
                >
                  Create Account
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

      {/* Transaction Modal */}
      {showTransactionModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">
              {transactionType === "deposit" ? "💰 Deposit Funds" : "🏧 Withdraw Funds"}
            </h2>
            <p className="text-gray-500 mb-6">{selectedAccount.type} - {selectedAccount.accountNumber}</p>

            <form onSubmit={(e) => handleTransaction(e, selectedAccount)} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={transactionData.amount}
                  onChange={handleTransactionChange}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5B4DFF] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description/Reference</label>
                <input
                  type="text"
                  name="description"
                  value={transactionData.description}
                  onChange={handleTransactionChange}
                  placeholder="e.g., Salary deposit, ATM withdrawal"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#5B4DFF] focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Current Balance:</span> ₹{selectedAccount.balance.toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#5B4DFF] text-white py-2 rounded-lg hover:bg-[#7A6CFF] transition font-semibold"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setShowTransactionModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Details Modal */}
      {showDetailsModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">{selectedAccount.type}</h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">Account Number</p>
                <p className="text-xl font-bold mt-2">{selectedAccount.accountNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Current Balance</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">₹{selectedAccount.balance.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Interest Rate</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{selectedAccount.interestRate}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Status</p>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold inline-block mt-2">
                    {selectedAccount.status}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Created Date</p>
                  <p className="font-bold mt-2">{selectedAccount.createdDate}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">Branch</p>
                <p className="font-bold mt-2">{selectedAccount.branch}</p>
              </div>
            </div>

            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition font-semibold mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}