import { ticketAPI } from '../services/api';

export const createTicket = async (ticketData) => {
  return await ticketAPI.createTicket(ticketData);
};

export const payTicket = async (ticketId, paymentData) => {
  return await ticketAPI.payTicket(ticketId, paymentData);
};