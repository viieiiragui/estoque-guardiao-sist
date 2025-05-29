/* eslint-disable react-refresh/only-export-components */
import { httpClient } from '@/services/httpClient';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';

// Definindo os tipos de usuários
export type UserPermission = 'viewer' | 'operator' | 'admin';

export interface User {
  email: string;
  id: number;
  name: string;
  permission: UserPermission;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (requiredRole: UserPermission) => boolean;
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider do contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    return null;
  });

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await httpClient.post<{
        user: User;
        access_token: string;
      }>('/login', {
        email,
        password,
      });

      setCurrentUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.access_token);
      toast.success(`Bem-vindo, ${data.user.name}!`);
      return true;
    } catch (error) {
      toast.error('E-mail ou senha incorretos.');
      return false;
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  // Verificar permissões baseado em hierarquia de papéis
  const checkPermission = (requiredRole: UserPermission): boolean => {
    if (!currentUser) return false;

    const roleHierarchy: Record<UserPermission, number> = {
      viewer: 1,
      operator: 2,
      admin: 3,
    };

    const userRoleLevel = roleHierarchy[currentUser.permission];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    return userRoleLevel >= requiredRoleLevel;
  };

  // Recuperar usuário do localStorage ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Adicionar listener para logout global
  useEffect(() => {
    const handleLogout = () => {
      logout();
      toast.error('Seu token expirou, você foi desconectado.');
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    checkPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
