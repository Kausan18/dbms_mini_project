"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoansPage() {
  const [loans, setLoans] = useState([
    {
      id: 1,
      type: "Home Loan",
      amount: 500000,
      interestRate: 7.5,
      tenure: 240,
      emi: 3000,
      paidAmount: 50000,
      remainingAmount: 450000,
      status: "Active",
      applicationDate: "01 Jan 2024"
    },
    {
      id: 2,
      type: "Personal Loan",
      amount: 100000,
      interestRate: 8.5,
      tenure: 60,
      emi: 1800,
      paidAmount: 50000,
      remainingAmount: 50000,
      status: "Active",
      applicationDate: "15 Mar 2024"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [formData, setFormData] = useState({
    loanType: "Personal Loan",
    loanAmount: "",
    interestRate: "",
    tenure: "",
    purpose: ""
  });

  const totalLoans = loans.length;
  const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalEMI = loans.reduce((sum, loan) => sum + loan.emi, 0);
  const totalPaidAmount = loans.reduce((sum, loan) => sum + loan.paidAmount, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateEMI = (principal, rate, months) => {
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const handleApplyLoan = (e) => {
    e.preventDefault();
    if (!formData.loanAmount || !formData.interestRate || !formData.tenure) {
      alert("Please fill all fields");
      return;
    }

    const emi = calculateEMI(
      parseFloat(formData.loanAmount),
      parseFloat(formData.interestRate),
      parseInt(formData.tenure)
    );

    const newLoan = {
      id: loans.length + 1,
      type: formData.loanType,
      amount: parseFloat(formData.loanAmount),
      interestRate: parseFloat(formData.interestRate),
      tenure: parseInt(formData.tenure),
      emi: emi,
      paidAmount: 0,
      remainingAmount: parseFloat(formData.loanAmount),
      status: "Pending",
      applicationDate: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setLoans([...loans, newLoan]);
    setFormData({ loanType: "Personal Loan", loanAmount: "", interestRate: "", tenure: "", purpose: "" });
    setShowModal(false);
  };

  const handleDeleteLoan = (id) => {
    if (confirm("Are you sure you want to delete this loan?")) {
      setLoans(loans.filter(loan => loan.id !== id));
    }
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
            className="block px-4 py-3 rounded-2xl hover:bg-[#1A2554]"
          >
            Transactions
          </Link>

          <Link
            href="/loans"
            className="block px-4 py-3 rounded-2xl bg-[#5B4DFF]"
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
      <div className="flex-1 ml-64 p-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#020B2D] to-[#1A2554] rounded-3xl p-10 text-white mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              Loan Management
            </h1>

            <p className="text-gray-300 mt-2">
              View, track, and apply for loans easily.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#5B4DFF] hover:bg-[#7A6CFF] px-6 py-3 rounded-2xl font-semibold transition"
          >
            + Apply for Loan
          </button>
        </div>

        {/* Loan Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Active Loans</p>
                <p className="text-5xl font-bold mt-4">{totalLoans}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Loan Amount</p>
                <p className="text-4xl font-bold mt-4 text-red-600">₹{(totalLoanAmount / 100000).toFixed(0)}L</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Monthly EMI</p>
                <p className="text-4xl font-bold mt-4 text-orange-600">₹{totalEMI.toLocaleString()}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Amount Paid</p>
                <p className="text-4xl font-bold mt-4 text-green-600">₹{(totalPaidAmount / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

        </div>

        {/* Loans List */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">
              Your Loans
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Detailed information about all your loans
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Loan Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold">Interest Rate</th>
                  <th className="px-6 py-4 text-left font-semibold">EMI</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Progress</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loans.length > 0 ? (
                  loans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold">{loan.type}</p>
                        <p className="text-sm text-gray-500">{loan.applicationDate}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold">₹{loan.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 font-semibold">{loan.interestRate}%</td>
                      <td className="px-6 py-4 font-semibold">₹{loan.emi.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`${getStatusColor(loan.status)} px-3 py-1 rounded-full text-sm font-semibold`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="bg-gray-200 rounded-full h-2 mb-1">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{width: `${(loan.paidAmount / loan.amount) * 100}%`}}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600">
                            {Math.round((loan.paidAmount / loan.amount) * 100)}% Paid
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedLoan(loan);
                              setShowDetailsModal(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteLoan(loan.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No loans found. Apply for a loan to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Apply Loan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Apply for Loan</h2>

            <form onSubmit={handleApplyLoan} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Loan Type
                </label>
                <select
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option>Personal Loan</option>
                  <option>Home Loan</option>
                  <option>Auto Loan</option>
                  <option>Education Loan</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  placeholder="e.g., 8.5"
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Tenure (Months)
                </label>
                <input
                  type="number"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  placeholder="e.g., 60"
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Purpose
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  placeholder="Purpose of loan"
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              {formData.loanAmount && formData.interestRate && formData.tenure && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Estimated EMI:</span> ₹
                    {calculateEMI(
                      parseFloat(formData.loanAmount),
                      parseFloat(formData.interestRate),
                      parseInt(formData.tenure)
                    ).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#5B4DFF] text-white py-2 rounded-lg hover:bg-[#7A6CFF] transition font-semibold"
                >
                  Apply for Loan
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

      {/* Loan Details Modal */}
      {showDetailsModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">{selectedLoan.type}</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Loan Amount</p>
                  <p className="text-2xl font-bold mt-2">₹{selectedLoan.amount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Interest Rate</p>
                  <p className="text-2xl font-bold mt-2">{selectedLoan.interestRate}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Monthly EMI</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">₹{selectedLoan.emi.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Tenure</p>
                  <p className="text-2xl font-bold mt-2">{selectedLoan.tenure} mo.</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  <span className="font-semibold">Repayment Progress</span>
                </p>
                <div className="w-full bg-gray-300 rounded-full h-3 mb-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full" 
                    style={{width: `${(selectedLoan.paidAmount / selectedLoan.amount) * 100}%`}}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600">Paid</p>
                    <p className="font-bold">₹{selectedLoan.paidAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Remaining</p>
                    <p className="font-bold">₹{selectedLoan.remainingAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Progress</p>
                    <p className="font-bold">{Math.round((selectedLoan.paidAmount / selectedLoan.amount) * 100)}%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <span className={`${getStatusColor(selectedLoan.status)} px-3 py-1 rounded-full text-sm font-semibold inline-block mt-1`}>
                    {selectedLoan.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Application Date</p>
                  <p className="font-bold mt-1">{selectedLoan.applicationDate}</p>
                </div>
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