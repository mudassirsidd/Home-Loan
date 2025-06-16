import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoans, setUserLoans] = useState([]);
  const [emiHistory, setEmiHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users. Please try again.");
    }
  };

  const fetchUserLoans = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/loan/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserLoans(res.data);
      setSelectedUser(userId);
    } catch (err) {
      console.error("Error fetching user loans:", err);
      toast.error("Failed to load user loans. Please try again.");
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
      toast.success(`Loan ${status === 1 ? "approved" : "updated"} successfully!`);
      fetchUserLoans(selectedUser);
    } catch (err) {
      console.error("Error updating loan status:", err);
      toast.error("Failed to update loan status. Please try again.");
    }
  };

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
      toast.success("EMI payment history loaded successfully.");
    } catch (error) {
      console.error("Error fetching EMI history:", error);
      toast.error("Failed to load EMI payment history.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg text-[#00e0ff]">
            🛠️ Admin Dashboard - Users
          </h2>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-pink-600 hover:to-red-600 px-5 py-2 rounded-lg shadow-lg transition-all duration-300 font-semibold"
          >
            Logout
          </button>
        </div>
  
        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl mb-12 border border-white/20">
          <h3 className="text-2xl font-bold mb-5 text-[#90e0ef]">👤 Users</h3>
          <div className="overflow-auto rounded-xl">
            <table className="w-full text-sm text-white bg-white/5 border border-white/20 rounded-xl">
              <thead className="bg-white/20 text-white uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 text-left">User ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr className="hover:bg-white/10 border-b border-white/10 transition duration-200">
                      <td className="p-4">{user.id}</td>
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <button
                          onClick={async () => {
                            if (selectedUser === user.id) {
                              setSelectedUser(null);
                              setUserLoans([]);
                            } else {
                              await fetchUserLoans(user.id);
                            }
                          }}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-1 rounded-full shadow-md transition font-medium"
                        >
                          {selectedUser === user.id ? "Hide Loan" : "View Loan"}
                        </button>
                      </td>
                    </tr>
  
                    {/* Loan Row */}
                    {selectedUser === user.id && (
                      <tr>
                        <td colSpan="4" className="bg-white/5 p-4">
                          <div className="rounded-lg border border-white/10 p-4 bg-black/20 backdrop-blur-lg shadow-lg">
                            <h4 className="text-lg font-bold mb-3 text-[#ffd6a5]">📄 Loan Details</h4>
                            {userLoans.length > 0 ? (
                              <table className="w-full text-sm text-white border border-white/20">
                                <thead className="bg-white/10">
                                  <tr>
                                    <th className="p-3 text-left">Bank</th>
                                    <th className="p-3 text-left">Amount</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Date</th>
                                    <th className="p-3 text-left">Actions</th>
                                    <th className="p-3 text-left">EMI History</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {userLoans.map((loan) => (
                                    <tr
                                      key={loan.id}
                                      className="hover:bg-white/10 border-b border-white/10 transition duration-200"
                                    >
                                      <td className="p-3">{loan.bank_name}</td>
                                      <td className="p-3">₹{loan.loanAmount}</td>
                                      <td className="p-3 capitalize">
                                        {loan.status === 0 && "Pending"}
                                        {loan.status === 1 && "Approved"}
                                        {loan.status === 2 && "Rejected"}
                                      </td>
                                      <td className="p-3">{loan.date}</td>
                                      <td className="p-3 space-x-2">
                                        <button
                                          onClick={() => updateStatus(loan.id, 1)}
                                          disabled={loan.status === 1}
                                          className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded transition disabled:opacity-40"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => updateStatus(loan.id, 2)}
                                          disabled={loan.status === 2}
                                          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition disabled:opacity-40"
                                        >
                                          Reject
                                        </button>
                                      </td>
                                      <td className="p-3">
                                        <button
                                          onClick={() => handleViewHistory(loan.id)}
                                          className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded transition"
                                        >
                                          View History
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-gray-300">No loan records found.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* EMI History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-xl w-full border border-gray-300">
              <h2 className="text-xl font-extrabold mb-4 text-center text-black">📜 EMI Payment History</h2>
              {emiHistory.length > 0 ? (
                <ul className="space-y-3 max-h-80 overflow-y-auto">
                  {emiHistory.map((payment, index) => (
                    <li key={index} className="border p-3 rounded-lg bg-gray-50 text-gray-700">
                      <p><strong>Month:</strong> {index + 1}</p>
                      <p><strong>Amount:</strong> ₹{payment.amount}</p>
                      <p><strong>Paid On:</strong> {new Date(payment.paymentDate).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {payment.status}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-600">No EMI payments found.</p>
              )}
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white px-4 py-2 rounded-full shadow-lg"
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
