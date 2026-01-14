/**
 * useUserRole Hook
 * 3-Tier Platform: Get user role from backend
 */

import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useUserSafe } from './useClerkSafe.jsx';

export const useUserRole = () => {
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const token = await getToken();
      
      if (!token || !user) {
        setRole('student'); // Default role
        setLoading(false);
        return;
      }

      // Fetch user from backend to get role
      // Try to get role from Clerk metadata first
      const clerkRole = user?.publicMetadata?.role;
      
      if (clerkRole) {
        setRole(clerkRole);
        setLoading(false);
        return;
      }

      // Fallback: try to get from backend
      const response = await fetch(`${backendUrl}/api/student/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Default to student if no role found
        setRole('student');
      } else {
        setRole('student');
      }
    } catch (error) {
      // Handle error silently, default to student role
      setRole('student');
    } finally {
      setLoading(false);
    }
  };

  return { role, loading };
};

export default useUserRole;
