import React, { useState, useEffect, useRef } from 'react';

const AirportAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Search airports...", 
  name,
  required = false,
  airports = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedAirport, setSelectedAirport] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Initialize with selected value
  useEffect(() => {
    if (value && airports.length > 0) {
      const airport = airports.find(a => a.code === value);
      if (airport) {
        setSelectedAirport(airport);
        setInputValue(`${airport.city} (${airport.code}) - ${airport.name}`);
      }
    }
  }, [value, airports]);  // Filter airports based on input
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredAirports(airports.slice(0, 10)); // Show first 10 airports
    } else {
      const filtered = airports.filter(airport => 
        airport.city.toLowerCase().includes(inputValue.toLowerCase()) ||
        airport.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        airport.code.toLowerCase().includes(inputValue.toLowerCase()) ||
        airport.country.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 10); // Limit to 10 results
      setFilteredAirports(filtered);
    }
  }, [inputValue, airports]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    
    // Clear selection if input doesn't match selected airport
    if (selectedAirport && !newValue.includes(selectedAirport.code)) {
      setSelectedAirport(null);
      onChange('');
    }
  };

  const handleAirportSelect = (airport) => {
    setSelectedAirport(airport);
    setInputValue(`${airport.city} (${airport.code}) - ${airport.name}`);
    setIsOpen(false);
    onChange(airport.code);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-medium">{part}</span>
      ) : part
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
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
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredAirports.length > 0 ? (
            <ul>
              {filteredAirports.map((airport) => (
                <li
                  key={airport.code}
                  onClick={() => handleAirportSelect(airport)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {highlightMatch(`${airport.city} (${airport.code})`, inputValue)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {highlightMatch(airport.name, inputValue)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {highlightMatch(airport.country, inputValue)}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {airport.code}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              {inputValue.trim() ? 'No airports found' : 'Start typing to search airports...'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AirportAutocomplete;
