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
  RocketOutlined,
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
    if (path.startsWith('/product-categories')) return ['/product-categories'];
    if (path.startsWith('/products')) return ['/products'];
    if (path.startsWith('/whatsapp-analytics')) return ['/whatsapp-analytics'];
    if (path.startsWith('/franchise-enquiries')) return ['/franchise-enquiries'];
    if (path.startsWith('/contact-enquiries')) return ['/contact-enquiries'];
    if (path.startsWith('/outlets')) return ['/outlets'];
    if (path.startsWith('/gallery')) return ['/gallery'];
    if (path.startsWith('/hero-slides')) return ['/hero-slides'];
    if (path.startsWith('/delivery-partners')) return ['/delivery-partners'];
    if (path.startsWith('/settings')) return ['/settings'];
    return [path];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    const keys: string[] = [];
    if (path.startsWith('/menu-categories') || path.startsWith('/menu-items')) {
      keys.push('menu-sub');
    }
    if (path.startsWith('/product-categories') || path.startsWith('/products')) {
      keys.push('products-sub');
    }
    return keys;
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
      label: 'Beverage Menu',
      children: [
        {
          key: '/menu-categories',
          icon: <AppstoreOutlined />,
          label: 'Menu Categories',
        },
        {
          key: '/menu-items',
          icon: <CoffeeOutlined />,
          label: 'Menu Items',
        },
      ],
    },
    {
      key: 'products-sub',
      icon: <ShoppingOutlined />,
      label: 'Packaged Products',
      children: [
        {
          key: '/product-categories',
          icon: <AppstoreOutlined />,
          label: 'Product Categories',
        },
        {
          key: '/products',
          icon: <ShoppingOutlined />,
          label: 'Retail Products',
        },
      ],
    },
    {
      key: '/delivery-partners',
      icon: <RocketOutlined />,
      label: 'Delivery Partners',
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
      theme="dark"
      className="border-r border-white/10 h-screen select-none sticky top-0 z-20 flex flex-col shrink-0 sidebar-transition bg-sharon-primary"
      style={{
        backgroundColor: '#241C24',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div className="h-16 flex items-center px-4 border-b border-white/10 gap-3 overflow-hidden shrink-0">
        <img
          src="/Sharon_logo.jpg"
          alt="Sharon Logo"
          className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm border border-sharon-amber/30"
        />
        {!collapsed && (
          <div className="flex flex-col overflow-hidden leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-base text-white tracking-wider">
                SHARON
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-sharon-forest text-white uppercase tracking-wider font-semibold">
                ADMIN
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-sharon-amber">
              TEA &amp; COFFEE
            </span>
          </div>
        )}
      </div>

      <div className="py-2 flex-1 overflow-y-auto overflow-x-hidden">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={({ key }) => {
            if (key !== 'menu-sub' && key !== 'products-sub') {
              navigate(key);
            }
          }}
          className="border-r-0 font-medium text-sm sharon-sidebar-menu"
          style={{
            backgroundColor: '#241C24',
          }}
        />
      </div>
    </Sider>
  );
};
