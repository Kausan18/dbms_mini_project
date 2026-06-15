"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState({
    name: "Lohit Ganesh Naidu",
    email: "lohit@example.com",
    phone: "+91 98765 43210",
    memberSince: "January 2024"
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editProfile, setEditProfile] = useState(userProfile);

  // Live accounts data
  const [accounts, setAccounts] = useState([
    { id: 1, type: "Savings", balance: 50000, accountNumber: "XXXX5678" },
    { id: 2, type: "Current", balance: 20000, accountNumber: "XXXX1234" }
  ]);

  // Live transactions data
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Salary Credit", amount: 30000, date: "15 June 2026", status: "Completed" },
    { id: 2, type: "ATM Withdrawal", amount: -2000, date: "14 June 2026", status: "Completed" },
    { id: 3, type: "Online Shopping", amount: -5500, date: "13 June 2026", status: "Pending" },
    { id: 4, type: "Interest Credit", amount: 1500, date: "12 June 2026", status: "Completed" }
  ]);

  // Live loans data
  const [loans, setLoans] = useState([
    { id: 1, type: "Home Loan", amount: 500000, emi: 5000, remainingAmount: 450000, status: "Active", paidAmount: 50000 },
    { id: 2, type: "Personal Loan", amount: 100000, emi: 2500, remainingAmount: 50000, status: "Active", paidAmount: 50000 }
  ]);

  // Real-time calculations
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalLoans = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const netWorth = totalBalance - totalLoans;
  const totalMonthlyEMI = loans.reduce((sum, loan) => sum + loan.emi, 0);
  const totalPaidLoans = loans.reduce((sum, loan) => sum + loan.paidAmount, 0);
  
  // Money in and out this month
  const moneyIn = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const moneyOut = Math.abs(
    transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Active loans count
  const activeLoansCount = loans.filter(l => l.status === "Active").length;

  // Sync data from localStorage on initial load
  useEffect(() => {
    const storedAccounts = localStorage.getItem('bankAccounts');
    const storedTransactions = localStorage.getItem('bankTransactions');
    const storedLoans = localStorage.getItem('bankLoans');

    if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedLoans) setLoans(JSON.parse(storedLoans));
  }, []);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'bankAccounts' && e.newValue) {
        setAccounts(JSON.parse(e.newValue));
      }
      if (e.key === 'bankTransactions' && e.newValue) {
        setTransactions(JSON.parse(e.newValue));
      }
      if (e.key === 'bankLoans' && e.newValue) {
        setLoans(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom events from same tab/window
  useEffect(() => {
    const handleDataUpdate = (event) => {
      const { detail } = event;
      if (detail?.accounts) setAccounts(detail.accounts);
      if (detail?.transactions) setTransactions(detail.transactions);
      if (detail?.loans) setLoans(detail.loans);
    };

    window.addEventListener('bankDataUpdate', handleDataUpdate);
    return () => window.removeEventListener('bankDataUpdate', handleDataUpdate);
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    setUserProfile(editProfile);
    setShowProfileModal(false);
  };

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Completed") return "bg-blue-100 text-blue-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FC]">

      {/* Sidebar */}
      <div className="w-64 bg-[#020B2D] text-white p-6 fixed h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold mb-10">
          BankManager
        </h1>

        <div className="space-y-3">
          <Link href="/dashboard" className="block px-4 py-3 rounded-2xl bg-[#5B4DFF]">
            Dashboard
          </Link>

          <Link href="/accounts" className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554]">
            Accounts
          </Link>

          <Link href="/transactions" className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554]">
            Transactions
          </Link>

          <Link href="/loans" className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554]">
            Loans
          </Link>

          <Link href="/login" className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554]">
            Logout
          </Link>
        </div>

        {/* User Profile Card in Sidebar */}
        <div className="mt-12 bg-[#1A2554] rounded-2xl p-4">
          <p className="text-sm text-gray-300">Logged in as</p>
          <p className="font-bold mt-2">{userProfile.name}</p>
          <p className="text-xs text-gray-400 mt-1">{userProfile.email}</p>
          <button
            onClick={() => setShowProfileModal(true)}
            className="mt-3 w-full bg-[#5B4DFF] hover:bg-[#7A6CFF] py-2 rounded-lg text-sm"
          >
            Edit Profile
          </button>
        </div>

        {/* Live Balance Widget */}
        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
          <p className="text-xs opacity-80">💰 Live Balance</p>
          <p className="text-2xl font-bold mt-2">₹{(totalBalance / 1000).toFixed(1)}K</p>
          <p className="text-xs mt-2 opacity-80">🔄 Updated now</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">

        {/* Welcome Hero Section with Live Data */}
        <div className="bg-gradient-to-r from-[#020B2D] to-[#1A2554] rounded-3xl p-10 text-white mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome Back, {userProfile.name.split(' ')[0]} 👋
            </h1>

            <p className="text-gray-300 mt-2">
              Manage your banking activities easily. Today is {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="mt-4 flex gap-6">
              <div>
                <p className="text-sm text-gray-300">Money In (This Month)</p>
                <p className="text-2xl font-bold text-green-400">+₹{(moneyIn / 1000).toFixed(1)}K</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Money Out (This Month)</p>
                <p className="text-2xl font-bold text-red-400">-₹{(moneyOut / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">Total Balance</p>
            <p className="text-6xl font-bold mt-2">₹{(totalBalance / 1000).toFixed(0)}K</p>
            <p className="text-xs text-green-300 mt-2">🔄 Live Updated</p>
          </div>
        </div>

        {/* Key Metrics Cards - Live Data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Active Accounts</p>
                <p className="text-5xl font-bold mt-4">{accounts.length}</p>
                <p className="text-xs text-green-600 mt-2">✓ All Active</p>
              </div>
              <div className="text-4xl">💳</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Balance</p>
                <p className="text-5xl font-bold mt-4 text-green-600">₹{(totalBalance / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-500 mt-2">Across {accounts.length} accounts</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Active Loans</p>
                <p className="text-5xl font-bold mt-4">{activeLoansCount}</p>
                <p className="text-xs text-orange-600 mt-2">Monthly EMI: ₹{totalMonthlyEMI.toLocaleString()}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Net Worth</p>
                <p className={`text-5xl font-bold mt-4 ${netWorth > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ₹{(netWorth / 1000).toFixed(0)}K
                </p>
                <p className={`text-xs mt-2 ${netWorth > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {netWorth > 0 ? '📈 Positive' : '📉 Negative'}
                </p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>

        </div>

        {/* Account Summary & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Account Summary - Live */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Account Summary</h2>
                  <p className="text-xs text-gray-500 mt-1">Real-time balances</p>
                </div>
                <span className="text-2xl">🔄</span>
              </div>

              <div className="divide-y">
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <div key={account.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{account.type}</p>
                          <p className="text-sm text-gray-500">{account.accountNumber}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-green-600">₹{account.balance.toLocaleString()}</p>
                      <div className="mt-2 bg-green-50 rounded px-2 py-1">
                        <p className="text-xs text-green-700">✓ Active</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No accounts
                  </div>
                )}
              </div>

              <Link
                href="/accounts"
                className="block bg-gray-50 hover:bg-gray-100 p-4 text-center text-purple-600 font-semibold transition"
              >
                Manage Accounts →
              </Link>
            </div>
          </div>

          {/* Recent Transactions - Live */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Recent Transactions</h2>
                  <p className="text-gray-500 text-sm mt-1">Latest {Math.min(4, transactions.length)} activities</p>
                </div>
                <span className="text-2xl">📊</span>
              </div>

              <div className="divide-y max-h-80 overflow-y-auto">
                {transactions.length > 0 ? (
                  transactions.slice(0, 4).map((transaction) => (
                    <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex-1">
                        <p className="font-semibold">{transaction.type}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${transaction.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${transaction.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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

              <Link
                href="/transactions"
                className="block bg-gray-50 hover:bg-gray-100 p-4 text-center text-purple-600 font-semibold transition"
              >
                View All Transactions →
              </Link>
            </div>
          </div>

        </div>

        {/* Active Loans & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Active Loans - Live */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Active Loans</h2>
                  <p className="text-gray-500 text-sm mt-1">Your current loan obligations</p>
                </div>
                <span className="text-2xl">💳</span>
              </div>

              <div className="divide-y">
                {loans.length > 0 ? (
                  loans.map((loan) => (
                    <div key={loan.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-lg">{loan.type}</p>
                          <p className="text-sm text-gray-500">EMI: ₹{loan.emi.toLocaleString()}/month</p>
                        </div>
                        <span className={`${getStatusColor(loan.status)} px-3 py-1 rounded-full text-sm font-semibold`}>
                          {loan.status}
                        </span>
                      </div>

                      <div className="bg-gray-100 rounded-lg p-3 mb-3">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Remaining Amount</span>
                          <span className="font-bold">₹{loan.remainingAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${(loan.paidAmount / loan.amount) * 100}%`}}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                          <span>Paid: ₹{loan.paidAmount.toLocaleString()}</span>
                          <span>{Math.round((loan.paidAmount / loan.amount) * 100)}% Complete</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No active loans
                  </div>
                )}
              </div>

              <Link
                href="/loans"
                className="block bg-gray-50 hover:bg-gray-100 p-4 text-center text-purple-600 font-semibold transition"
              >
                View All Loans →
              </Link>
            </div>
          </div>

          {/* Quick Actions & Financial Summary */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>

              <div className="space-y-3">
                <Link
                  href="/transactions"
                  className="block bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-2xl font-semibold transition text-center"
                >
                  💰 Deposit
                </Link>

                <Link
                  href="/transactions"
                  className="block bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-2xl font-semibold transition text-center"
                >
                  🏧 Withdraw
                </Link>

                <Link
                  href="/transactions"
                  className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-2xl font-semibold transition text-center"
                >
                  💸 Transfer
                </Link>

                <Link
                  href="/loans"
                  className="block bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-2xl font-semibold transition text-center"
                >
                  📋 Apply Loan
                </Link>
              </div>
            </div>

            {/* Financial Summary - Live */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-lg font-bold mb-4">Financial Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Assets</span>
                  <span className="font-bold text-green-600">₹{(totalBalance / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Liabilities</span>
                  <span className="font-bold text-red-600">₹{(totalLoans / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly EMI</span>
                  <span className="font-bold text-orange-600">₹{totalMonthlyEMI.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Net Worth</span>
                  <span className={`font-bold text-lg ${netWorth > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    ₹{(netWorth / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  💡 Your monthly EMI commitment is <span className="font-bold">₹{totalMonthlyEMI.toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editProfile.name}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editProfile.email}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editProfile.phone}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="flex-1 bg-[#5B4DFF] text-white py-2 rounded-lg hover:bg-[#7A6CFF] transition font-semibold"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
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