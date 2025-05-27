import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product } from '../../contexts/InventoryContext';

export const ProductForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Product>;
  isEdit?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData = {}, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    current_stock: 0,
    category: '',
  });

  useEffect(() => {
    if (isOpen && isEdit && initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        current_stock: initialData.current_stock || 0,
        category: initialData.category || '',
      });
    }
  }, [isOpen, isEdit, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'current_stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os detalhes do produto abaixo.'
              : 'Preencha os detalhes para adicionar um novo produto ao estoque.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_stock">Quantidade</Label>
            <Input
              id="current_stock"
              name="current_stock"
              type="number"
              min="0"
              value={formData.current_stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{isEdit ? 'Atualizar' : 'Adicionar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
