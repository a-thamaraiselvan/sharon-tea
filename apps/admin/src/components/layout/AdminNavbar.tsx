import React from 'react';
import { Layout, Dropdown, Avatar, Typography, Tag, message } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';

const { Header } = Layout;
const { Text } = Typography;

interface AdminNavbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  collapsed,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Continue client logout even if backend failed
    } finally {
      logout();
      message.success('Logged out successfully');
      navigate('/login');
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div className="py-1">
          <div className="font-semibold text-gray-800">{user?.fullName || 'Administrator'}</div>
          <div className="text-xs text-gray-500">{user?.email || 'admin@sharon.com'}</div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-red-500" />,
      danger: true,
      label: 'Sign Out',
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      className="px-6 flex items-center justify-between border-b border-amber-950/10 sticky top-0 z-10"
      style={{
        backgroundColor: '#FFFFFF',
        height: '64px',
        lineHeight: '64px',
      }}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="text-lg p-2 text-gray-600 hover:text-sharon-forest hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent flex items-center button-interaction"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
        <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
          Sharon Brand Management
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
          <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            <Avatar
              size="default"
              icon={<UserOutlined />}
              src={user?.avatarUrl}
              style={{ backgroundColor: '#1C4C34' }}
            />
            <div className="hidden md:flex flex-col text-left leading-tight">
              <Text strong className="text-sm text-sharon-primary">
                {user?.fullName || 'Admin User'}
              </Text>
              <div className="flex items-center gap-1 mt-0.5">
                <Tag color="green" className="text-[10px] m-0 px-1 py-0 leading-tight">
                  {user?.role ? user.role.toUpperCase() : 'ADMIN'}
                </Tag>
              </div>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};
