
import React, { ReactNode } from 'react';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface PermissionGateProps {
  requiredRole: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  requiredRole,
  children,
  fallback,
}) => {
  const { checkPermission } = useAuth();

  if (checkPermission(requiredRole)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
};

export default PermissionGate;
