import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightInfoPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flight } = location.state || {};
    const [calculatedPrice, setCalculatedPrice] = useState(null);

    useEffect(() => {
        // Fetch price from backend using FlightPriceCalculator if flight has an id
        if (flight && flight.id) {
            fetch(`/api/flight-instance/${flight.id}/price/`)
                .then(res => res.json())
                .then(data => setCalculatedPrice(data.price))
                .catch(() => setCalculatedPrice(null));
        }
    }, [flight]);

    if (!flight) return <p className="text-center text-red-500 mt-10">No flight selected.</p>;

    const handleProceed = () => {
        navigate('/payment', { state: { flight } });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Flight Information</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        <span className="font-semibold">Flight Number:</span> {flight.fnum || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Origin:</span>{" "}
                        {flight.origin?.name
                            ? `${flight.origin.name} (${flight.origin.iata_code || "N/A"})`
                            : "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Destination:</span>{" "}
                        {flight.destination?.name
                            ? `${flight.destination.name} (${flight.destination.iata_code || "N/A"})`
                            : "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Date:</span> {flight.date || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Gate Number:</span> {flight.gate_number || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Aircraft:</span>{" "}
                        {flight.aircraft?.model
                            ? `${flight.aircraft.model} (${flight.aircraft.register || "N/A"})`
                            : "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Price:</span>{" "}
                        <span className="text-green-600 font-semibold">
                            {calculatedPrice !== null
                                ? `$${calculatedPrice}`
                                : "N/A"}
                        </span>
                    </p>
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
