import React, { useState } from 'react';
import { Card, Input, Button, Alert, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

const { Title, Text } = Typography;

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage(null);
      setIsSubmitting(true);
      const res = await authService.login(data);
      const tokens = res.tokens || {
        accessToken: (res as any).accessToken,
        refreshToken: (res as any).refreshToken,
      };
      login(tokens, res.user);

      // Redirect to the originally intended path or root
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errRes = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMessage(errRes || (err as Error)?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sharon-cream flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8 reveal-down is-visible">
          <img
            src="/Sharon_logo.jpg"
            alt="Sharon Logo"
            className="w-16 h-16 rounded-full object-cover mx-auto mb-3 shadow-md border-2 border-amber-900/20"
          />
          <h1 className="text-3xl font-bold font-display text-sharon-primary m-0">
            Sharon Tea and Coffee
          </h1>
          <Text className="text-sm text-gray-500 font-sans block mt-1">
            Official Management Portal
          </Text>
        </div>

        {/* Login Card */}
        <Card
          bordered={false}
          className="shadow-xl rounded-2xl bg-white border border-amber-950/10 p-2 sm:p-4 reveal-scale is-visible delay-50"
        >
          <div className="mb-6 text-center">
            <Title level={4} className="m-0 font-sans font-bold text-gray-800">
              Admin Login
            </Title>
            <Text className="text-xs text-gray-500">
              Enter your credentials to access the admin console
            </Text>
          </div>

          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              className="mb-5 rounded-lg border-red-200"
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="admin@novacodex.in"
                    prefix={<MailOutlined className="text-gray-400 mr-1" />}
                    status={errors.email ? 'error' : ''}
                    disabled={isSubmitting}
                    className="rounded-lg"
                  />
                )}
              />
              {errors.email && (
                <span className="text-xs text-red-600 mt-1 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    placeholder="••••••••"
                    prefix={<LockOutlined className="text-gray-400 mr-1" />}
                    status={errors.password ? 'error' : ''}
                    disabled={isSubmitting}
                    className="rounded-lg"
                  />
                )}
              />
              {errors.password && (
                <span className="text-xs text-red-600 mt-1 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isSubmitting}
                block
                className="bg-sharon-forest hover:bg-emerald-800 h-11 text-base font-medium rounded-lg border-none shadow-md button-interaction hover-lift"
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-100 pt-4 space-y-1">
            <div>Authorized personnel only • Sharon Tea and Coffee Pvt Ltd</div>
            <div>
              Design &amp; Developed by{' '}
              <a
                href="https://novacodex.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sharon-burgundy hover:underline font-semibold"
              >
                Novacodex
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
