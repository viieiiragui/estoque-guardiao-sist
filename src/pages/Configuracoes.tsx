
import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Configuracoes = () => {
  const { currentUser } = useAuth();

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Suas informações de usuário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                <p>{currentUser?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{currentUser?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Função</h3>
                <p className="capitalize">{currentUser?.role}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sobre o Sistema</CardTitle>
              <CardDescription>Informações sobre o controle de estoque</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Versão</h3>
                <p>1.0.0</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Último acesso</h3>
                <p>{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Configuracoes;
