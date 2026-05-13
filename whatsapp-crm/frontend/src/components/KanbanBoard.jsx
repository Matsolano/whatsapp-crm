import { useState } from 'react';
import { api } from '../utils/api';

export default function KanbanBoard({ contacts, onRefresh }) {
  const stages = ['New Lead', 'In Progress', 'Qualified', 'Proposal', 'Closed', 'Lost'];
  const [draggingContact, setDraggingContact] = useState(null);

  function getContactsByStage(stage) {
    return contacts.filter(c => c.stage === stage);
  }

  async function handleDrop(stage) {
    if (!draggingContact) return;
    
    try {
      await api.updateContactStage(draggingContact.id, stage);
      onRefresh();
    } catch (error) {
      alert('Error updating stage: ' + error.message);
    } finally {
      setDraggingContact(null);
    }
  }

  function handleDragStart(contact) {
    setDraggingContact(contact);
  }

  function getStageColor(stage) {
    const colors = {
      'New Lead': 'bg-blue-50 border-blue-200',
      'In Progress': 'bg-yellow-50 border-yellow-200',
      'Qualified': 'bg-purple-50 border-purple-200',
      'Proposal': 'bg-orange-50 border-orange-200',
      'Closed': 'bg-green-50 border-green-200',
      'Lost': 'bg-red-50 border-red-200'
    };
    return colors[stage] || 'bg-gray-50 border-gray-200';
  }

  function getStageHeaderColor(stage) {
    const colors = {
      'New Lead': 'bg-blue-500',
      'In Progress': 'bg-yellow-500',
      'Qualified': 'bg-purple-500',
      'Proposal': 'bg-orange-500',
      'Closed': 'bg-green-500',
      'Lost': 'bg-red-500'
    };
    return colors[stage] || 'bg-gray-500';
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {stages.map(stage => (
          <div
            key={stage}
            className={`w-72 rounded-lg border-2 ${getStageColor(stage)} p-3`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage)}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${getStageHeaderColor(stage)}`}></div>
              <h3 className="font-semibold text-gray-800">{stage}</h3>
              <span className="ml-auto bg-white px-2 py-0.5 rounded-full text-xs text-gray-600">
                {getContactsByStage(stage).length}
              </span>
            </div>

            <div className="space-y-2">
              {getContactsByStage(stage).map(contact => (
                <div
                  key={contact.id}
                  draggable
                  onDragStart={() => handleDragStart(contact)}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-800">{contact.name}</h4>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                  {contact.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {contact.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{contact.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
