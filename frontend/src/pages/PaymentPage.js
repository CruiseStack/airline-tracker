import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createTicket } from "../api/ticket";
import { useAuth } from "../context/AuthContext";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight } = location.state || {};
  const { user } = useAuth();

  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  
  // Passenger information state
  const [passengerInfo, setPassengerInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    id_type: "passport",
    id_number: "",
    birthdate: ""
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Passenger Info, 2: Payment

  if (!flight) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-md text-red-500 font-semibold">
          No flight selected for payment.
        </div>
      </div>
    );
  }

  const handlePassengerChange = (field, value) => {
    setPassengerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePassengerInfo = () => {
    const required = ['first_name', 'last_name', 'email', 'phone_number', 'id_number', 'birthdate'];
    for (let field of required) {
      if (!passengerInfo[field]) {
        setError(`Please fill in the ${field.replace('_', ' ')}`);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNextStep = () => {
    if (validatePassengerInfo()) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
      try {
      // Validate flight data
      if (!flight.id) {
        throw new Error('Flight instance ID is missing. Please select a flight again.');
      }
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate total price
      const totalPrice = parseFloat(flight.selected_price || flight.economy_price || 100);
        // Create ticket data with proper structure including passenger data
      const ticketData = {
        ticket_number: `TK${Date.now()}`, // Generate unique ticket number
        PNR_number: `PNR${Date.now()}`, // Generate unique PNR
        seat_number: "A1", // Default seat, could be made dynamic
        extra_baggage: false,        checkin_status: 'not_checked_in', // Default status
        total_price: totalPrice, // Send the total price for payment creation
        paid_cash: totalPrice, // Mark as paid in cash (since user went through payment process)
        paid_points: 0, // No points used for now
        
        // Required foreign keys
        flight_instance: flight.id, // Use the correct FlightInstance ID
        flight_class: flight.selected_class || 'Economy', // Use selected class
        
        // Passenger information
        passenger_data: {
          first_name: passengerInfo.first_name,
          last_name: passengerInfo.last_name,
          email: passengerInfo.email,
          phone_number: passengerInfo.phone_number,
          id_type: passengerInfo.id_type,
          id_number: passengerInfo.id_number,
          birthdate: passengerInfo.birthdate,
          id_document: `${passengerInfo.id_type.toUpperCase()}: ${passengerInfo.id_number}`,
          area_code: '+1' // Default area code, could be made dynamic
        }
      };
      
      console.log('Creating ticket with data:', ticketData);
      console.log('Flight object:', flight);
      
      const result = await createTicket(ticketData);
      console.log('Ticket created successfully:', result);
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (err) {
      console.error('Ticket creation error:', err);
      setError(err.response?.data?.detail || err.message || "Payment failed. Please try again.");    } finally {
      setProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Complete Your Booking</h1>
            <div className="flex items-center space-x-4 text-sm">
              <span>{flight.flight_details?.fnum || "N/A"}</span>
              <span>•</span>
              <span>{flight.flight_details?.origin} → {flight.flight_details?.destination}</span>
              <span>•</span>
              <span>{flight.selected_class || "Economy"}</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex bg-gray-50 border-b">
            <div className={`flex-1 p-4 text-center font-medium ${currentStep === 1 ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
              1. Passenger Information
            </div>
            <div className={`flex-1 p-4 text-center font-medium ${currentStep === 2 ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
              2. Payment Details
            </div>
          </div>

          {/* Step 1: Passenger Information */}
          {currentStep === 1 && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Passenger Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={passengerInfo.first_name}
                    onChange={e => handlePassengerChange('first_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={passengerInfo.last_name}
                    onChange={e => handlePassengerChange('last_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={passengerInfo.email}
                    onChange={e => handlePassengerChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={passengerInfo.phone_number}
                    onChange={e => handlePassengerChange('phone_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Type *</label>
                  <select
                    value={passengerInfo.id_type}
                    onChange={e => handlePassengerChange('id_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID</option>
                    <option value="driving_license">Driving License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
                  <input
                    type="text"
                    required
                    value={passengerInfo.id_number}
                    onChange={e => handlePassengerChange('id_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter ID number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={passengerInfo.birthdate}
                    onChange={e => handlePassengerChange('birthdate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-sm mt-4">{error}</div>}              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => navigate('/search-flights')}
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  ← Back to Search
                </button>
                <button
                  onClick={handleNextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {currentStep === 2 && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              
              {/* Flight Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Passenger:</span>
                    <span>{passengerInfo.first_name} {passengerInfo.last_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flight:</span>
                    <span>{flight.flight_details?.fnum}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span>{flight.flight_details?.origin} → {flight.flight_details?.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Class:</span>
                    <span>{flight.selected_class || "Economy"}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-green-600">${parseFloat(flight.selected_price || flight.economy_price || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
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
                
                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    ← Back to Passenger Info
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200 disabled:opacity-50"
                  >
                    {processing ? "Processing..." : "Complete Booking"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {success && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center">
              <div className="text-center">
                <div className="text-green-600 text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">Redirecting to your dashboard...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;