import { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      if (client) {
        client.deactivate();
        setClient(null);
        setConnected(false);
      }
      return;
    }

    let baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    // Derive WS URL: Replace /api with /ws, or append /ws if /api is missing
    const wsUrl = baseUrl.includes('/api') 
      ? baseUrl.replace('/api', '/ws') 
      : `${baseUrl.replace(/\/$/, '')}/ws`;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      debug: (str) => console.log('STOMP: ' + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket');
      setConnected(true);

      // Subscribe to global notifications (for Admins mainly, or general announcements)
      stompClient.subscribe('/topic/notifications', (message) => {
        const data = JSON.parse(message.body);
        showToast(data);
      });

      // Subscribe to user-specific notifications
      if (user.username) {
        stompClient.subscribe(`/user/${user.username}/queue/notifications`, (message) => {
          const data = JSON.parse(message.body);
          showToast(data);
        });
      }
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [user]);

  const showToast = (data) => {
    const toastConfig = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark", // since our app is dark mode by default
    };

    switch (data.type) {
      case 'SUCCESS':
        toast.success(data.message, toastConfig);
        break;
      case 'ERROR':
        toast.error(data.message, toastConfig);
        break;
      case 'WARNING':
        toast.warning(data.message, toastConfig);
        break;
      default:
        toast.info(data.message, toastConfig);
    }
  };

  return (
    <WebSocketContext.Provider value={{ client, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
