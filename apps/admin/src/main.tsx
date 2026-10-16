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
          colorPrimary: '#1C4C34',       // Secondary: Forest Green
          colorSuccess: '#34A43C',       // Secondary: Fresh Leaf Green
          colorWarning: '#FC9C34',       // Tertiary: Amber Highlight
          colorError: '#7C2C0C',         // Tertiary: Deep Rust Brown
          colorTextBase: '#241C24',      // Primary: Soft Off-Black
          colorBgBase: '#FFFFFF',        // Neutral: White
          colorBgLayout: '#FAF7F2',      // Warm Cream Layout
          colorBorder: '#D4D4D4',        // Neutral: Light Grey
          borderRadius: 8,
          fontFamily: '"SoDo Sans", Inter, system-ui, sans-serif',
        },
        components: {
          Button: {
            controlHeight: 38,
            borderRadius: 8,
            primaryColor: '#FFFFFF',
          },
          Table: {
            headerBg: '#FFFFFF',
            headerColor: '#241C24',
            borderRadius: 10,
          },
          Card: {
            borderRadiusLG: 12,
          },
          Menu: {
            itemSelectedBg: '#1C4C34',
            itemSelectedColor: '#FFFFFF',
            itemHoverBg: 'rgba(28, 76, 52, 0.1)',
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
