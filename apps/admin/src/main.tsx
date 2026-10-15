import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntdApp } from 'antd';
import App from './app/App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3, // 3 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element in Sharon Admin index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1C4C34',
          colorError: '#541424',
          colorBgLayout: '#FAF7F2',
          borderRadius: 8,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        components: {
          Button: {
            controlHeight: 38,
            borderRadius: 8,
            primaryColor: '#FAF7F2',
          },
          Table: {
            headerBg: '#F3ECE2',
            headerColor: '#241C24',
            borderRadius: 10,
          },
          Card: {
            borderRadiusLG: 12,
          },
          Menu: {
            itemSelectedBg: '#E8F3ED',
            itemSelectedColor: '#1C4C34',
            itemHoverBg: '#F5FAF7',
            itemBorderRadius: 8,
          },
        },
      }}
    >
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>
);
