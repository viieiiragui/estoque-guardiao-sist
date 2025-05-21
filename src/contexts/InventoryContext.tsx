
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateQuantity: (id: string, change: number) => void;
  getProduct: (id: string) => Product | undefined;
}

// Dados iniciais de exemplo
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Notebook Dell Inspiron',
    description: 'Notebook com processador i5, 8GB RAM, 256GB SSD',
    quantity: 15,
    price: 3500,
    category: 'Eletrônicos',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Smartphone Samsung Galaxy',
    description: 'Smartphone com 128GB, 6GB RAM, câmera 48MP',
    quantity: 25,
    price: 1800,
    category: 'Eletrônicos',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Monitor LG 24"',
    description: 'Monitor LED Full HD',
    quantity: 10,
    price: 900,
    category: 'Eletrônicos',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory deve ser usado dentro de um InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProducts((prev) => [...prev, newProduct]);
    toast.success(`Produto ${product.name} adicionado com sucesso!`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          return { ...product, ...updates, updatedAt: new Date() };
        }
        return product;
      })
    );
    toast.success("Produto atualizado com sucesso!");
  };

  const deleteProduct = (id: string) => {
    const productName = products.find(p => p.id === id)?.name;
    setProducts((prev) => prev.filter((product) => product.id !== id));
    toast.success(`Produto ${productName || ''} removido com sucesso!`);
  };

  const updateQuantity = (id: string, change: number) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          const newQuantity = product.quantity + change;
          
          if (newQuantity < 0) {
            toast.error("Quantidade não pode ser menor que zero!");
            return product;
          }
          
          toast.success(`Quantidade atualizada: ${product.name} ${change > 0 ? '+' : ''}${change}`);
          return { ...product, quantity: newQuantity, updatedAt: new Date() };
        }
        return product;
      })
    );
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateQuantity,
    getProduct,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};
