import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/configureStore';

interface ProtectedRouteProps {
  requiredProfile?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredProfile }) => {
  const { isAuthenticated, user } = useAppSelector(state => state.account);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredProfile && user?.perfil_asignado !== requiredProfile) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;