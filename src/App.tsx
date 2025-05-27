
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { UserProvider } from "./contexts/UserContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import Usuarios from "./pages/Usuarios";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

// Componente para proteger rotas
const ProtectedRoute = ({ 
  children, 
  requiredRole = 'viewer' 
}: { 
  children: JSX.Element, 
  requiredRole?: 'viewer' | 'operator' | 'admin' 
}) => {
  const { isAuthenticated, checkPermission } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!checkPermission(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Componente para redirecionar usuários já autenticados
const RedirectIfAuthenticated = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route 
      path="/login" 
      element={
        <RedirectIfAuthenticated>
          <Login />
        </RedirectIfAuthenticated>
      } 
    />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/produtos" 
      element={
        <ProtectedRoute>
          <Produtos />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/usuarios" 
      element={
        <ProtectedRoute requiredRole="admin">
          <Usuarios />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/configuracoes" 
      element={
        <ProtectedRoute>
          <Configuracoes />
        </ProtectedRoute>
      } 
    />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-right" />
      <AuthProvider>
        <InventoryProvider>
          <UserProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </UserProvider>
        </InventoryProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
