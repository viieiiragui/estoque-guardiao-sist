import { ArrowDown, ArrowUp, Edit, Plus, Search, Trash } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '../../components/Layout';
import PermissionGate from '../../components/PermissionGate';
import { Product, useInventory } from '../../contexts/InventoryContext';
import { DeleteDialog } from './DeleteDialog';
import { ProductForm } from './ProductForm';
import { QuantityDialog } from './QuantityDialog';

const Produtos = () => {
  const {
    products,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateQuantity,
  } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityOperation, setQuantityOperation] = useState<'add' | 'remove'>(
    'add'
  );

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    addProduct(productData);
  };

  const handleEditProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, productData);
    }
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  const handleOpenQuantityDialog = (
    product: Product,
    operation: 'add' | 'remove'
  ) => {
    setSelectedProduct(product);
    setQuantityOperation(operation);
    setIsQuantityDialogOpen(true);
  };

  const handleQuantityUpdate = (change: number) => {
    if (selectedProduct) {
      updateQuantity(selectedProduct.id, change);
    }
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
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
                  <th className="px-4 py-3 text-left font-medium">Código</th>
                  <th className="px-4 py-3 text-left font-medium">Nome</th>
                  <th className="px-4 py-3 text-center font-medium">
                    Quantidade
                  </th>
                  <th className="px-4 py-3 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-3">{product.code}</td>
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3 text-center">
                        {product.current_stock}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-1">
                          <PermissionGate requiredRole="operator">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleOpenQuantityDialog(product, 'add')
                              }
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                          </PermissionGate>

                          <PermissionGate requiredRole="operator">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleOpenQuantityDialog(product, 'remove')
                              }
                              disabled={product.current_stock <= 0}
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
                              onClick={() => handleOpenDeleteDialog(product)}
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

        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteProduct}
          product={selectedProduct}
        />
      </div>
    </Layout>
  );
};

export default Produtos;
