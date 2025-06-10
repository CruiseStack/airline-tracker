import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ApiDebug = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API URL:', `${API_URL}/api/flights/menu/`);
        const response = await fetch(`${API_URL}/api/flights/menu/`);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          setApiResponse(data);
        } else {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          setError(`HTTP ${response.status}: ${errorText}`);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">API Debug</h3>
      <p><strong>API URL:</strong> {API_URL}/api/flights/menu/</p>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 p-3 rounded text-red-700 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {apiResponse && (
        <div className="bg-green-100 p-3 rounded text-green-700">
          <strong>Success!</strong> Loaded {apiResponse.airports?.length} airports
          <details className="mt-2">
            <summary>View Response</summary>
            <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto max-h-64">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ApiDebug;
