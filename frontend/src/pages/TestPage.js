import React, { useState, useEffect } from 'react';
import SimpleAirportAutocomplete from '../components/SimpleAirportAutocomplete';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const TestPage = () => {
  const [selectedAirport, setSelectedAirport] = useState('');
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch(`${API_URL}/api/flights/menu/`);
        if (response.ok) {
          const data = await response.json();
          console.log('Test page - airports loaded:', data.airports?.length);
          setAirports(data.airports || []);
        }
      } catch (err) {
        console.error('Test page error:', err);
      }
    };
    fetchAirports();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Airport Autocomplete Test</h1>
      
      <div className="mb-4 p-4 bg-gray-100">
        <p>Airports loaded: {airports.length}</p>
        <p>Selected: {selectedAirport}</p>
      </div>
      
      <div className="max-w-md">
        <label className="block text-sm font-medium mb-2">Test Airport Search:</label>
        <SimpleAirportAutocomplete
          name="test"
          value={selectedAirport}
          onChange={(value) => {
            console.log('Airport selected:', value);
            setSelectedAirport(value);
          }}
          placeholder="Search for an airport..."
          airports={airports}
        />
      </div>
      
      <div className="mt-4">
        <h3 className="font-bold">Sample airports:</h3>
        {airports.slice(0, 5).map(airport => (
          <div key={airport.code} className="text-sm">
            {airport.code} - {airport.city} ({airport.name})
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
