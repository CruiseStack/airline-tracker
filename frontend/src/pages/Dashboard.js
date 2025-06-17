import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ticketAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

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
      } catch (err) {
        setError("Failed to fetch tickets");
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const totalMiles = tickets.reduce(
    (sum, ticket) => sum + ticket.paid_points,
    0
  );

  const navigate = useNavigate();
  const uniqueDestinations = new Set(tickets.map((ticket) => ticket.arrival));
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Activity
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
                  <p className="text-gray-500">No recent activity</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your flight history will appear here
                  </p>
                </div>
              )}

              {!loading && !error && tickets.length > 0 && (
                <div className="space-y-2">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="w-full text-left px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition font-medium text-sm text-gray-800"
                    >
                      ✈️ Flight {ticket.flight_number}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ticket Area */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Tickets</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Ticket */}
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  Your Tickets
                </h4>

                {tickets.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    You have no tickets yet.
                  </p>
                ) : selectedTicket ? (
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    <li
                      key={selectedTicket.id}
                      className="border p-3 rounded-md text-sm text-gray-700 bg-gray-50"
                    >
                      ✈️ {selectedTicket.departure} → {selectedTicket.arrival}
                      <span className="block text-xs text-gray-500">
                        {new Date(
                          selectedTicket.departure_time
                        ).toLocaleDateString()}
                      </span>
                      <p className="mt-2 text-sm">
                        <strong>Flight:</strong> {selectedTicket.flight_number}
                        <br />
                        <strong>From:</strong> {selectedTicket.departure}
                        <br />
                        <strong>To:</strong> {selectedTicket.arrival}
                        <br />
                        <strong>Departure:</strong>{" "}
                        {new Date(
                          selectedTicket.departure_time
                        ).toLocaleString()}
                        <br />
                        <strong>Arrival:</strong>{" "}
                        {new Date(selectedTicket.arrival_time).toLocaleString()}
                        <br />
                        <strong>Seat:</strong> {selectedTicket.seat_number}
                        <br />
                        <strong>Price:</strong> ${selectedTicket.price}
                        <br />
                        {selectedTicket.paid_points > 0 && (
                          <>
                            <strong>Points Used:</strong>{" "}
                            {selectedTicket.paid_points}
                            <br />
                          </>
                        )}
                        <strong>Status:</strong>{" "}
                        <span
                          className={
                            selectedTicket.is_paid
                              ? "text-green-600"
                              : "text-yellow-600"
                          }
                        >
                          {selectedTicket.is_paid ? "Paid" : "Pending Payment"}
                        </span>
                      </p>
                    </li>
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    Select a flight from the list to view details.
                  </p>
                )}
              </div>
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
