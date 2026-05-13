import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../utils/api';

export default function WhatsAppConnect() {
  const [qrCode, setQrCode] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    try {
      const res = await api.getWhatsAppStatus();
      setConnected(res.data.connected);
    } catch (error) {
      console.error('Error checking status:', error);
    }
  }

  async function handleConnect() {
    setConnecting(true);
    try {
      const res = await api.connectWhatsApp();
      // In a real app, we'd use WebSocket to get the QR code
      // For now, user needs to check terminal
      alert('Check the backend terminal for the QR code! Scan it with WhatsApp.');
      setQrCode('check-terminal');
    } catch (error) {
      alert('Error connecting: ' + error.message);
    } finally {
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    try {
      await api.disconnectWhatsApp();
      setConnected(false);
      setQrCode(null);
    } catch (error) {
      alert('Error disconnecting: ' + error.message);
    }
  }

  if (connected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">WhatsApp Connected</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="mt-3 text-sm text-red-600 hover:text-red-800"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">WhatsApp Connection</h3>
      
      {!qrCode ? (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {connecting ? 'Connecting...' : 'Connect WhatsApp'}
        </button>
      ) : (
        <div className="text-center">
          {qrCode === 'check-terminal' ? (
            <div className="bg-gray-100 rounded-lg p-6">
              <p className="text-gray-700 mb-2">QR Code generated!</p>
              <p className="text-sm text-gray-500">Please check the backend terminal and scan the QR code with WhatsApp.</p>
            </div>
          ) : (
            <div className="bg-white p-4 inline-block rounded-lg shadow">
              <QRCodeSVG value={qrCode} size={200} />
            </div>
          )}
          <p className="mt-4 text-sm text-gray-500">Scan with WhatsApp &gt; Linked Devices</p>
        </div>
      )}
    </div>
  );
}
