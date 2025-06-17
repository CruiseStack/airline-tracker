import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createTicket } from "../api/ticket";
import { useAuth } from "../context/AuthContext";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight } = location.state || {};
  const { user } = useAuth();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!flight) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-md text-red-500 font-semibold">
          No flight selected for payment.
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    try {
      setTimeout(async () => {
        try {
          // You must provide valid IDs for these fields from your app's state/context
          const ticketData = {
            seat_number: "A1", // or user-selected
            extra_baggage: false,
            flight_instance: flight.id || flight.flight_instance_id, // update as needed
            flight_class: flight.class_id || 1, // update as needed
            passenger: user?.passenger_id || 1, // update as needed
            payment: null, // payment will be created after ticket, or update as needed
            // PNR_number, checkin_status, etc. can be omitted if auto-generated
          };
          await createTicket(ticketData);
          setSuccess(true);
          setProcessing(false);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } catch (err) {
          setProcessing(false);
          setError("Failed to create ticket. Please try again.");
        }
      }, 1500);
    } catch (err) {
      setProcessing(false);
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Payment</h2>
        <div className="mb-6">
          <div className="text-gray-700 font-semibold mb-1">Flight:</div>
          <div className="text-gray-900">{flight.fnum || flight.flight_details?.fnum || "N/A"}</div>
          <div className="text-gray-700 font-semibold mt-2 mb-1">Amount:</div>
          <div className="text-green-600 font-bold text-lg">
            ${flight.price || flight.economy_price || "N/A"}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name on card"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
              <input
                type="text"
                required
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <input
                type="text"
                required
                value={cvc}
                onChange={e => setCvc(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 mt-2 disabled:opacity-50"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
          {success && (
            <div className="text-green-600 text-center mt-4 font-semibold">
              Payment successful! Redirecting...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;