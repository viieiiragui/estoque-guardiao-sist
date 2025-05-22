import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { toast } from 'sonner';

// Definindo os tipos de usuários
export type UserRole = 'visualizador' | 'operador' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  checkPermission: (requiredRole: UserRole) => boolean;
}

// Mock de usuários para exemplo
const mockUsers: User[] = [
  { id: '1', name: 'Admin', email: 'admin@exemplo.com', role: 'admin' },
  {
    id: '2',
    name: 'Operador',
    email: 'operador@exemplo.com',
    role: 'operador',
  },
  {
    id: '3',
    name: 'Visualizador',
    email: 'visualizador@exemplo.com',
    role: 'visualizador',
  },
];

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

  // Login básico com mock de usuários
  const login = (email: string, password: string): boolean => {
    // Em uma aplicação real, aqui seria feita uma chamada para a API
    const user = mockUsers.find((u) => u.email === email);

    if (user && password === '123456') {
      // Senha fixa para exemplo
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success(`Bem-vindo, ${user.name}!`);
      return true;
    }

    toast.error('E-mail ou senha incorretos.');
    return false;
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Verificar permissões baseado em hierarquia de papéis
  const checkPermission = (requiredRole: UserRole): boolean => {
    if (!currentUser) return false;

    const roleHierarchy: Record<UserRole, number> = {
      visualizador: 1,
      operador: 2,
      admin: 3,
    };

    const userRoleLevel = roleHierarchy[currentUser.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];

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
