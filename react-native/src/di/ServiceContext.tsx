import React, { createContext, useContext, useMemo } from 'react';
import { ServiceContainer } from './ServiceContainer';

/**
 * Context para injeção de dependência via React tree.
 *
 * Permite que qualquer componente acesse os serviços sem prop drilling.
 * O container é fornecido uma única vez no topo da árvore e consumido
 * via hook `useServices()`.
 *
 * Vantagens sobre importação direta do singleton:
 * - Testabilidade: permite injetar mocks via Provider em testes
 * - Explicitude: dependências ficam visíveis na árvore de componentes
 * - Consistência: padrão idiomático do React para DI
 */
const ServiceContext = createContext<ServiceContainer | null>(null);

interface ServiceProviderProps {
  container: ServiceContainer;
  children: React.ReactNode;
}

export function ServiceProvider({ container, children }: ServiceProviderProps) {
  // Memoiza o valor para evitar re-renders desnecessários
  const value = useMemo(() => container, [container]);

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
}

/**
 * Hook para acessar o container de serviços.
 *
 * @throws Error se usado fora do ServiceProvider (fail-fast para erros de configuração)
 */
export function useServices(): ServiceContainer {
  const context = useContext(ServiceContext);

  if (!context) {
    throw new Error(
      'useServices deve ser utilizado dentro de um <ServiceProvider>. ' +
      'Verifique se o App está envolvido pelo provider.'
    );
  }

  return context;
}

