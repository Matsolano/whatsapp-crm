import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    checkWhatsAppStatus();
  }, []);

  async function checkWhatsAppStatus() {
    try {
      const response = await fetch('/api/whatsapp/status');
      const data = await response.json();
      setWhatsappConnected(data.connected);
    } catch (error) {
      console.error('Error checking WhatsApp status:', error);
    }
  }

  return (
    <AppContext.Provider value={{
      whatsappConnected,
      setWhatsappConnected,
      contacts,
      setContacts,
      selectedContact,
      setSelectedContact
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
