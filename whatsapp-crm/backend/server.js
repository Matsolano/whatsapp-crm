import express from 'express';
import cors from 'cors';
import { initWhatsApp, sendWhatsAppMessage, disconnectWhatsApp } from './whatsapp.js';
import { initDatabase, getContacts, addContact, updateContact, deleteContact, getMessages, addNote, getNotes, deleteNote, searchContacts, getContactsByStage, updateContactStage } from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// WhatsApp connection status
let whatsappConnected = false;

// Routes

// Get WhatsApp connection status
app.get('/api/whatsapp/status', (req, res) => {
  res.json({ connected: whatsappConnected });
});

// Connect WhatsApp (triggers QR code generation)
app.post('/api/whatsapp/connect', async (req, res) => {
  try {
    await initWhatsApp((qr) => {
      // QR code will be logged to terminal and sent via websocket in production
      console.log('QR Code:', qr);
    }, () => {
      whatsappConnected = true;
      console.log('WhatsApp connected!');
    });
    res.json({ success: true, message: 'Check terminal for QR code' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Disconnect WhatsApp
app.post('/api/whatsapp/disconnect', async (req, res) => {
  try {
    await disconnectWhatsApp();
    whatsappConnected = false;
    res.json({ success: true, message: 'Disconnected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
app.post('/api/messages/send', async (req, res) => {
  try {
    const { phone, message } = req.body;
    await sendWhatsAppMessage(phone, message);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await getContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search contacts
app.get('/api/contacts/search', async (req, res) => {
  try {
    const { query } = req.query;
    const contacts = await searchContacts(query);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get contacts by stage (for Kanban)
app.get('/api/contacts/stage/:stage', async (req, res) => {
  try {
    const { stage } = req.params;
    const contacts = await getContactsByStage(stage);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add contact
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, phone, tags, notes, stage } = req.body;
    const contactId = await addContact(name, phone, tags, notes, stage);
    res.json({ success: true, id: contactId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, tags, notes, stage, lastInteraction } = req.body;
    await updateContact(id, name, phone, tags, notes, stage, lastInteraction);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteContact(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact stage
app.put('/api/contacts/:id/stage', async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    await updateContactStage(id, stage);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a contact
app.get('/api/messages/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const messages = await getMessages(phone);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add note to contact
app.post('/api/contacts/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    await addNote(id, content);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notes for contact
app.get('/api/contacts/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await getNotes(id);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteNote(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
