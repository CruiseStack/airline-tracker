import React, { useState, useEffect, useCallback } from 'react';
import { flightAPI } from '../services/api';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const SearchFlights = () => {  // Search form state
  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    dateRange: {
      startDate: '',
      endDate: '',
    },
  });

  const navigate = useNavigate();

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState({
    origin: [],
    destination: [],
  });
  // Flight results
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Date range picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDateRange, setTempDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  // Debounced search function for locations
  const debouncedLocationSearch = useCallback(
    debounce(async (searchTerm, type) => {
      if (searchTerm.length > 1) {
        try {
          const data = await flightAPI.searchLocations(searchTerm);
          setSuggestions(prev => ({
            ...prev,
            [type]: data.results
          }));
        } catch (error) {
          console.error('Error searching locations:', error);
        }
      } else {
        setSuggestions(prev => ({
          ...prev,
          [type]: []
        }));
      }
    }, 300),
    []
  );

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Trigger autocomplete for location fields
    if (field === 'origin' || field === 'destination') {
      debouncedLocationSearch(value, field);
    }
  };
  // Handle suggestion selection
  const handleSuggestionSelect = (field, suggestion) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: suggestion.display_name
    }));

    // Clear suggestions
    setSuggestions(prev => ({
      ...prev,
      [field]: []
    }));
  };

  // Handle swap origin and destination
  const handleSwap = () => {
    setSearchForm(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));

    // Clear suggestions when swapping
    setSuggestions({
      origin: [],
      destination: []
    });
  };
  // Extract location name for search
  const extractLocationName = (locationString) => {
    // Extract the main name before any parentheses or commas
    return locationString.split('(')[0].split(',')[0].trim();
  };

  // Handle date range picker
  const handleDateRangeClick = () => {
    setTempDateRange(searchForm.dateRange);
    setShowDatePicker(true);
  };

  const handleDateRangeChange = (field, value) => {
    setTempDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyDateRange = () => {
    setSearchForm(prev => ({
      ...prev,
      dateRange: tempDateRange
    }));
    setShowDatePicker(false);
  };

  const cancelDateRange = () => {
    setTempDateRange(searchForm.dateRange);
    setShowDatePicker(false);
  };

  // Format date range display
  const formatDateRangeDisplay = () => {
    const { startDate, endDate } = searchForm.dateRange;
    if (!startDate && !endDate) return 'Select dates';
    if (startDate && !endDate) return `From ${formatDate(startDate)}`;
    if (startDate && endDate) return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    return 'Select dates';
  };
  // Search flights
  const searchFlights = async (reset = false) => {
    setLoading(true);
    
    try {
      const searchParams = {
        origin: extractLocationName(searchForm.origin),
        destination: extractLocationName(searchForm.destination),
        start_date: searchForm.dateRange.startDate,
        end_date: searchForm.dateRange.endDate,
        page: reset ? 1 : page,
        page_size: 10,
      };

      const data = await flightAPI.searchFlights(searchParams);
      
      if (reset) {
        setFlights(data.results);
        setPage(2);
      } else {
        setFlights(prev => [...prev, ...data.results]);
        setPage(prev => prev + 1);
      }

      setHasMore(data.has_next || false);
      setIsSearchMode(true);
    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load random flights
  const loadRandomFlights = async () => {
    setLoading(true);
    
    try {
      const data = await flightAPI.getRandomFlights(10);
      setFlights(prev => [...prev, ...data.results]);
    } catch (error) {
      console.error('Error loading random flights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    searchFlights(true);
  };

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000 &&
      !loading &&
      hasMore
    ) {
      if (isSearchMode) {
        searchFlights(false);
      } else {
        loadRandomFlights();
      }
    }
  }, [loading, hasMore, isSearchMode, page]);

  // Load initial random flights
  useEffect(() => {
    loadRandomFlights();
  }, []);
  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle click outside date picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  // Format duration
  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const match = duration.match(/(\d+):(\d+):(\d+)/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      return `${hours}h ${minutes}m`;
    }
    return duration;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Get today's date for min date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Flights</h1>
            <p className="text-gray-600">Find your perfect flight and discover new destinations</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Selection with Swap Button */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Origin */}
              <div className="relative md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                  type="text"
                  value={searchForm.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="City or Airport"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {suggestions.origin.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {suggestions.origin.map((location) => (
                      <div
                        key={`${location.type}-${location.id}`}
                        onClick={() => handleSuggestionSelect('origin', location)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {location.display_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {location.type === 'city' ? 'City' : 'Airport'} • {location.country}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 uppercase">
                            {location.type === 'airport' ? location.iata_code : location.country_code}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors group"
                  title="Swap origin and destination"
                >
                  <svg 
                    className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transform group-hover:rotate-180 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m0-4l4-4" />
                  </svg>
                </button>
              </div>

              {/* Destination */}
              <div className="relative md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="text"
                  value={searchForm.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  placeholder="City or Airport"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {suggestions.destination.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {suggestions.destination.map((location) => (
                      <div
                        key={`${location.type}-${location.id}`}
                        onClick={() => handleSuggestionSelect('destination', location)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {location.display_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {location.type === 'city' ? 'City' : 'Airport'} • {location.country}
                            </div>
                          </div>                          <div className="text-xs text-gray-400 uppercase">
                            {location.type === 'airport' ? location.iata_code : location.country_code}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date Range Picker */}
            <div className="max-w-md">
              <div className="relative date-picker-container">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Dates
                </label>
                <button
                  type="button"
                  onClick={handleDateRangeClick}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={searchForm.dateRange.startDate || searchForm.dateRange.endDate ? 'text-gray-900' : 'text-gray-500'}>
                      {formatDateRangeDisplay()}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </button>

                {/* Date Range Picker Modal */}
                {showDatePicker && (
                  <div className="absolute z-20 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-80">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Range Start Date
                        </label>
                        <input
                          type="date"
                          value={tempDateRange.startDate}
                          min={today}
                          onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Range End Date
                        </label>
                        <input
                          type="date"
                          value={tempDateRange.endDate}
                          min={tempDateRange.startDate || today}
                          onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Leave empty for one-way trip
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          type="button"
                          onClick={cancelDateRange}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={applyDateRange}
                          className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  'Search Flights'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Flight Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isSearchMode ? 'Search Results' : 'Discover Flights'}
            </h2>
            {flights.length > 0 && (
              <span className="text-gray-600">{flights.length} flights found</span>
            )}
          </div>

          {flights.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Loading flights...</div>
            </div>
          )}

          {flights.map((flight, index) => (
            <div key={`${flight.flight}-${flight.date}-${index}`} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-lg font-semibold text-blue-600">
                      {flight.flight_details.fnum}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(flight.date)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Gate {flight.gate_number}
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Available
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">From</div>
                      <div className="font-medium text-lg">
                        {flight.flight_details.origin}
                      </div>
                      <div className="text-sm text-gray-600">
                        {flight.flight_details.origin_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {flight.flight_details.origin_city}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium text-lg">
                        {formatDuration(flight.flight_details.duration)}
                      </div>
                      <div className="flex items-center justify-center my-2">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <div className="px-2">✈️</div>
                        <div className="h-px bg-gray-300 flex-1"></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {flight.aircraft_details.model}
                      </div>
                    </div>

                    <div className="text-right md:text-left">
                      <div className="text-sm text-gray-500">To</div>
                      <div className="font-medium text-lg">
                        {flight.flight_details.destination}
                      </div>
                      <div className="text-sm text-gray-600">
                        {flight.flight_details.destination_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {flight.flight_details.destination_city}
                      </div>
                    </div>
                  </div>                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-500">
                        Aircraft: {flight.aircraft_details.register} • 
                        Business: {flight.aircraft_details.seats_business} seats • 
                        Economy: {flight.aircraft_details.seats_economy} seats
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {formatPrice(flight.economy_price)}
                          </div>
                          <div className="text-xs text-gray-500">Economy</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(flight.business_price)}
                          </div>
                          <div className="text-xs text-gray-500">Business</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">
                            {formatPrice(flight.first_price)}
                          </div>
                          <div className="text-xs text-gray-500">First</div>
                        </div>
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                         onClick={() => navigate('/flight-info', { state: { flight } })}
>
                            Select Flight
</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="mt-2 text-gray-600">Loading more flights...</div>
            </div>
          )}          {flights.length > 0 && !hasMore && !loading && (
            <div className="text-center py-8">
              <div className="text-gray-500">No more flights to load</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFlights;
