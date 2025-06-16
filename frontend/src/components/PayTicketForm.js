import { useState } from 'react';
import { payTicket } from '@/api/ticket'; // or '../api/ticket'

export default function PayTicketForm({ ticketId }) {
  const [paidCash, setPaidCash] = useState('');
  const [paidPoints, setPaidPoints] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const total = parseFloat(paidCash || 0) + parseInt(paidPoints || 0);
      await payTicket(ticketId, {
        paid_cash: paidCash,
        paid_points: paidPoints,
        total,
      });
      setStatus('✅ Payment successful!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Payment failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-xl shadow space-y-2">
      <h2 className="text-xl font-bold">Pay Ticket</h2>
      <input
        type="number"
        placeholder="Paid Cash"
        value={paidCash}
        onChange={e => setPaidCash(e.target.value)}
        className="w-full border px-2 py-1"
      />
      <input
        type="number"
        placeholder="Paid Points"
        value={paidPoints}
        onChange={e => setPaidPoints(e.target.value)}
        className="w-full border px-2 py-1"
      />
      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
        Pay Ticket
      </button>
      {status && <p>{status}</p>}
    </form>
  );
}
