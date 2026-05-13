import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // WhatsApp
  getWhatsAppStatus: () => axios.get(`${API_BASE}/whatsapp/status`),
  connectWhatsApp: () => axios.post(`${API_BASE}/whatsapp/connect`),
  disconnectWhatsApp: () => axios.post(`${API_BASE}/whatsapp/disconnect`),
  sendMessage: (phone, message) => axios.post(`${API_BASE}/messages/send`, { phone, message }),

  // Contacts
  getContacts: () => axios.get(`${API_BASE}/contacts`),
  searchContacts: (query) => axios.get(`${API_BASE}/contacts/search?query=${query}`),
  getContactsByStage: (stage) => axios.get(`${API_BASE}/contacts/stage/${stage}`),
  addContact: (contact) => axios.post(`${API_BASE}/contacts`, contact),
  updateContact: (id, contact) => axios.put(`${API_BASE}/contacts/${id}`, contact),
  deleteContact: (id) => axios.delete(`${API_BASE}/contacts/${id}`),
  updateContactStage: (id, stage) => axios.put(`${API_BASE}/contacts/${id}/stage`, { stage }),

  // Messages
  getMessages: (phone) => axios.get(`${API_BASE}/messages/${phone}`),

  // Notes
  addNote: (contactId, content) => axios.post(`${API_BASE}/contacts/${contactId}/notes`, { content }),
  getNotes: (contactId) => axios.get(`${API_BASE}/contacts/${contactId}/notes`),
  deleteNote: (id) => axios.delete(`${API_BASE}/notes/${id}`),
};

export default api;
