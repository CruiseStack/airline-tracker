import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BookingModal from '../components/BookingModal';

//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const API_URL = 'http://localhost:8000';

const FlightDetailPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchFlightDetail = async () => {
      try {
        const response = await fetch(`${API_URL}/api/flights/${flightId}/`);
        if (!response.ok) {
          throw new Error('Flight not found');
        }
        const data = await response.json();
        setFlight(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (flightId) {
      fetchFlightDetail();
    }
  }, [flightId]);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'boarding': return 'bg-blue-100 text-blue-800';
      case 'departed': return 'bg-purple-100 text-purple-800';
      case 'landed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookFlight = () => {
    setShowBookingModal(true);
  };

  const handleBookingComplete = () => {
    setShowBookingModal(false);
    // Could add success notification here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg text-gray-600">Loading flight details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Flight Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              to="/search-flights"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search Results
          </button>
          
          <div className="bg-white shadow-xl rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Flight {flight.airline.code}{flight.flight_number}
                </h1>
                <p className="text-gray-600">{flight.airline.name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(flight.status)}`}>
                {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
              </span>
            </div>

            {/* Route Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{formatTime(flight.scheduled_departure)}</div>
                <div className="text-lg font-medium text-gray-700">{flight.departure_airport.code}</div>
                <div className="text-sm text-gray-500">{flight.departure_airport.name}</div>
                <div className="text-sm text-gray-500">{flight.departure_airport.city}, {flight.departure_airport.country}</div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-center mb-2">
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                  <svg className="w-6 h-6 text-blue-500 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                </div>
                <div className="text-sm text-gray-500">{flight.duration || 'Duration N/A'}</div>
                <div className="text-xs text-gray-400">{flight.aircraft_type}</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{formatTime(flight.scheduled_arrival)}</div>
                <div className="text-lg font-medium text-gray-700">{flight.arrival_airport.code}</div>
                <div className="text-sm text-gray-500">{flight.arrival_airport.name}</div>
                <div className="text-sm text-gray-500">{flight.arrival_airport.city}, {flight.arrival_airport.country}</div>
              </div>
            </div>

            {/* Price */}
            <div className="text-center border-t pt-4">
              <div className="text-3xl font-bold text-blue-600">${flight.price}</div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flight Details */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Flight Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Flight Number</dt>
                <dd className="text-lg text-gray-900">{flight.airline.code}{flight.flight_number}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Aircraft Type</dt>
                <dd className="text-lg text-gray-900">{flight.aircraft_type || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Gate</dt>
                <dd className="text-lg text-gray-900">{flight.gate || 'TBA'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Terminal</dt>
                <dd className="text-lg text-gray-900">{flight.terminal || 'TBA'}</dd>
              </div>
            </dl>
          </div>

          {/* Schedule Information */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Scheduled Departure</dt>
                <dd className="text-lg text-gray-900">{formatDateTime(flight.scheduled_departure)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Scheduled Arrival</dt>
                <dd className="text-lg text-gray-900">{formatDateTime(flight.scheduled_arrival)}</dd>
              </div>
              {flight.actual_departure && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Actual Departure</dt>
                  <dd className="text-lg text-gray-900">{formatDateTime(flight.actual_departure)}</dd>
                </div>
              )}
              {flight.actual_arrival && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Actual Arrival</dt>
                  <dd className="text-lg text-gray-900">{formatDateTime(flight.actual_arrival)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleBookFlight}
              className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Book This Flight
            </button>
            <button className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Add to Watchlist
            </button>
            <Link 
              to="/search-flights"
              className="flex-1 sm:flex-none px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center"
            >
              Search More Flights
            </Link>
          </div>
        </div>

        {/* Booking Modal */}
        {flight && (
          <BookingModal 
            flight={flight}
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            onBook={handleBookingComplete}
          />
        )}
      </div>
    </div>
  );
};

export default FlightDetailPage;
