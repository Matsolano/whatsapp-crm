import { useState } from 'react';
import WhatsAppConnect from '../components/WhatsAppConnect';

export default function Settings({ whatsappConnected, setWhatsappConnected }) {
  return (
    <div className="h-full flex flex-col bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

        {/* WhatsApp Connection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <WhatsAppConnect />
        </div>

        {/* App Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">About</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Backend:</strong> Node.js + Express + SQLite</p>
            <p><strong>Frontend:</strong> React + Tailwind CSS</p>
            <p><strong>WhatsApp Integration:</strong> Baileys Library</p>
          </div>
        </div>

        {/* Help */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Go to Settings and click "Connect WhatsApp"</li>
            <li>Scan the QR code with your WhatsApp app</li>
            <li>Return to Dashboard to view your contacts</li>
            <li>Click on a contact to view conversation history</li>
            <li>Use the Pipeline view to track contact stages</li>
            <li>Add notes to contacts for CRM-style tracking</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
