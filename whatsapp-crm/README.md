# WhatsApp CRM

A personal WhatsApp CRM web application to manage your WhatsApp conversations and contacts.

## Features

- **Dashboard**: View all WhatsApp contacts and conversations
- **Contact Management**: Add, edit, delete contacts with name, phone, tags, notes, and last interaction date
- **Conversation View**: Read full chat history per contact
- **Search**: Search contacts and messages
- **Tags/Categories**: Tag contacts (e.g., client, lead, personal)
- **Notes**: Add CRM-style notes per contact
- **Pipeline View**: Kanban board to track contact stages (New Lead > In Progress > Closed)
- **QR Code Login**: Connect WhatsApp via QR code scan using Baileys library

## Tech Stack

- **Frontend**: React + Tailwind CSS + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (local, no cloud dependency)
- **WhatsApp Integration**: Baileys library (open-source, no Meta API needed)

## Installation

```bash
cd whatsapp-crm
npm start
```

This will install dependencies for both backend and frontend.

## Running the Application

You need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open http://localhost:3000 in your browser.

## Usage

1. Go to **Settings** page
2. Click **Connect WhatsApp**
3. Check the backend terminal for the QR code
4. Scan the QR code with your WhatsApp app (WhatsApp > Linked Devices)
5. Return to **Dashboard** to view your contacts
6. Click on a contact to view conversation history
7. Use the **Pipeline** view to track contact stages with drag-and-drop
8. Add notes to contacts for CRM-style tracking

## Project Structure

```
whatsapp-crm/
├── backend/
│   ├── server.js          # Express server
│   ├── whatsapp.js        # Baileys WhatsApp integration
│   ├── database.js        # SQLite database functions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API utilities
│   │   ├── context/       # React context
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   └── package.json
└── package.json
```

## API Endpoints

### WhatsApp
- `GET /api/whatsapp/status` - Get connection status
- `POST /api/whatsapp/connect` - Connect WhatsApp (generates QR code)
- `POST /api/whatsapp/disconnect` - Disconnect WhatsApp
- `POST /api/messages/send` - Send a message

### Contacts
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/search?query=` - Search contacts
- `GET /api/contacts/stage/:stage` - Get contacts by stage
- `POST /api/contacts` - Add contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `PUT /api/contacts/:id/stage` - Update contact stage

### Messages
- `GET /api/messages/:phone` - Get messages for a contact

### Notes
- `POST /api/contacts/:id/notes` - Add note
- `GET /api/contacts/:id/notes` - Get notes
- `DELETE /api/notes/:id` - Delete note

## License

MIT
