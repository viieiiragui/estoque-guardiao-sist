
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useInventory, Product } from '../contexts/InventoryContext';
import { useAuth } from '../contexts/AuthContext';
import PermissionGate from '../components/PermissionGate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Trash, ArrowUp, ArrowDown } from 'lucide-react';

const ProductForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Product>;
  isEdit?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData = {}, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    quantity: initialData.quantity || 0,
    price: initialData.price || 0,
    category: initialData.category || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
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
          <DialogTitle>{isEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os detalhes do produto abaixo.'
              : 'Preencha os detalhes para adicionar um novo produto ao estoque.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
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
            <Button type="submit">
              {isEdit ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const QuantityDialog: React.FC<{
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

const Produtos = () => {
  const { products, addProduct, updateProduct, deleteProduct, updateQuantity } = useInventory();
  const { checkPermission } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityOperation, setQuantityOperation] = useState<'add' | 'remove'>('add');

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    addProduct(productData);
  };

  const handleEditProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, productData);
    }
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  const handleOpenQuantityDialog = (product: Product, operation: 'add' | 'remove') => {
    setSelectedProduct(product);
    setQuantityOperation(operation);
    setIsQuantityDialogOpen(true);
  };

  const handleQuantityUpdate = (change: number) => {
    if (selectedProduct) {
      updateQuantity(selectedProduct.id, change);
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Produtos</h1>
          <PermissionGate requiredRole="admin">
            <Button onClick={() => setIsAddProductOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </PermissionGate>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar produtos..."
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
                  <th className="px-4 py-3 text-left font-medium">Descrição</th>
                  <th className="px-4 py-3 text-center font-medium">Quantidade</th>
                  <th className="px-4 py-3 text-right font-medium">Preço</th>
                  <th className="px-4 py-3 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">{product.description}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.quantity <= 5
                              ? 'bg-red-100 text-red-800'
                              : product.quantity <= 10
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(product.price)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-1">
                          <PermissionGate requiredRole="operador">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenQuantityDialog(product, 'add')}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                          </PermissionGate>
                          
                          <PermissionGate requiredRole="operador">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenQuantityDialog(product, 'remove')}
                              disabled={product.quantity <= 0}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </PermissionGate>
                          
                          <PermissionGate requiredRole="admin">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </PermissionGate>
                          
                          <PermissionGate requiredRole="admin">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </PermissionGate>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diálogos */}
        <ProductForm
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
          onSubmit={handleAddProduct}
        />

        <ProductForm
          isOpen={isEditProductOpen}
          onClose={() => setIsEditProductOpen(false)}
          onSubmit={handleEditProduct}
          initialData={selectedProduct || {}}
          isEdit
        />

        <QuantityDialog
          isOpen={isQuantityDialogOpen}
          onClose={() => setIsQuantityDialogOpen(false)}
          onConfirm={handleQuantityUpdate}
          product={selectedProduct}
          operation={quantityOperation}
        />
      </div>
    </Layout>
  );
};

export default Produtos;
