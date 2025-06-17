import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaQuestionCircle } from "react-icons/fa";

export default function LoanForm() {
  const name = localStorage.getItem("userName") || "User Name";
  const email = localStorage.getItem("userEmail") || "user@example.com";
  const role = localStorage.getItem("role") || "user";
  const token = localStorage.getItem("token");

  const [banks, setBanks] = useState([]);
  const [formData, setFormData] = useState({
    bank_name: "",
    loanAmount: "",
    loanPurpose: "",
    income: "",
    employmentStatus: "",
    duration: "",
    intrestRate: 5,
  });

  const [userLoans, setUserLoans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEMI, setShowEMI] = useState(false);
  const [emiDetails, setEmiDetails] = useState({});
  const [payModal, setPayModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [emiHistory, setEmiHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [message, setMessage] = useState("");

  const fetchLoans = async () => {
    try {
      const res = await axios.get("http://localhost:3000/loan", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filteredLoans = res.data.filter(
        (loan) => loan.user?.email === email
      );

      setUserLoans(filteredLoans);
    } catch (error) {
      console.error("Error fetching loans:", error);
      setUserLoans([]);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/banks")
      .then((res) => setBanks(res.data))
      .catch((err) => console.error("Error fetching banks:", err));

    if (token) {
      fetchLoans();
    }
  }, []);

  const handleChange = (e) => {
    const value =
      e.target.name === "duration" && e.target.value.length > 2
        ? e.target.value.slice(0, 2)
        : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        loanAmount: Number(formData.loanAmount),
        income: Number(formData.income),
        duration: Number(formData.duration),
        name,
        date: new Date().toISOString(),
        intrestRate: String(formData.intrestRate),
      };

      await axios.post("http://localhost:3000/loan", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(" Loan application submitted!");

      setFormData({
        bank_name: "",
        loanAmount: "",
        loanPurpose: "",
        income: "",
        employmentStatus: "",
        duration: "",
        intrestRate: 5,
      });

      setShowForm(false);
      fetchLoans();
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      toast.error(" Error submitting loan application.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleShowEMI = (loan) => {
    const principal = loan.loanAmount;
    const duration = loan.duration;
    const annualInterestRate = 0.05;
    const monthlyRate = annualInterestRate / 12;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
      (Math.pow(1 + monthlyRate, duration) - 1);

    const emiRounded = parseFloat(emi.toFixed(2));
    const totalPay = parseFloat((emi * duration).toFixed(2));
    const totalMonths = duration;

    const emiPaidCount =
      loan.emiPayments?.filter((p) => p.status === "paid").length || 0;
    const totalPaidAmount = parseFloat((emiRounded * emiPaidCount).toFixed(2));
    const remainingAmount = parseFloat((totalPay - totalPaidAmount).toFixed(2));
    const remainingMonths = duration - emiPaidCount;

    setEmiDetails({
      bankName: loan.bank_name,
      emi: emiRounded,
      totalPay,
      totalMonths,
      totalPaidAmount,
      remainingAmount,
      remainingMonths,
    });

    setShowEMI(true);
  };

  const handlePayEMI = (loan) => {
    setSelectedLoan(loan);
    setPayModal(true);
  };

  const confirmPayEMI = async () => {
    try {
      const principal = selectedLoan.loanAmount;
      const duration = selectedLoan.duration;
      const monthlyRate = 0.05 / 12;

      const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
        (Math.pow(1 + monthlyRate, duration) - 1);

      await axios.post(
        "http://localhost:3000/emi-payments/pay",
        {
          userId: selectedLoan.userId,
          loanId: selectedLoan.id,
          amount: emi.toFixed(2),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("EMI Paid Successfully!");
      setPayModal(false);
      fetchLoans();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("EMI Payment Failed!");
    }
  };

  const closeEMI = () => {
    setShowEMI(false);
  };

  const handleViewHistory = async (loanId) => {
    try {
      const token = localStorage.getItem("token"); // <-- moved inside function
      const res = await axios.get(
        `http://localhost:3000/emi-payments/history/${loanId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmiHistory(res.data);
      setShowHistoryModal(true);
      toast.success(" EMI payment history loaded!");
    } catch (error) {
      console.error("Error fetching EMI history:", error);
      toast.error("Failed to load EMI payment history.");
    }
  };

  const generateMonthOptions = (loan) => {
    const months = [];
    const startDate = new Date(loan.date || loan.created_at || new Date());
    const totalMonths = parseInt(loan.duration || 12);
    const paidMonths = parseInt(
      loan.emiPayments?.filter((p) => p.status === "paid").length || 0
    );

    // console.log('Start Date:', startDate, 'Total Months:', totalMonths, 'Paid Months:', paidMonths);

    for (let i = 0; i < totalMonths; i++) {
      const monthDate = new Date(startDate);
      monthDate.setMonth(startDate.getMonth() + i);

      const monthYear = monthDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const isPaid = i < paidMonths;
      const isOverdue = !isPaid && monthDate < new Date();

      months.push({
        value: `${i + 1}`,
        label: `Month ${i + 1} - ${monthYear}`,
        isPaid: isPaid,
        isOverdue: isOverdue,
        dueDate: monthDate,
      });
    }
    return months;
  };
  //   const monthOptions = generateMonthOptions(selectedLoan);
  // const allEmisPaid = monthOptions.every((month) => month.isPaid);

  const getSelectedMonthDueDate = () => {
    if (!selectedMonth || !selectedLoan) return "";

    const startDate = new Date(
      selectedLoan.date || selectedLoan.created_at || new Date()
    );
    const monthIndex = parseInt(selectedMonth) - 1;
    const dueDate = new Date(startDate);
    dueDate.setMonth(startDate.getMonth() + monthIndex);

    return dueDate.toLocaleDateString("en-IN");
  };

  const handleSendMessage = async () => {
    try {

      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:3000/help-support", {
        userId,
        message,
      });
      toast.success("Message sent to admin!");
      setMessage("");
      setShowSupportModal(false);
    } catch (err) {
      toast.error("Error sending message");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white font-sans text-gray-800">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-semibold">Welcome, {name}</h1>
          <div className="text-sm text-gray-100 text-center">
            <p>Email: {email}</p>
            <p className="capitalize">Role: {role}</p>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md"
            >
              Logout
            </button>

            <button
              onClick={() => {
                const hasPendingLoan = userLoans.some(
                  (loan) => loan.status === 0
                );
                if (hasPendingLoan) {
                  toast.warn(
                    " You already have a pending loan. Please wait for approval before applying again."
                  );
                } else {
                  setShowForm(true);
                }
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow"
            >
              New Loan Application
            </button>

            <button
        onClick={() => setShowSupportModal(true)}
        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md"
      >
        <FaQuestionCircle className="mr-2" />
        Help & Support
      </button>
          </div>
        </div>
      </header>

      {userLoans.length > 0 && !showForm && (
        <>
          <div className="max-w-full max-h-full flex flex-wrap gap-4 justify-center p-6 items-center">
            {userLoans.map((loan, index) => (
              <div
                key={index}
                className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 transition-transform hover:scale-105 hover:shadow-xl duration-300"
              >
                <h2 className="text-2xl font-bold text-blue-700 mb-2">
                  Loan Application
                </h2>
                <p>
                  <strong>Bank Name:</strong> {loan.bank_name}
                </p>
                <p>
                  <strong>Loan Amount:</strong> ₹{loan.loanAmount}
                </p>
                <p>
                  <strong>Purpose:</strong> {loan.loanPurpose}
                </p>
                <p>
                  <strong>Income:</strong> ₹{loan.income}
                </p>
                <p>
                  <strong>Employment Status:</strong> {loan.employmentStatus}
                </p>
                <p>
                  <strong>Duration:</strong> {loan.duration} months
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {loan.status === 1 ? (
                    <span className="text-green-600 font-semibold">
                      Approved
                    </span>
                  ) : loan.status === 2 ? (
                    <span className="text-red-600 font-semibold">Rejected</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}
                </p>

                <button
                  onClick={() => handleShowEMI(loan)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow mt-4"
                >
                  Show EMI
                </button>
                {loan.status === 1 && (
                  <button
                    onClick={() => handlePayEMI(loan)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded shadow ml-2"
                  >
                    Pay EMI
                  </button>
                )}
                <button
                  onClick={() => handleViewHistory(loan.id)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow ml-2"
                >
                  View EMI History
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {(userLoans.length === 0 || showForm) &&
        !userLoans.some((loan) => loan.status === 0) && (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 mt-10 space-y-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold mb-4">Bank Loan Application</h2>

            <div>
              <label className="block font-medium">Bank Name</label>
              <select
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Select a Bank</option>
                {banks.map((bank) => (
                  <option
                    key={bank.id}
                    value={bank.bank_name}
                  >
                    {bank.bank_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Interest Rate (%)</label>
              <input
                type="number"
                name="interestRate"
                value={formData.intrestRate}
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-medium">Loan Amount</label>
              <input
                type="number"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter amount"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Loan Purpose</label>
              <input
                type="text"
                name="loanPurpose"
                value={formData.loanPurpose}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Purpose of loan"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Income</label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Monthly income"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Employment Status</label>
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Select status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Duration (months)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="1-12 months"
                max={12}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-full"
            >
              Submit Loan Application
            </button>
          </form>
        )}

      {/* EMI Detail Modal */}
      {showEMI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-xl w-full animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-center">EMI Details</h2>
            <p>
              <strong>Bank Name:</strong> {emiDetails.bankName}
            </p>
            <p>
              <strong>Monthly EMI:</strong> ₹
              {emiDetails.emi.toLocaleString("en-IN")}
            </p>
            <p>
              <strong>Total EMI Amount:</strong> ₹
              {emiDetails.totalPay.toLocaleString("en-IN")}
            </p>

            <p>
              <strong>Total EMI Months:</strong> {emiDetails.totalMonths}
            </p>
            <p>
              <strong>Total Paid So Far:</strong> ₹
              {emiDetails.totalPaidAmount.toLocaleString("en-IN")}
            </p>
            <p>
              <strong>Remaining Amount:</strong> ₹
              {emiDetails.remainingAmount.toLocaleString("en-IN")}
            </p>
            <p>
              <strong>Remaining EMI Months:</strong>{" "}
              {emiDetails.remainingMonths}
            </p>
            <div className="text-center mt-4">
              <button
                onClick={closeEMI}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMI Pay Modal */}
      {payModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">
              Confirm EMI Payment
            </h2>

            <p className="text-center mb-4">
              Are you sure you want to pay EMI for{" "}
              <strong>{selectedLoan.bank_name}</strong>?
            </p>

            {/* Month Selection Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Month to Pay:
              </label>

              {(() => {
                const monthOptions = generateMonthOptions(selectedLoan);
                const allEmisPaid = monthOptions.every((month) => month.isPaid);

                return (
                  <>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedMonth || ""}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      disabled={allEmisPaid}
                    >
                      <option value="">Select a month</option>
                      {monthOptions.map((month, index) => (
                        <option
                          key={index}
                          value={month.value}
                          disabled={month.isPaid}
                          style={{
                            color: month.isPaid
                              ? "#9CA3AF"
                              : month.isOverdue
                              ? "#EF4444"
                              : "#374151",
                          }}
                        >
                          {month.label}{" "}
                          {month.isPaid
                            ? "✓ Paid"
                            : month.isOverdue
                            ? "⚠ Overdue"
                            : ""}
                        </option>
                      ))}
                    </select>

                    {allEmisPaid && (
                      <p className="text-green-600 mt-2 font-semibold">
                        🎉 EMI Completed
                      </p>
                    )}

                    {/* Payment Summary */}
                    {selectedMonth && !allEmisPaid && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6 mt-4">
                        <h3 className="font-semibold mb-2">Payment Details:</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Loan Amount:</span>
                            <span className="font-semibold ml-2">
                              ₹{selectedLoan.loanAmount}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Due Date:</span>
                            <span className="font-semibold ml-2">
                              {getSelectedMonthDueDate()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-semibold ml-2">
                              {selectedLoan.duration} months
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Interest Rate:
                            </span>
                            <span className="font-semibold ml-2">
                              {selectedLoan.intrestRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 mt-2">
                      <button
                        onClick={confirmPayEMI}
                        disabled={allEmisPaid || !selectedMonth}
                        className={`px-6 py-2 rounded-lg font-medium ${
                          allEmisPaid || !selectedMonth
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        Pay EMI
                      </button>
                      <button
                        onClick={() => {
                          setPayModal(false);
                          setSelectedMonth("");
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

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

{showSupportModal && (
  <div className="fixed bottom-5 right-5 w-80 bg-white border rounded-lg shadow-lg z-50">
    <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
      <span>Help & Support</span>
      <button onClick={() => setShowSupportModal(false)}>✖</button>
    </div>
    <div className="p-4">
      <textarea
        rows={4}
        className="w-full border p-2 rounded"
        placeholder="Type your message to admin..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button
        onClick={handleSendMessage}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  </div>
)}
    </div>
  );
}
