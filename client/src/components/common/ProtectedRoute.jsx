/**
 * Protected Route Component
 * 3-Tier Platform: Role-based route protection
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import useUserRole from '../../hooks/useUserRole';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';

const ProtectedRoute = ({ children, allowedRoles = ['student', 'teacher', 'master_admin'] }) => {
  const location = useLocation();
  const { user, isLoaded } = useUserSafe();
  const { role, loading: roleLoading } = useUserRole();
  const { getToken } = useContext(AppContext);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuthorization();
  }, [user, role, isLoaded, roleLoading]);

  const checkAuthorization = async () => {
    // Wait for Clerk and role to load
    if (!isLoaded || roleLoading) {
      return;
    }

    // Check if user is authenticated
    const token = await getToken();
    if (!token || !user) {
      setAuthorized(false);
      setChecking(false);
      return;
    }

    // Check if user has required role
    if (allowedRoles.includes(role)) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }

    setChecking(false);
  };

  if (checking || roleLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    // Redirect based on role
    if (role === 'master_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
