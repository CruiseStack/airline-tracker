import React, { useState, useEffect } from 'react';

const SimpleAirportAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Search airports...", 
  name,
  required = false,
  airports = []
}) => {  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAirports, setFilteredAirports] = useState([]);

  // Initialize filteredAirports when airports prop changes
  useEffect(() => {
    console.log(`[${name}] Airports prop changed. Count:`, airports.length);
    if (airports.length > 0 && filteredAirports.length === 0 && !searchTerm) {
      setFilteredAirports(airports.slice(0, 10));
    }
  }, [airports, name, filteredAirports.length, searchTerm]);// Filter airports when search term changes OR when airports load initially
  useEffect(() => {
    console.log(`[${name}] Filtering airports. Search term:`, searchTerm, 'Airports count:', airports.length);
    if (!searchTerm) {
      setFilteredAirports(airports.slice(0, 10)); // Show first 10
    } else {
      const filtered = airports.filter(airport => 
        airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.country.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10);
      setFilteredAirports(filtered);
    }
  }, [searchTerm, airports, name]);

  // Set initial display value when airports load and value is provided
  useEffect(() => {
    if (value && airports.length > 0) {
      const selectedAirport = airports.find(a => a.code === value);
      if (selectedAirport) {
        setSearchTerm(`${selectedAirport.city} (${selectedAirport.code})`);
      }
    }
  }, [value, airports]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    // Clear value if user is typing
    if (value) {
      onChange('');
    }
  };

  const handleAirportSelect = (airport) => {
    setSearchTerm(`${airport.city} (${airport.code})`);
    setIsOpen(false);
    onChange(airport.code); // Update parent state with selected airport code
  };  const handleFocus = () => {
    setIsOpen(true);
    // If no airports are filtered yet, show the first 10
    if (filteredAirports.length === 0 && airports.length > 0) {
      setFilteredAirports(airports.slice(0, 10));
    }
  };
  const handleBlur = () => {
    console.log(`[${name}] Input blurred, delaying close`);
    // Delay closing to allow click on dropdown
    setTimeout(() => {
      console.log(`[${name}] Closing dropdown after delay`);
      setIsOpen(false);
    }, 200);
  };

  const handleMouseDown = (e) => {
    // Prevent blur when clicking on dropdown
    e.preventDefault();
  };
  return (
    <div className="relative">
      {/* Debug info */}
      <div className="text-xs text-gray-500 mb-1">
        {name}: {airports.length} airports, filtered: {filteredAirports.length}, isOpen: {isOpen.toString()}
      </div>
      
      <input
        type="text"
        name={name}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 text-sm"
      />
      
      {/* Search Icon */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>      {/* Dropdown */}
      {isOpen && filteredAirports.length > 0 && (
        <div 
          className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto"
          onMouseDown={handleMouseDown}
          style={{ zIndex: 9999 }}
        >
          {filteredAirports.map((airport) => (
            <div
              key={airport.code}
              onClick={() => handleAirportSelect(airport)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 border-gray-100"
            >
              <div className="font-medium text-gray-900">
                {airport.city} ({airport.code})
              </div>
              <div className="text-sm text-gray-500">
                {airport.name}
              </div>
              <div className="text-xs text-gray-400">
                {airport.country}
              </div>
            </div>
          ))}
        </div>
      )}{/* Show message when no airports */}
      {isOpen && filteredAirports.length === 0 && (
        <div 
          className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-4 text-center text-gray-500"
          onMouseDown={handleMouseDown}
          style={{ zIndex: 9999 }}
        >
          {airports.length === 0 ? 'Loading airports...' : 'No airports found'}
        </div>
      )}
    </div>
  );
};

export default SimpleAirportAutocomplete;
