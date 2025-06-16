import { useState } from 'react';
import { createTicket } from '@/api/ticket'; // or '../api/ticket' if no path aliases

export default function CreateTicketForm() {
  const [formData, setFormData] = useState({
    flight_number: '',
    departure: '',
    arrival: '',
    departure_time: '',
    arrival_time: '',
    seat_number: '',
    price: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket(formData);
      setStatus('✅ Ticket created successfully!');
      setFormData({
        flight_number: '',
        departure: '',
        arrival: '',
        departure_time: '',
        arrival_time: '',
        seat_number: '',
        price: '',
      });
    } catch (err) {
      console.error(err);
      setStatus('❌ Ticket creation failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-xl shadow space-y-3">
      <h2 className="text-xl font-bold">Create Ticket</h2>

      <input type="text" name="flight_number" value={formData.flight_number}
        onChange={handleChange} placeholder="Flight Number" className="w-full border px-2 py-1" />
      <input type="text" name="departure" value={formData.departure}
        onChange={handleChange} placeholder="Departure" className="w-full border px-2 py-1" />
      <input type="text" name="arrival" value={formData.arrival}
        onChange={handleChange} placeholder="Arrival" className="w-full border px-2 py-1" />
      <input type="datetime-local" name="departure_time" value={formData.departure_time}
        onChange={handleChange} className="w-full border px-2 py-1" />
      <input type="datetime-local" name="arrival_time" value={formData.arrival_time}
        onChange={handleChange} className="w-full border px-2 py-1" />
      <input type="text" name="seat_number" value={formData.seat_number}
        onChange={handleChange} placeholder="Seat Number" className="w-full border px-2 py-1" />
      <input type="number" name="price" value={formData.price}
        onChange={handleChange} placeholder="Price" className="w-full border px-2 py-1" />

      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
        Create Ticket
      </button>

      {status && <p>{status}</p>}
    </form>
  );
}
