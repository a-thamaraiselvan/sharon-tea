import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  CoffeeOutlined,
  ShoppingOutlined,
  MessageOutlined,
  TeamOutlined,
  MailOutlined,
  EnvironmentOutlined,
  PictureOutlined,
  DesktopOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>['items'][number];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/') return ['/'];
    if (path.startsWith('/menu-categories')) return ['/menu-categories'];
    if (path.startsWith('/menu-items')) return ['/menu-items'];
    if (path.startsWith('/products')) return ['/products'];
    if (path.startsWith('/whatsapp-analytics')) return ['/whatsapp-analytics'];
    if (path.startsWith('/franchise-enquiries')) return ['/franchise-enquiries'];
    if (path.startsWith('/contact-enquiries')) return ['/contact-enquiries'];
    if (path.startsWith('/outlets')) return ['/outlets'];
    if (path.startsWith('/gallery')) return ['/gallery'];
    if (path.startsWith('/hero-slides')) return ['/hero-slides'];
    if (path.startsWith('/settings')) return ['/settings'];
    return [path];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/menu-categories') || path.startsWith('/menu-items')) {
      return ['menu-sub'];
    }
    return [];
  };

  const menuItems: MenuItem[] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'menu-sub',
      icon: <CoffeeOutlined />,
      label: 'Menu Management',
      children: [
        {
          key: '/menu-categories',
          icon: <AppstoreOutlined />,
          label: 'Categories',
        },
        {
          key: '/menu-items',
          icon: <CoffeeOutlined />,
          label: 'Items',
        },
      ],
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: 'Packaged Products',
    },
    {
      key: '/whatsapp-analytics',
      icon: <MessageOutlined />,
      label: 'WhatsApp Analytics',
    },
    {
      key: '/franchise-enquiries',
      icon: <TeamOutlined />,
      label: 'Franchise Enquiries',
    },
    {
      key: '/contact-enquiries',
      icon: <MailOutlined />,
      label: 'Contact Enquiries',
    },
    {
      key: '/outlets',
      icon: <EnvironmentOutlined />,
      label: 'Outlets',
    },
    {
      key: '/gallery',
      icon: <PictureOutlined />,
      label: 'Gallery',
    },
    {
      key: '/hero-slides',
      icon: <DesktopOutlined />,
      label: 'Hero Slides',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={null}
      breakpoint="lg"
      width={260}
      theme="light"
      className="border-r border-amber-950/10 h-screen select-none sticky top-0 z-20 flex flex-col shrink-0 sidebar-transition"
      style={{
        backgroundColor: '#FFFFFF',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div className="h-16 flex items-center px-4 border-b border-amber-950/10 gap-3 overflow-hidden shrink-0">
        <img
          src="/Sharon_logo.jpg"
          alt="Sharon Logo"
          className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm border border-amber-950/15"
        />
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-display font-bold text-base text-sharon-primary truncate tracking-wide">
              Sharon Tea Stall
            </span>
            <span className="text-[11px] uppercase tracking-wider text-sharon-forest font-semibold">
              Admin Portal
            </span>
          </div>
        )}
      </div>

      <div className="py-2 flex-1 overflow-y-auto overflow-x-hidden">
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={({ key }) => {
            if (key !== 'menu-sub') {
              navigate(key);
            }
          }}
          className="border-r-0 font-medium text-sm"
          style={{
            backgroundColor: 'transparent',
          }}
        />
      </div>
    </Sider>
  );
};
