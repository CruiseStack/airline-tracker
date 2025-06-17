import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightInfoPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flight } = location.state || {};

    if (!flight) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
                <div className="text-red-500 text-6xl mb-4">✈️</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No Flight Selected</h2>
                <p className="text-gray-600 mb-4">Please go back and select a flight to view details.</p>                <button 
                    onClick={() => navigate('/search-flights')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
                >
                    Search Flights
                </button>
            </div>
        </div>
    );

    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours}h ${minutes}m`;
    };    const handleProceed = (selectedClass = 'Economy') => {
        // Create a flight object with the selected class and price
        const flightWithClass = {
            ...flight,
            selected_class: selectedClass,
            selected_price: selectedClass === 'Economy' ? flight.economy_price : 
                           selectedClass === 'Business' ? flight.business_price : 
                           flight.first_price
        };
        navigate('/payment', { state: { flight: flightWithClass } });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                        <h1 className="text-3xl font-bold mb-2">Flight Details</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-xl font-semibold">
                                {flight.flight_details?.fnum || 'N/A'}
                            </span>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                {flight.date || 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Flight Route */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Origin */}
                            <div className="text-center md:text-left">
                                <div className="text-sm text-gray-500 mb-1">From</div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    {flight.flight_details?.origin || 'N/A'}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {flight.flight_details?.origin_name || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {flight.flight_details?.origin_city || 'N/A'}
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="text-center">
                                <div className="text-sm text-gray-500 mb-1">Duration</div>                                <div className="text-xl font-bold text-gray-900 mb-2">
                                    {formatDuration(flight.flight_details?.duration_minutes)}
                                </div>
                                <div className="flex items-center justify-center mb-2">
                                    <div className="h-px bg-gray-300 flex-1"></div>
                                    <div className="px-3 text-2xl">✈️</div>
                                    <div className="h-px bg-gray-300 flex-1"></div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Gate {flight.gate_number || 'N/A'}
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="text-center md:text-right">
                                <div className="text-sm text-gray-500 mb-1">To</div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    {flight.flight_details?.destination || 'N/A'}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {flight.flight_details?.destination_name || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {flight.flight_details?.destination_city || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aircraft Details */}
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Aircraft Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Model:</span>
                                <span className="ml-2 text-gray-600">{flight.aircraft_details?.model || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Registration:</span>
                                <span className="ml-2 text-gray-600">{flight.aircraft_details?.register || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Total Seats:</span>
                                <span className="ml-2 text-gray-600">
                                    {(flight.aircraft_details?.seats_business || 0) + (flight.aircraft_details?.seats_economy || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Class</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Economy */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                                 onClick={() => handleProceed('Economy')}>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">Economy Class</div>
                                    <div className="text-2xl font-bold text-green-600 mb-2">
                                        {formatPrice(flight.economy_price || 0)}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-3">
                                        {flight.aircraft_details?.seats_economy || 0} seats available
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        • Standard baggage allowance<br/>
                                        • Meal service<br/>
                                        • In-flight entertainment
                                    </div>
                                </div>
                            </div>

                            {/* Business */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                                 onClick={() => handleProceed('Business')}>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">Business Class</div>
                                    <div className="text-2xl font-bold text-blue-600 mb-2">
                                        {formatPrice(flight.business_price || 0)}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-3">
                                        {flight.aircraft_details?.seats_business || 0} seats available
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        • Extra baggage allowance<br/>
                                        • Priority boarding<br/>
                                        • Premium meal service
                                    </div>
                                </div>
                            </div>

                            {/* First */}
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                                 onClick={() => handleProceed('First')}>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">First Class</div>
                                    <div className="text-2xl font-bold text-purple-600 mb-2">
                                        {formatPrice(flight.first_price || 0)}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-3">
                                        Limited seats available
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        • Maximum baggage allowance<br/>
                                        • VIP lounge access<br/>
                                        • Luxury amenities
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-gray-50 flex justify-between items-center">                        <button 
                            onClick={() => navigate('/search-flights')}
                            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                            ← Back to Search
                        </button>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">Starting from</div>
                            <div className="text-xl font-bold text-green-600">
                                {formatPrice(flight.economy_price || 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>    );
};

export default FlightInfoPage;
