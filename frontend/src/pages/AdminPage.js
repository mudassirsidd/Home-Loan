import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState("All");
   const [emiHistory, setEmiHistory] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

  
  const handleViewHistory = async (loanId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(

        `http://localhost:3000/emi-payments/history/${loanId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmiHistory(res.data);
      setShowHistoryModal(true);
    } catch (error) {
      console.error("Error fetching EMI history:", error);
      alert("Failed to load EMI payment history.");
    }
  };
  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/loan/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoans(res.data);
    } catch (err) {
      console.error("Error fetching loans:", err);
      alert("Failed to load loan data");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (loanId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/loan/${loanId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh loan list
      fetchLoans();
    } catch (err) {
      console.error("Error updating loan status:", err);
      alert("Failed to update loan status");
    }
  };

  


  useEffect(() => {
    fetchLoans();
   
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Unique banks list for dropdown
  const uniqueBanks = [...new Set(loans.map((loan) => loan.bank_name))];

  // Filtered loans based on selected bank
  const filteredLoans =
    selectedBank === "All"
      ? loans
      : loans.filter((loan) => loan.bank_name === selectedBank);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-indigo-800 to-blue-900 text-white px-4 py-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold">🛠️ Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-lg transition duration-300"
          >
            Logout
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 className="text-xl font-semibold">💳 Loan Management</h3>
            <div className="flex items-center gap-2">
              <label className="text-white font-medium">Filter by Bank:</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="bg-white text-black px-4 py-1.5 rounded-md shadow focus:outline-none"
              >
                <option value="All">All Banks</option>
                {uniqueBanks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-center py-10 text-gray-300 animate-pulse">
              Loading loans...
            </p>
          ) : filteredLoans.length === 0 ? (
            <p className="text-center py-10 text-gray-300">
              No loan records found.
            </p>
          ) : (
            <div className="overflow-auto rounded-lg border border-white/20">
              <table className="w-full min-w-[900px] text-sm text-white bg-white/5">
                <thead className="bg-white/20 text-white uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">User Email</th>
                    <th className="p-3 text-left">User Name</th>
                    <th className="p-3 text-left">Loan Amount</th>
                    <th className="p-3 text-left">Bank</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Actions</th>
                    <th className="p-3 text-left">EMI History</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="hover:bg-white/10 border-b border-white/10 transition duration-200"
                    >
                      <td className="p-3">{loan.id}</td>
                      <td className="p-3">{loan.user?.email}</td>
                      <td className="p-3">{loan.user?.name}</td>
                      <td className="p-3">₹{loan.loanAmount}</td>
                      <td className="p-3">{loan.bank_name}</td>
                      <td className="p-3 capitalize">
                        {loan.status === 0 && "Pending"}
                        {loan.status === 1 && "Approved"}
                        {loan.status === 2 && "Rejected"}
                      </td>
                      
                      <td className="p-3">{loan.date}</td>
                      <td className="p-3 space-y-1">
                        <button
                          onClick={() => updateStatus(loan.id, 1)}
                          disabled={loan.status === 1}
                          className="w-full bg-green-600 hover:bg-green-700 px-3 py-1 rounded disabled:opacity-50 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(loan.id, 2)}
                          disabled={loan.status === 2}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded disabled:opacity-50 transition"
                        >
                          Reject
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleViewHistory(loan.id)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition"
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              EMI Payment History
            </h2>
            {emiHistory.length > 0 ? (
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {emiHistory.map((payment, index) => (
                  <li
                    key={index}
                    className="border p-2 rounded shadow text-gray-700"
                  >
                    <p>
                      <strong>Month:</strong> ({index + 1})
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{payment.amount}
                    </p>
                    <p>
                      <strong>Paid On:</strong>{" "}
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {payment.status}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600">
                No EMI payments found.
              </p>
            )}
            <div className="text-center mt-4">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
        
      </div>
      
    </div>
  );
}
