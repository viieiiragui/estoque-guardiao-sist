
import React from 'react';
import { Navigate } from 'react-router-dom';

// Este componente simplesmente redireciona para o dashboard
const Index = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Index;
