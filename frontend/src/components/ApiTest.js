import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ApiTest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API at:', `${API_URL}/api/flights/menu/`);
        const response = await fetch(`${API_URL}/api/flights/menu/`);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (response.ok) {
          const result = await response.json();
          console.log('API Response:', result);
          setData(result);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.error('API Test Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) {
    return <div className="p-4 bg-yellow-100">Testing API connection...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800">
        <h3 className="font-bold">API Error:</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 text-green-800">
      <h3 className="font-bold">API Test Success!</h3>
      <p>Airports found: {data?.airports?.length || 0}</p>
      <p>Airlines found: {data?.airlines?.length || 0}</p>
      {data?.airports?.slice(0, 3).map(airport => (
        <div key={airport.code} className="text-sm">
          {airport.code} - {airport.city} ({airport.name})
        </div>
      ))}
    </div>
  );
};

export default ApiTest;
