import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import Database from 'better-sqlite3';

let sock = null;
let messageStore = [];

export async function initWhatsApp(onQR, onConnect) {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  // Handle QR code
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      onQR(qr);
    }
    
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        await initWhatsApp(onQR, onConnect);
      }
    } else if (connection === 'open') {
      console.log('Connected to WhatsApp!');
      onConnect();
    }
  });

  // Handle credentials
  sock.ev.on('creds.update', saveCreds);

  // Handle messages
  sock.ev.on('messages.upsert', async (messages) => {
    for (const msg of messages.messages) {
      const phone = msg.key.remoteJid?.split('@')[0];
      const isFromMe = msg.key.fromMe;
      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
      const timestamp = msg.messageTimestamp * 1000;

      if (phone && text) {
        // Store message in database
        storeMessage(phone, text, isFromMe, timestamp);
        
        // Auto-create contact if not exists
        await autoCreateContact(phone);
      }
    }
  });

  return sock;
}

export async function sendWhatsAppMessage(phone, message) {
  if (!sock) {
    throw new Error('WhatsApp not connected');
  }

  // Format phone number
  let formattedPhone = phone.replace(/[^0-9]/g, '');
  if (!formattedPhone.includes('@')) {
    formattedPhone = formattedPhone + '@s.whatsapp.net';
  }

  const result = await sock.sendMessage(formattedPhone, { text: message });
  return result;
}

export async function disconnectWhatsApp() {
  if (sock) {
    sock.end(undefined);
    sock = null;
  }
}

// Database functions for messages
const db = new Database('crm.db');

function storeMessage(phone, text, isFromMe, timestamp) {
  const stmt = db.prepare(`
    INSERT INTO messages (phone, text, is_from_me, timestamp, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);
  stmt.run(phone, text, isFromMe ? 1 : 0, timestamp);
}

async function autoCreateContact(phone) {
  const exists = db.prepare('SELECT id FROM contacts WHERE phone = ?').get(phone);
  if (!exists) {
    db.prepare(`
      INSERT INTO contacts (name, phone, tags, stage, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).run(`User ${phone}`, phone, '[]', 'New Lead');
  }
}

export function getMessagesFromDB(phone) {
  const stmt = db.prepare('SELECT * FROM messages WHERE phone = ? ORDER BY timestamp ASC');
  return stmt.all(phone);
}
