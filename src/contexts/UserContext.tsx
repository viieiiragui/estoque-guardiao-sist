
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from './AuthContext';
import { toast } from "sonner";

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUser: (id: string) => User | undefined;
}

// Mock inicial de usuários
const initialUsers: User[] = [
  { id: '1', name: 'Admin', email: 'admin@exemplo.com', role: 'admin' },
  { id: '2', name: 'Operador', email: 'operador@exemplo.com', role: 'operador' },
  { id: '3', name: 'Visualizador', email: 'visualizador@exemplo.com', role: 'visualizador' },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserManagement = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserManagement deve ser usado dentro de um UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
    };

    // Verificar se o e-mail já existe
    if (users.some(u => u.email === user.email)) {
      toast.error("E-mail já cadastrado!");
      return;
    }

    setUsers((prev) => [...prev, newUser]);
    toast.success(`Usuário ${user.name} adicionado com sucesso!`);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          return { ...user, ...updates };
        }
        return user;
      })
    );
    toast.success("Usuário atualizado com sucesso!");
  };

  const deleteUser = (id: string) => {
    const userName = users.find(u => u.id === id)?.name;
    setUsers((prev) => prev.filter((user) => user.id !== id));
    toast.success(`Usuário ${userName || ''} removido com sucesso!`);
  };

  const getUser = (id: string) => {
    return users.find((user) => user.id === id);
  };

  const value = {
    users,
    addUser,
    updateUser,
    deleteUser,
    getUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
