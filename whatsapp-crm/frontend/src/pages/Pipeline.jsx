import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import KanbanBoard from '../components/KanbanBoard';

export default function Pipeline({ whatsappConnected }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      const res = await api.getContacts();
      setContacts(res.data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pipeline</h1>
        <p className="text-gray-500">Drag and drop contacts to update their stage</p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
      ) : (
        <KanbanBoard contacts={contacts} onRefresh={loadContacts} />
      )}
    </div>
  );
}
