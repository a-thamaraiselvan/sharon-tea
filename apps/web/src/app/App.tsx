import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { CartProvider } from '@/contexts/CartContext';
import { AppRoutes } from './routes/AppRoutes';
import { initGlobalScrollReveal } from '@/hooks/useScrollReveal';

export const App: React.FC = () => {
  useEffect(() => {
    return initGlobalScrollReveal();
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#541424',
          colorSuccess: '#34A43C',
          colorWarning: '#FC9C34',
          colorInfo: '#1C4C34',
          colorTextBase: '#241C24',
          colorBgBase: '#FAF7F2',
          fontFamily: "'Inter', system-ui, sans-serif",
          borderRadius: 12,
        },
      }}
    >
      <ErrorBoundary>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </ErrorBoundary>
    </ConfigProvider>
  );
};

export default App;
