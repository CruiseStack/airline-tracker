import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightInfoPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flight } = location.state || {};

    if (!flight) return <p>No flight selected.</p>;

    const handleProceed = () => {
        navigate('/payment', { state: { flight } });
    };

    return (
        <div>
            <h2>Flight Information</h2>
            <p><strong>Flight Number:</strong> {flight.number}</p>
            <p><strong>Departure:</strong> {flight.departure}</p>
            <p><strong>Arrival:</strong> {flight.arrival}</p>
            <p><strong>Date:</strong> {flight.date}</p>
            <p><strong>Flight Hour:</strong> {flight.flight_hour}</p>
            <p><strong>Price:</strong> ${flight.price}</p>
            <button onClick={handleProceed}>Proceed to Payment</button>
        </div>
    );
};

export default FlightInfoPage;