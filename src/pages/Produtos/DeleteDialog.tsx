import React, { useState } from 'react';

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

export const DeleteDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
}> = ({ isOpen, onClose, onConfirm, product }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remover Produto do Estoque</DialogTitle>
          <DialogDescription>
            Remova o produto do estoque. Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Código</Label>
            <Input id="product-name" value={product?.code || ''} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-name">Produto</Label>
            <Input id="product-name" value={product?.name || ''} disabled />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive">
              Deletar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
