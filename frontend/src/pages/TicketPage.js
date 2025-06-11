import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TicketPage = () => {
  const { ticketId } = useParams(); // react-router'dan parametre alır
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Bilet bilgilerini getir
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`/api/tickets/${ticketId}/`);
        setTicket(response.data);
      } catch (err) {
        setError('Ticket could not be loaded.');
      }
    };

    fetchTicket();
  }, [ticketId]);

  // Check-in işlemi
  const handleCheckIn = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/tickets/${ticketId}/checkin/`);
      setMessage(response.data.message || 'Checked in successfully!');
      setTicket(prev => ({ ...prev, checkin_status: true }));
    } catch (err) {
      setMessage(err.response?.data?.error || 'Check-in failed.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!ticket) {
    return <div className="text-center mt-10">Loading ticket...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
      <p><strong>PNR Number:</strong> {ticket.PNR_number}</p>
      <p><strong>Seat:</strong> {ticket.seat_number}</p>
      <p><strong>Gate:</strong> {ticket.gate_number}</p>
      <p><strong>Class:</strong> {ticket.class_type}</p>
      <p><strong>Carry-on:</strong> {ticket.carry_on ? 'Yes' : 'No'}</p>
      <p><strong>Baggage:</strong> {ticket.baggage} kg</p>
      <p><strong>Extra Baggage:</strong> {ticket.extra_baggage} kg</p>
      <p><strong>Check-in Status:</strong> {ticket.checkin_status ? '✅ Checked In' : '❌ Not Checked In'}</p>

      {!ticket.checkin_status && (
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Checking in...' : 'Check-in'}
        </button>
      )}

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
};

export default TicketPage;
