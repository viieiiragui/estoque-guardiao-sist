
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useUserManagement } from '../contexts/UserContext';
import { User, UserRole } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash } from 'lucide-react';

const UserForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, 'id'>) => void;
  initialData?: Partial<User>;
  isEdit?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData = {}, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    role: initialData.role || 'visualizador' as UserRole,
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Omit password if empty on edit
    const dataToSubmit = isEdit && !formData.password
      ? { name: formData.name, email: formData.email, role: formData.role }
      : formData;
      
    onSubmit(dataToSubmit as Omit<User, 'id'>);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os detalhes do usuário abaixo.'
              : 'Preencha os detalhes para adicionar um novo usuário ao sistema.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isEdit} // Não permitir edição de email em edição
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visualizador">Visualizador</SelectItem>
                <SelectItem value="operador">Operador</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              {isEdit ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha'}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEdit ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Usuarios = () => {
  const { users, addUser, updateUser, deleteUser } = useUserManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const roleBadgeColors: Record<UserRole, string> = {
    admin: 'bg-purple-100 text-purple-800',
    operador: 'bg-blue-100 text-blue-800',
    visualizador: 'bg-green-100 text-green-800',
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Usuários</h1>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="bg-white rounded-md shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left font-medium">Nome</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Função</th>
                  <th className="px-4 py-3 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={roleBadgeColors[user.role]}>
                          {user.role === 'admin'
                            ? 'Administrador'
                            : user.role === 'operador'
                            ? 'Operador'
                            : 'Visualizador'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteUser(user.id)}
                            disabled={users.length <= 1} // Impedir excluir último usuário
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diálogos */}
        <UserForm
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          onSubmit={addUser}
        />

        <UserForm
          isOpen={isEditUserOpen}
          onClose={() => setIsEditUserOpen(false)}
          onSubmit={(userData) => updateUser(selectedUser?.id || '', userData)}
          initialData={selectedUser || {}}
          isEdit
        />
      </div>
    </Layout>
  );
};

export default Usuarios;
