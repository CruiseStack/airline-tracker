import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/tickets/';

export const createTicket = async (ticketData) => {
  const response = await axios.post(BASE_URL, ticketData);
  return response.data;
};

export const payTicket = async (ticketId, paymentData) => {
  const response = await axios.post(`${BASE_URL}${ticketId}/pay/`, paymentData);
  return response.data;
};