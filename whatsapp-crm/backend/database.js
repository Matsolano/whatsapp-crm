import Database from 'better-sqlite3';

let db = null;

export function initDatabase() {
  db = new Database('crm.db');

  // Create contacts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      tags TEXT DEFAULT '[]',
      notes TEXT DEFAULT '',
      stage TEXT DEFAULT 'New Lead',
      last_interaction DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      text TEXT NOT NULL,
      is_from_me BOOLEAN DEFAULT 0,
      timestamp INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create notes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized');
}

export function getContacts() {
  const stmt = db.prepare('SELECT * FROM contacts ORDER BY updated_at DESC');
  const contacts = stmt.all();
  return contacts.map(c => ({
    ...c,
    tags: JSON.parse(c.tags || '[]')
  }));
}

export function searchContacts(query) {
  const stmt = db.prepare(`
    SELECT * FROM contacts 
    WHERE name LIKE ? OR phone LIKE ? OR notes LIKE ?
    ORDER BY updated_at DESC
  `);
  const searchTerm = `%${query}%`;
  const contacts = stmt.all(searchTerm, searchTerm, searchTerm);
  return contacts.map(c => ({
    ...c,
    tags: JSON.parse(c.tags || '[]')
  }));
}

export function getContactsByStage(stage) {
  const stmt = db.prepare('SELECT * FROM contacts WHERE stage = ? ORDER BY updated_at DESC');
  const contacts = stmt.all(stage);
  return contacts.map(c => ({
    ...c,
    tags: JSON.parse(c.tags || '[]')
  }));
}

export function addContact(name, phone, tags = [], notes = '', stage = 'New Lead') {
  const stmt = db.prepare(`
    INSERT INTO contacts (name, phone, tags, notes, stage, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `);
  const result = stmt.run(name, phone, JSON.stringify(tags), notes, stage);
  return result.lastInsertRowid;
}

export function updateContact(id, name, phone, tags, notes, stage, lastInteraction) {
  const stmt = db.prepare(`
    UPDATE contacts 
    SET name = ?, phone = ?, tags = ?, notes = ?, stage = ?, last_interaction = ?, updated_at = datetime('now')
    WHERE id = ?
  `);
  stmt.run(name, phone, JSON.stringify(tags), notes, stage, lastInteraction || new Date().toISOString(), id);
}

export function updateContactStage(id, stage) {
  const stmt = db.prepare(`
    UPDATE contacts 
    SET stage = ?, updated_at = datetime('now')
    WHERE id = ?
  `);
  stmt.run(stage, id);
}

export function deleteContact(id) {
  const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
  stmt.run(id);
}

export function getMessages(phone) {
  const stmt = db.prepare('SELECT * FROM messages WHERE phone = ? ORDER BY timestamp ASC');
  return stmt.all(phone);
}

export function addNote(contactId, content) {
  const stmt = db.prepare(`
    INSERT INTO notes (contact_id, content, created_at)
    VALUES (?, ?, datetime('now'))
  `);
  stmt.run(contactId, content);
}

export function getNotes(contactId) {
  const stmt = db.prepare('SELECT * FROM notes WHERE contact_id = ? ORDER BY created_at DESC');
  return stmt.all(contactId);
}

export function deleteNote(id) {
  const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
  stmt.run(id);
}

export function getDatabase() {
  return db;
}
