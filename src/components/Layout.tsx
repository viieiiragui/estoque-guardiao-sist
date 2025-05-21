
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, LogOut, Home, Package, Users, Settings } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, checkPermission } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white">
        <div className="p-4 h-16 flex items-center border-b border-slate-700">
          <h1 className="text-xl font-bold">Controle de Estoque</h1>
        </div>
        <div className="p-4">
          <div className="mb-6">
            <p className="text-sm text-slate-300">Bem vindo,</p>
            <p className="font-medium">{currentUser?.name}</p>
            <span className="text-xs px-2 py-1 bg-slate-700 rounded-full">
              {currentUser?.role}
            </span>
          </div>

          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive('/dashboard')
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Link>

            <Link
              to="/produtos"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive('/produtos')
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Package className="mr-3 h-4 w-4" />
              Produtos
            </Link>

            {checkPermission('admin') && (
              <Link
                to="/usuarios"
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive('/usuarios')
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Users className="mr-3 h-4 w-4" />
                Usuários
              </Link>
            )}

            <Link
              to="/configuracoes"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive('/configuracoes')
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Settings className="mr-3 h-4 w-4" />
              Configurações
            </Link>
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 p-4 w-64">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
