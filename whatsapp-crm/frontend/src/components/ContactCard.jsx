export default function ContactCard({ contact, onClick, isSelected }) {
  return (
    <div
      onClick={() => onClick(contact)}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
        isSelected ? 'bg-green-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
          <p className="text-sm text-gray-500">{contact.phone}</p>
          {contact.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {contact.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {contact.stage && (
            <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${getStageColor(contact.stage)}`}>
              {contact.stage}
            </span>
          )}
        </div>
        {contact.last_interaction && (
          <span className="text-xs text-gray-400 ml-2">
            {new Date(contact.last_interaction).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

function getStageColor(stage) {
  const colors = {
    'New Lead': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    'Qualified': 'bg-purple-100 text-purple-700',
    'Proposal': 'bg-orange-100 text-orange-700',
    'Closed': 'bg-green-100 text-green-700',
    'Lost': 'bg-red-100 text-red-700'
  };
  return colors[stage] || 'bg-gray-100 text-gray-700';
}
