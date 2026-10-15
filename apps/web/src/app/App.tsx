import React from 'react';
import { ConfigProvider } from 'antd';
import { AOSProvider } from '@/components/common/AOSProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
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
        <AOSProvider>
          <AppRoutes />
        </AOSProvider>
      </ErrorBoundary>
    </ConfigProvider>
  );
};

export default App;
