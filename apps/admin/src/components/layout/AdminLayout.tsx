import React, { useState, Suspense } from 'react';
import { Layout, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AdminNavbar } from './AdminNavbar';

const { Content, Footer } = Layout;

const ContentLoader: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
    <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#1C4C34' }} spin />} />
    <span className="mt-3 text-xs text-neutral-500 font-medium">Loading content...</span>
  </div>
);

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="h-screen overflow-hidden bg-sharon-cream flex flex-row">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="bg-sharon-cream flex flex-col h-screen overflow-y-auto flex-1 min-w-0">
        <AdminNavbar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
        <Content className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          <Suspense fallback={<ContentLoader />}>
            <Outlet />
          </Suspense>
        </Content>
        <Footer className="text-center text-xs text-neutral-500 py-3 bg-transparent shrink-0">
          <span>Sharon Tea and Coffee Admin • Design &amp; Developed by </span>
          <a
            href="https://novacodex.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sharon-burgundy hover:underline font-semibold"
          >
            Novacodex
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
};
