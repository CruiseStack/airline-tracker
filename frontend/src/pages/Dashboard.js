import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ticketAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
              )}{" "}
              {!loading && !error && tickets.length > 0 && (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              Flight {ticket.flight_number}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticket.is_paid
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {ticket.is_paid ? "Paid" : "Pending Payment"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <p className="font-medium">From</p>
                              <p>{ticket.departure}</p>
                            </div>
                            <div>
                              <p className="font-medium">To</p>
                              <p>{ticket.arrival}</p>
                            </div>
                            <div>
                              <p className="font-medium">Departure</p>
                              <p>
                                {new Date(
                                  ticket.departure_time
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Arrival</p>
                              <p>
                                {new Date(ticket.arrival_time).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div>
                              <span className="font-medium">Seat:</span>{" "}
                              {ticket.seat_number}
                            </div>
                            <div>
                              <span className="font-medium">Price:</span> $
                              {ticket.price}
                            </div>
                            {ticket.paid_points > 0 && (
                              <div>
                                <span className="font-medium">
                                  Points Used:
                                </span>{" "}
                                {ticket.paid_points}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/search-flights")}
                  className="w-full bg-airline-blue hover:bg-airline-navy text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Book a Flight
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                  Check Flight Status
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                  Manage Booking
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                  View Miles Balance
                </button>
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
