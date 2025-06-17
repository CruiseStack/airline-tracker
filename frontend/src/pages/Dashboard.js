import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ticketAPI } from "../services/api";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      setLoading(true);
      try {
        const data = await ticketAPI.getUserTickets();
        setTickets(data);
        setError(null);
        // Auto-select the first ticket if available
        if (data.length > 0) {
          setSelectedTicket(data[0]);
        }
      } catch (err) {
        setError('Failed to fetch tickets');
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);
  const totalMiles = tickets.reduce(
    (sum, ticket) => sum + (ticket.payment_details?.paid_points || 0),
    0
  );
  const uniqueDestinations = new Set(
    tickets.map((ticket) => ticket.flight_instance_details?.destination).filter(Boolean)
  );
  const destinationsVisited = uniqueDestinations.size;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your AirTracker account today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Upcoming Flights
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loading
                        ? "Loading..."
                        : error
                        ? "Error"
                        : tickets.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Miles Earned
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loading ? "Loading..." : error ? "Error" : totalMiles}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Destinations Visited
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loading
                        ? "Loading..."
                        : error
                        ? "Error"
                        : destinationsVisited}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">          {/* Ticket List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                My Tickets
              </h3>
            </div>
            <div className="p-6">
              {loading && <p>Loading your tickets...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
              {!loading && !error && tickets.length === 0 && (
                <div className="text-center py-8">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-gray-500">No tickets found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Book your first flight to see tickets here
                  </p>
                </div>
              )}
              
              {!loading && !error && tickets.length > 0 && (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.ticket_number}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTicket?.ticket_number === ticket.ticket_number
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {ticket.flight_instance_details?.flight_number || 'Flight N/A'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Ticket #{ticket.ticket_number}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.payment_details?.is_paid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ticket.payment_details?.is_paid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div>
                          <p className="font-medium">From</p>
                          <p>{ticket.flight_instance_details?.origin || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-medium">To</p>
                          <p>{ticket.flight_instance_details?.destination || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-medium">Seat:</span> {ticket.seat_number}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {
                            ticket.flight_instance_details?.date 
                              ? new Date(ticket.flight_instance_details.date).toLocaleDateString()
                              : 'N/A'
                          }
                        </div>
                      </div>
                      
                      {ticket.flight_class_details && (
                        <div className="mt-2 text-xs text-gray-500">
                          {ticket.flight_class_details.class_type} Class
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>{/* Detailed Ticket Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Ticket Details
              </h3>
              {tickets.length > 1 && (
                <p className="text-sm text-gray-500 mt-1">
                  Select a ticket from the left to view details
                </p>
              )}
            </div>
            <div className="p-6">
              {selectedTicket ? (
                <div className="space-y-6">
                  {/* Flight Information */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-lg font-semibold text-blue-600 mb-3">
                      Flight {selectedTicket.flight_instance_details?.flight_number || 'N/A'}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Ticket Number</p>
                        <p className="text-gray-900">{selectedTicket.ticket_number}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">PNR Number</p>
                        <p className="text-gray-900">{selectedTicket.PNR_number}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Seat Number</p>
                        <p className="text-gray-900">{selectedTicket.seat_number}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Check-in Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedTicket.checkin_status === 'checked_in' 
                            ? 'bg-green-100 text-green-800'
                            : selectedTicket.checkin_status === 'boarded'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedTicket.checkin_status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Route Information */}
                  {selectedTicket.flight_instance_details && (
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Route</h4>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">From</p>
                          <p className="font-semibold text-lg">{selectedTicket.flight_instance_details.origin}</p>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="flex items-center">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <div className="px-2 text-gray-400">✈️</div>
                            <div className="flex-1 h-px bg-gray-300"></div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">To</p>
                          <p className="font-semibold text-lg">{selectedTicket.flight_instance_details.destination}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <p className="text-sm text-gray-600">
                          Date: {new Date(selectedTicket.flight_instance_details.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Gate: {selectedTicket.flight_instance_details.gate}
                        </p>
                        <p className="text-sm text-gray-600">
                          Aircraft: {selectedTicket.flight_instance_details.aircraft}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Class and Payment Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Flight Class */}
                    {selectedTicket.flight_class_details && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-2">Flight Class</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Class:</span> {selectedTicket.flight_class_details.class_type}</p>
                          <p><span className="font-medium">Baggage:</span> {selectedTicket.flight_class_details.baggage} kg</p>
                          <p><span className="font-medium">Carry-on:</span> {selectedTicket.flight_class_details.carry_on} kg</p>
                          {selectedTicket.extra_baggage && (
                            <p><span className="font-medium">Extra Baggage:</span> Yes</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Payment Information */}
                    {selectedTicket.payment_details && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-2">Payment</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Total:</span> ${selectedTicket.payment_details.total}</p>
                          <p><span className="font-medium">Paid Cash:</span> ${selectedTicket.payment_details.paid_cash}</p>
                          {selectedTicket.payment_details.paid_points > 0 && (
                            <p><span className="font-medium">Points Used:</span> {selectedTicket.payment_details.paid_points}</p>
                          )}
                          <div className="mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedTicket.payment_details.is_paid
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedTicket.payment_details.is_paid ? 'PAID' : 'UNPAID'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>                  {/* Passenger Information */}
                  {selectedTicket.user_details && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-2">Passenger</h4>
                      <div className="text-sm bg-gray-50 p-2 rounded">
                        <p className="font-medium">{selectedTicket.user_details.first_name} {selectedTicket.user_details.last_name}</p>
                        <p className="text-gray-600">{selectedTicket.user_details.email}</p>
                        {selectedTicket.user_details.phone_number && (
                          <p className="text-gray-600">{selectedTicket.user_details.phone_number}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500">No tickets available</p>
                  <p className="text-sm text-gray-400 mt-1">Book your first flight to see ticket details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 20h.01"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">
                Welcome to AirTracker!
              </h4>
              <p className="mt-1 text-sm text-blue-700">
                Stay tuned for updates on your upcoming flights and special
                offers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
