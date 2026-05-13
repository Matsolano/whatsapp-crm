import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function ContactNotes({ contactId }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contactId) {
      loadNotes();
    }
  }, [contactId]);

  async function loadNotes() {
    try {
      const res = await api.getNotes(contactId);
      setNotes(res.data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  async function handleAddNote(e) {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    try {
      await api.addNote(contactId, newNote);
      setNewNote('');
      loadNotes();
    } catch (error) {
      alert('Error adding note: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteNote(noteId) {
    if (!confirm('Delete this note?')) return;
    
    try {
      await api.deleteNote(noteId);
      loadNotes();
    } catch (error) {
      alert('Error deleting note: ' + error.message);
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Notes</h3>

      {/* Add Note Form */}
      <form onSubmit={handleAddNote} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !newNote.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No notes yet</p>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className="bg-gray-50 rounded-lg p-3 flex justify-between items-start group"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-700">{note.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
