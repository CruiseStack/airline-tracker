import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import SimpleAirportAutocomplete from '../components/SimpleAirportAutocomplete';
import ApiTest2 from '../components/ApiTest2';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const API_URL = 'http://localhost:8000';

const FlightSearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    date: '',
    departure: '',
    arrival: '',
  });
  const [flights, setFlights] = useState([]);
  const [menuData, setMenuData] = useState({ airports: [], airlines: [], status_choices: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);  useEffect(() => {    // Fetch menu data for dropdowns (airports, etc.)
    const fetchMenuData = async () => {
      try {
        console.log('Fetching menu data from:', `${API_URL}/api/flights/menu/`);
        const response = await fetch(`${API_URL}/api/flights/menu/`);
        console.log('Menu data response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Menu data loaded:', data.airports?.length, 'airports');
          console.log('Sample airports:', data.airports?.slice(0, 3));
          setMenuData(data);
          // Set default date to today if available from menuData
          if (data.today) {
            setSearchParams(prev => ({ ...prev, date: data.today }));
          }
        } else {
          console.error('Failed to fetch menu data:', response.status);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }
      } catch (err) {
        console.error("Error fetching menu data:", err);
      }
    };

    // Also fetch some sample flights to show initially
    const fetchSampleFlights = async () => {
      try {
        // Get today's date and fetch some flights
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`${API_URL}/api/flights/?date=${today}`);
        if (response.ok) {
          const data = await response.json();
          setFlights(data.slice(0, 5)); // Show only first 5 flights as samples
        }
      } catch (err) {
        console.log("No sample flights available:", err);
      }
    };

    fetchMenuData();
    fetchSampleFlights();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFlights([]);
    setSearched(true);

    // Basic validation
    if (!searchParams.date || !searchParams.departure || !searchParams.arrival) {
      setError('Please fill in all search fields.');
      setLoading(false);
      return;
    }

    if (searchParams.departure === searchParams.arrival) {
      setError('Departure and arrival cities cannot be the same.');
      setLoading(false);
      return;
    }

    try {
      const query = new URLSearchParams({
        date: searchParams.date,
        departure: searchParams.departure,
        arrival: searchParams.arrival,
      }).toString();

      const response = await fetch(`${API_URL}/api/flights/?${query}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      const data = await response.json();
      setFlights(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch flights. Please try again.');
    } finally {
      setLoading(false);
    }
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
      case 'scheduled': return 'text-green-600';
      case 'delayed': return 'text-orange-500';
      case 'cancelled': return 'text-red-600';
      case 'boarding': return 'text-blue-600';
      case 'departed': return 'text-purple-600';
      case 'landed': return 'text-gray-600';
      default: return 'text-gray-700';
    }
  };

  const handleQuickBook = (flight) => {
    setSelectedFlight(flight);
    setShowBookingModal(true);
  };

  const handleBookingComplete = () => {
    setShowBookingModal(false);
    setSelectedFlight(null);
  };  // Debug: Log menu data before rendering
  console.log('About to render - menuData airports:', menuData.airports?.length);
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">      {/* Debug Info */}
      <div className="max-w-6xl mx-auto mb-4 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-bold">Debug Info:</h3>
        <p>API URL: {API_URL}</p>
        <p>Airports loaded: {menuData.airports?.length || 0}</p>
        <p>Menu data keys: {Object.keys(menuData).join(', ')}</p>
        {menuData.airports?.slice(0, 2).map(airport => (
          <p key={airport.code}>{airport.city} ({airport.code})</p>
        ))}
        <ApiTest2 />
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-xl rounded-lg p-8 mb-8"><h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Search Flights</h1>
          <p className="text-center text-gray-600 mb-8">Find the perfect flight for your next journey</p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div>
                <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>                <SimpleAirportAutocomplete
                  name="departure"
                  value={searchParams.departure}
                  onChange={(value) => setSearchParams(prev => ({ ...prev, departure: value }))}
                  placeholder="Search departure city..."
                  airports={menuData.airports || []}
                  required
                />
              </div>

              <div>
                <label htmlFor="arrival" className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>                <SimpleAirportAutocomplete
                  name="arrival"
                  value={searchParams.arrival}
                  onChange={(value) => setSearchParams(prev => ({ ...prev, arrival: value }))}
                  placeholder="Search destination city..."
                  airports={menuData.airports || []}
                  required
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={searchParams.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                <div className="flex">
                  <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Flights
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Flight Results Section */}
        <div className="bg-white shadow-xl rounded-lg p-8">          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {searched ? 'Available Flights' : 'Sample Flights'}
            </h2>
            {searched && !loading && flights.length > 0 && (
              <span className="text-sm text-gray-500">{flights.length} flight{flights.length !== 1 ? 's' : ''} found</span>
            )}
            {!searched && flights.length > 0 && (
              <span className="text-sm text-gray-500">Showing sample flights for today</span>
            )}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center">
                <svg className="animate-spin h-8 w-8 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg text-gray-600">Searching for flights...</span>
              </div>
            </div>
          )}

          {!loading && searched && flights.length === 0 && !error && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
              <p className="text-gray-500">No flights match your search criteria. Try adjusting your search parameters.</p>
            </div>
          )}          {!loading && !searched && flights.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500 mb-2">Ready to search</h3>
              <p className="text-gray-400">Enter your travel details above to find available flights.</p>
            </div>
          )}

          {!loading && flights.length > 0 && (
            <div className="space-y-4">
              {flights.map((flight) => (
                <div key={flight.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Flight Info */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Airline & Flight Number */}
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-sm">{flight.airline.code}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{flight.airline.name}</p>
                              <p className="text-sm text-gray-500">Flight {flight.airline.code}{flight.flight_number}</p>
                            </div>
                          </div>
                        </div>

                        {/* Route & Time */}
                        <div className="md:col-span-2">
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{formatTime(flight.scheduled_departure)}</p>
                              <p className="text-sm text-gray-500">{flight.departure_airport.code}</p>
                              <p className="text-xs text-gray-400">{flight.departure_airport.city}</p>
                            </div>
                            
                            <div className="flex-1 mx-4">
                              <div className="relative">
                                <div className="border-t-2 border-gray-200"></div>
                                <div className="absolute inset-0 flex justify-center">
                                  <svg className="w-6 h-6 text-gray-400 bg-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                  </svg>
                                </div>
                              </div>
                              <p className="text-center text-xs text-gray-500 mt-1">{flight.duration || 'N/A'}</p>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{formatTime(flight.scheduled_arrival)}</p>
                              <p className="text-sm text-gray-500">{flight.arrival_airport.code}</p>
                              <p className="text-xs text-gray-400">{flight.arrival_airport.city}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className={`font-medium ${getStatusColor(flight.status)}`}>
                          Status: {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                        </span>
                        {flight.gate && <span>Gate: {flight.gate}</span>}
                        {flight.terminal && <span>Terminal: {flight.terminal}</span>}
                        {flight.aircraft_type && <span>Aircraft: {flight.aircraft_type}</span>}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col items-center lg:items-end">
                      <div className="text-center lg:text-right mb-4">
                        <p className="text-2xl font-bold text-gray-900">${flight.price}</p>
                        <p className="text-sm text-gray-500">per person</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link 
                          to={`/flights/${flight.id}`}
                          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                        >
                          View Details
                        </Link>
                        <button 
                          onClick={() => handleQuickBook(flight)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Select Flight
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Booking Modal */}
          {selectedFlight && (
            <BookingModal 
              flight={selectedFlight}
              isOpen={showBookingModal}
              onClose={() => setShowBookingModal(false)}
              onBook={handleBookingComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSearchPage;
