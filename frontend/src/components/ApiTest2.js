import React, { useState } from 'react';

const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/flights/menu/');
      console.log('Response:', response);
      if (response.ok) {
        const data = await response.json();
        setResult(`Success! Got ${data.airports?.length} airports`);
        console.log('Full data:', data);
      } else {
        setResult(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setResult(`Fetch error: ${error.message}`);
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h3 className="font-bold mb-2">API Test</h3>
      <button 
        onClick={testApi} 
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>
      <p className="mt-2">{result}</p>
    </div>
  );
};

export default ApiTest;
