import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import ContactCard from '../components/ContactCard';
import ContactForm from '../components/ContactForm';
import ChatWindow from '../components/ChatWindow';
import ContactNotes from '../components/ContactNotes';

export default function Dashboard({ whatsappConnected }) {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchContacts();
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  async function loadContacts() {
    try {
      const res = await api.getContacts();
      setContacts(res.data || []);
      setFilteredContacts(res.data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function searchContacts() {
    try {
      const res = await api.searchContacts(searchQuery);
      setFilteredContacts(res.data || []);
    } catch (error) {
      console.error('Error searching contacts:', error);
    }
  }

  async function handleSaveContact(contactData) {
    try {
      if (editingContact) {
        await api.updateContact(editingContact.id, contactData);
      } else {
        await api.addContact(contactData);
      }
      setShowAddModal(false);
      setEditingContact(null);
      loadContacts();
    } catch (error) {
      alert('Error saving contact: ' + error.message);
    }
  }

  async function handleDeleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      await api.deleteContact(id);
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
      loadContacts();
    } catch (error) {
      alert('Error deleting contact: ' + error.message);
    }
  }

  function handleEditContact(contact) {
    setEditingContact(contact);
    setShowAddModal(true);
  }

  return (
    <div className="flex h-full">
      {/* Sidebar - Contacts List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 mb-3">WhatsApp CRM</h1>
          
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          
          {/* Add Button */}
          <button
            onClick={() => {
              setEditingContact(null);
              setShowAddModal(true);
            }}
            className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Contact
          </button>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {searchQuery ? 'No contacts found' : 'No contacts yet'}
            </div>
          ) : (
            filteredContacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onClick={setSelectedContact}
                isSelected={selectedContact?.id === contact.id}
              />
            ))
          )}
        </div>
      </div>

      {/* Main Content - Chat & Details */}
      <div className="flex-1 flex flex-col">
        <ChatWindow contact={selectedContact} whatsappConnected={whatsappConnected} />
        
        {selectedContact && (
          <>
            {/* Contact Details */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-500">{selectedContact.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditContact(selectedContact)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteContact(selectedContact.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {selectedContact.stage}
                </span>
                {selectedContact.tags?.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <ContactNotes contactId={selectedContact.id} />
          </>
        )}
      </div>

      {/* Add/Edit Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            <ContactForm
              contact={editingContact}
              onSave={handleSaveContact}
              onCancel={() => {
                setShowAddModal(false);
                setEditingContact(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
