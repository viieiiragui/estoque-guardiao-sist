import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { toast } from 'sonner';

// Definindo os tipos de usuários
export type UserPermission = 'visualizador' | 'operador' | 'admin';

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

  // Recuperar usuário do localStorage ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
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
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      toast.success(`Bem-vindo, ${data.user.name}!`);
      return true;
    } catch (error) {
      console.log('Erro login:', error);

      toast.error('E-mail ou senha incorretos.');
      return false;
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Verificar permissões baseado em hierarquia de papéis
  const checkPermission = (requiredRole: UserPermission): boolean => {
    if (!currentUser) return false;

    const roleHierarchy: Record<UserPermission, number> = {
      visualizador: 1,
      operador: 2,
      admin: 3,
    };

    const userRoleLevel = roleHierarchy[currentUser.permission];
    console.log('🚀 ~ userRoleLevel:', userRoleLevel);
    const requiredRoleLevel = roleHierarchy[requiredRole];
    console.log('🚀 ~ requiredRoleLevel:', requiredRoleLevel);

    return userRoleLevel >= requiredRoleLevel;
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    checkPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
