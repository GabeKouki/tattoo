import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from './SessionContext';

const ProtectedRoute = ({ children }) => {
  const { session } = useSession();

  if (!session) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
