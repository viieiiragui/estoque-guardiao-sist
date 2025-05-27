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

export const QuantityDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  product: Product | null;
  operation: 'add' | 'remove';
}> = ({ isOpen, onClose, onConfirm, product, operation }) => {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(operation === 'add' ? quantity : -quantity);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {operation === 'add' ? 'Adicionar' : 'Remover'} ao Estoque
          </DialogTitle>
          <DialogDescription>
            {operation === 'add'
              ? 'Adicione unidades deste produto ao estoque.'
              : 'Remova unidades deste produto do estoque.'}
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

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={operation === 'add' ? 'default' : 'destructive'}
            >
              {operation === 'add' ? 'Adicionar' : 'Remover'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
