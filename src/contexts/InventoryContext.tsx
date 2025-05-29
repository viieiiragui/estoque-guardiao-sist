/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';

import { httpClient } from '@/services/httpClient';
import { useAuth } from './AuthContext';

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  current_stock: number;
  createdAt: Date;
  updatedAt: Date;
}

interface InventoryContextType {
  products: Product[];
  isLoading: boolean;
  loadProducts: () => Promise<void>;
  addProduct: (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateQuantity: (id: string, change: number) => void;
  getProduct: (id: string) => Product | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error(
      'useInventory deve ser usado dentro de um InventoryProvider'
    );
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      const { data } = await httpClient.get<Product[]>('/product');
      setProducts(data);
    } catch (error) {
      toast.error('Erro ao carregar produtos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProduct = async (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const { data } = await httpClient.post<Product>('/product/create', product);
      setProducts((prevState) => [...prevState, data]);
      toast.success(`Produto ${product.name} adicionado com sucesso!`);
    } catch (error) {
      toast.error('Erro ao cadastrar o produto.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await httpClient.put(`/product/update/${id}`, updates);
      await loadProducts();
      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar o produto.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await httpClient.delete(`/product/delete/${id}`);

      const productName = products.find((p) => p.id === id)?.name;
      toast.success(`Produto ${productName || ''} removido com sucesso!`);

      setProducts((prevState) =>
        prevState.filter((product) => product.id !== id)
      );
    } catch (error) {
      toast.error('Erro ao remover o produto.');
    } finally {
      setIsLoading(false);
    }
  };

  const entryTransaction = async (id: string, quantity: number) => {
    try {
      await httpClient.post('/transactions/entry', {
        product_id: id,
        quantity,
      });

      await loadProducts();
      toast.success('Entrada registrada com sucesso!');
    } catch (error) {
      toast.error(
        'Não foi possível registrar a entrada do produto no estoque.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const exitTransaction = async (id: string, quantity: number) => {
    try {
      await httpClient.post('/transactions/exit', {
        product_id: id,
        quantity,
      });

      await loadProducts();
      toast.success('Saída processada com sucesso!');
    } catch (error) {
      toast.error('Falha ao processar a saída do produto no estoque.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, change: number) => {
    if (change > 0) {
      await entryTransaction(id, change);
    } else if (change < 0) {
      await exitTransaction(id, Math.abs(change));
    }

    await loadProducts();
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated, loadProducts]);

  const value = {
    products,
    isLoading,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateQuantity,
    getProduct,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
