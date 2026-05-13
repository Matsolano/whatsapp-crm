import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function ChatWindow({ contact, whatsappConnected }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (contact) {
      loadMessages();
    }
  }, [contact]);

  async function loadMessages() {
    try {
      const res = await api.getMessages(contact.phone);
      setMessages(res.data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim() || !whatsappConnected) return;

    setSending(true);
    try {
      await api.sendMessage(contact.phone, newMessage);
      setNewMessage('');
      loadMessages();
    } catch (error) {
      alert('Error sending message: ' + error.message);
    } finally {
      setSending(false);
    }
  }

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>Select a contact to view conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h2 className="font-semibold text-gray-800">{contact.name}</h2>
        <p className="text-sm text-gray-500">{contact.phone}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.is_from_me ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.is_from_me
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.is_from_me ? 'text-green-100' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={whatsappConnected ? "Type a message..." : "Connect WhatsApp to send messages"}
            disabled={!whatsappConnected || sending}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!whatsappConnected || !newMessage.trim() || sending}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
