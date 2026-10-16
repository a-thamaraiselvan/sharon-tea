import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AdminNavbar } from './AdminNavbar';

const { Content, Footer } = Layout;

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
          <Outlet />
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
