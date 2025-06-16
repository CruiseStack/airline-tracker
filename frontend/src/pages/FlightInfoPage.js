import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightInfoPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flight } = location.state || {};

    if (!flight) return <p className="text-center text-red-500 mt-10">No flight selected.</p>;

    const handleProceed = () => {
        navigate('/payment', { state: { flight } });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Flight Information</h2>
                <div className="space-y-4 text-gray-700">
                    <p><span className="font-semibold">Flight Number:</span> {flight.number}</p>
                    <p><span className="font-semibold">Departure:</span> {flight.departure}</p>
                    <p><span className="font-semibold">Arrival:</span> {flight.arrival}</p>
                    <p><span className="font-semibold">Date:</span> {flight.date}</p>
                    <p><span className="font-semibold">Flight Hour:</span> {flight.flight_hour}</p>
                    <p><span className="font-semibold">Price:</span> <span className="text-green-600 font-semibold">${flight.price}</span></p>
                </div>
                <button 
                    onClick={handleProceed} 
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
};

export default FlightInfoPage;
