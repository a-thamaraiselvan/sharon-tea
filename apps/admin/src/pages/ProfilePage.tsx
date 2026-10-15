import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Avatar,
  Tag,
  Descriptions,
  message,
  Typography,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/shared/PageHeader';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

const { Text } = Typography;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [isChanging, setIsChanging] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsChanging(true);
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      message.success('Password updated successfully');
      reset();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to change password. Verify your current password.');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div>
      <div>
        <PageHeader
          title="Admin Profile & Security"
          subtitle="Manage personal access credentials and administrative privileges."
        />
      </div>

      <div>
        <Row gutter={[24, 24]}>
        {/* Profile Card */}
        <Col xs={24} md={10}>
          <div className="reveal-up is-visible delay-0">
            <Card className="rounded-xl border-amber-950/10 shadow-sm text-center p-6 bg-white hover-lift">
              <div className="flex justify-center mb-4">
                <Avatar
                  size={88}
                  icon={<UserOutlined />}
                  src={user?.avatarUrl}
                  style={{ backgroundColor: '#1C4C34' }}
                  className="shadow-md"
                />
              </div>
              <h2 className="text-xl font-bold font-display text-sharon-primary m-0">
                {user?.fullName || 'System Administrator'}
              </h2>
              <Text className="text-xs text-gray-500 block mt-1">{user?.email || 'admin@sharon.com'}</Text>
              <div className="mt-3">
                <Tag color="green" className="font-semibold px-3 py-0.5 rounded-full uppercase text-xs">
                  {user?.role || 'ADMIN'}
                </Tag>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4 text-left">
                <Descriptions size="small" column={1} className="text-xs">
                  <Descriptions.Item label="Account Type">Super Administrator</Descriptions.Item>
                  <Descriptions.Item label="Privileges">Full Database Access</Descriptions.Item>
                  <Descriptions.Item label="Two-Factor Status">
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <CheckCircleOutlined /> Active Session
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Card>
          </div>
        </Col>

        {/* Change Password Card */}
        <Col xs={24} md={14}>
          <div className="reveal-up is-visible delay-50">
            <Card
              title={
                <div className="flex items-center gap-2">
                  <LockOutlined className="text-sharon-forest" />
                  <span className="font-semibold text-gray-800">Change Password</span>
                </div>
              }
              className="rounded-xl border-amber-950/10 shadow-sm bg-white"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="currentPassword"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Enter current password"
                        prefix={<KeyOutlined className="text-gray-400 mr-1" />}
                        status={errors.currentPassword ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.currentPassword && (
                    <span className="text-xs text-red-500 mt-1 block">
                      {errors.currentPassword.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Minimum 8 characters with numbers and letters"
                        prefix={<LockOutlined className="text-gray-400 mr-1" />}
                        status={errors.newPassword ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.newPassword && (
                    <span className="text-xs text-red-500 mt-1 block">
                      {errors.newPassword.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Re-enter new password"
                        prefix={<SafetyCertificateOutlined className="text-gray-400 mr-1" />}
                        status={errors.confirmPassword ? 'error' : ''}
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <span className="text-xs text-red-500 mt-1 block">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isChanging}
                    className="bg-sharon-forest hover:bg-emerald-800 font-medium px-6 h-10 button-interaction hover-lift"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </Col>
      </Row>
      </div>
    </div>
  );
};
