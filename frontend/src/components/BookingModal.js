import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ flight, isOpen, onClose, onBook }) => {
  const { user } = useAuth();
  const [passengers, setPassengers] = useState(1);
  const [bookingStep, setBookingStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    setLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      setBookingStep(2);
      setLoading(false);
      onBook();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {bookingStep === 1 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Book Flight</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{flight.departure_airport.code} → {flight.arrival_airport.code}</span>
                <span>{flight.airline.code}{flight.flight_number}</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">${flight.price} per person</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Passengers
              </label>
              <select 
                value={passengers} 
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-blue-600">${(flight.price * passengers).toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <div className="flex space-x-3">
                <button 
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Book Now'}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Please log in to book this flight</p>
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-4">
                Your flight has been booked successfully. 
                Confirmation details will be sent to your email.
              </p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
