/* eslint-disable react-refresh/only-export-components */
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
  token: string | null;
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
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      return storedToken;
    }

    return null;
  });

  // Recuperar usuário do localStorage ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      setCurrentUser(data.user);
      setToken(data.access_token);
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
    setToken(null);
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

  const value = {
    currentUser,
    token,
    isAuthenticated: !!currentUser,
    login,
    logout,
    checkPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
