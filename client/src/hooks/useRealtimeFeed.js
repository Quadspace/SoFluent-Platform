/**
 * useRealtimeFeed Hook
 * Top 1% Enhancement: Real-time activity feed
 */

import { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { useUserSafe, useClerkSafe } from './useClerkSafe.jsx';

export const useRealtimeFeed = () => {
  const { backendUrl } = useContext(AppContext);
  const { user } = useUserSafe();
  const { getToken } = useClerkSafe();
  const [activities, setActivities] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const eventSourceRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const connect = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        // Create EventSource connection
        // Note: EventSource doesn't support custom headers
        // We'll use fetch with credentials for SSE (requires CORS setup)
        // For production, consider WebSocket for better security
        const eventSource = new EventSource(
          `${backendUrl}/api/realtime/feed`,
          { withCredentials: true }
        );

        // Handle connection
        eventSource.onopen = () => {
          setConnected(true);
        };

        // Handle messages
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            switch (data.type) {
              case 'connected':
                // Connection established
                break;

              case 'activity':
                // Add new activity to the top
                setActivities((prev) => [data.activity, ...prev.slice(0, 49)]);
                break;

              case 'recent_activities':
                // Set recent activities
                setActivities(data.activities || []);
                break;

              case 'active_users':
                setActiveUsers(data.count || 0);
                break;

              default:
                // Unknown message type - ignore silently
                break;
            }
          } catch (error) {
            // Handle parsing error silently
          }
        };

        // Handle errors
        eventSource.onerror = (error) => {
          setConnected(false);
          eventSource.close();
          
          // Reconnect after 5 seconds
          setTimeout(() => {
            connect();
          }, 5000);
        };

        eventSourceRef.current = eventSource;
      } catch (error) {
        // Handle connection error silently
        setConnected(false);
      }
    };

    connect();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [user, backendUrl, getToken]);

  return {
    activities,
    activeUsers,
    connected
  };
};
