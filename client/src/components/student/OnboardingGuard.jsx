/**
 * Onboarding Guard Component
 * Checks if student has completed onboarding and redirects if not
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';

const OnboardingGuard = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const token = await getToken();
      
      if (!token) {
        // Preview mode - allow access
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
        // For now, we'll check if learning path exists
        // In production, add onboardingCompleted field to user model
        
        // If no learning path data, redirect to onboarding
        if (!data.dashboard?.learningPath) {
          navigate('/onboarding');
          return;
        }
      }
    } catch (error) {
      // On error, allow access (fail gracefully)
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default OnboardingGuard;
