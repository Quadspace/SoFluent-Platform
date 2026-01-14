/**
 * useOnboardingCheck Hook
 * Checks if student has completed onboarding and redirects if not
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserSafe } from './useClerkSafe.jsx';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

export const useOnboardingCheck = () => {
  const navigate = useNavigate();
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  const [checking, setChecking] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      const token = await getToken();
      
      if (!token || !user) {
        // Preview mode or no user - allow access
        setChecking(false);
        return;
      }

      // Check if user has completed onboarding
      const response = await fetch(`${backendUrl}/api/student/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if onboarding is completed
        // We'll check if learning path exists and has proper data
        if (data.dashboard?.learningPath?.name && 
            data.dashboard?.learningPath?.currentWeek) {
          setOnboardingCompleted(true);
        } else {
          // No learning path = onboarding not completed
          setOnboardingCompleted(false);
          // Only redirect if not already on onboarding page
          if (window.location.pathname !== '/onboarding') {
            navigate('/onboarding');
          }
        }
      } else {
        // On error, check user model directly
        const userResponse = await fetch(`${backendUrl}/api/user/data`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.user?.onboardingCompleted) {
            setOnboardingCompleted(true);
          } else {
            setOnboardingCompleted(false);
            if (window.location.pathname !== '/onboarding') {
              navigate('/onboarding');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
      // On error, allow access (fail gracefully)
      setOnboardingCompleted(true);
    } finally {
      setChecking(false);
    }
  };

  return { checking, onboardingCompleted };
};
