import React, { useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Switch,
  Row,
  Col,
  message,
  Skeleton,
} from 'antd';
import {
  SaveOutlined,
  WhatsAppOutlined,
  GlobalOutlined,
  ShopOutlined,
  NotificationOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/shared/PageHeader';
import { businessSettingsService } from '../services/businessSettingsService';
import { UpdateBusinessSettingsInput } from '../types';

const { TextArea } = Input;

const settingsSchema = z.object({
  brandName: z.string().min(2, 'Brand name is required'),
  tagline: z.string().min(2, 'Tagline is required'),
  description: z.string().min(10, 'Description should be descriptive'),
  phone: z.string().min(8, 'Phone number is required'),
  email: z.string().email('Valid email is required'),
  whatsappNumber: z.string().min(10, 'Valid WhatsApp phone number with country code is required'),
  address: z.string().min(5, 'Headquarters address is required'),
  operatingHours: z.string().min(3, 'Operating hours required'),
  fssaiLicense: z.string().min(5, 'FSSAI License is required'),
  socialLinks: z.object({
    facebook: z.string().optional().nullable(),
    instagram: z.string().optional().nullable(),
    youtube: z.string().optional().nullable(),
    twitter: z.string().optional().nullable(),
  }),
  announcement: z.object({
    text: z.string().optional().nullable(),
    isActive: z.boolean().default(false),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['businessSettings'],
    queryFn: () => businessSettingsService.get(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      brandName: 'Sharon Tea and Coffee',
      tagline: 'Authenticity Steeped in Tradition',
      description: 'Serving premium authentic Irani Chai, artisanal blends, and traditional snacks.',
      phone: '+91 98400 12345',
      email: 'contact@sharonteastall.com',
      whatsappNumber: '919840012345',
      address: 'No. 45, Grand Trunk Road, Chennai, Tamil Nadu 600001',
      operatingHours: '5:30 AM - 11:30 PM Daily',
      fssaiLicense: '12421008000412',
      socialLinks: {
        facebook: 'https://facebook.com/sharonteastall',
        instagram: 'https://instagram.com/sharonteastall',
        youtube: 'https://youtube.com/@sharonteastall',
        twitter: 'https://twitter.com/sharontea',
      },
      announcement: {
        text: 'New Sharon Express Outlet Opening Soon in T. Nagar!',
        isActive: true,
      },
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        brandName: settings.brandName || 'Sharon Tea and Coffee',
        tagline: settings.tagline || '',
        description: settings.description || '',
        phone: settings.phone || '',
        email: settings.email || '',
        whatsappNumber: settings.whatsappNumber || '',
        address: settings.address || '',
        operatingHours: settings.operatingHours || '',
        fssaiLicense: settings.fssaiLicense || '',
        socialLinks: {
          facebook: settings.socialLinks?.facebook || '',
          instagram: settings.socialLinks?.instagram || '',
          youtube: settings.socialLinks?.youtube || '',
          twitter: settings.socialLinks?.twitter || '',
        },
        announcement: {
          text: settings.announcement?.text || '',
          isActive: settings.announcement?.isActive ?? false,
        },
      });
    }
  }, [settings, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateBusinessSettingsInput) => businessSettingsService.update(data),
    onSuccess: () => {
      message.success('Business settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['businessSettings'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update settings');
    },
  });

  const onSubmit = (formData: SettingsFormData) => {
    updateMutation.mutate({
      brandName: formData.brandName,
      tagline: formData.tagline,
      description: formData.description,
      phone: formData.phone,
      email: formData.email,
      whatsappNumber: formData.whatsappNumber,
      address: formData.address,
      operatingHours: formData.operatingHours,
      fssaiLicense: formData.fssaiLicense,
      socialLinks: {
        facebook: formData.socialLinks.facebook || undefined,
        instagram: formData.socialLinks.instagram || undefined,
        youtube: formData.socialLinks.youtube || undefined,
        twitter: formData.socialLinks.twitter || undefined,
      },
      announcement: {
        text: formData.announcement.text || '',
        isActive: formData.announcement.isActive,
      },
    });
  };

  return (
    <div>
      <div>
        <PageHeader
          title="Business & Brand Settings"
          subtitle="Manage brand identity, contact points, WhatsApp order receiver, and live announcements."
        />
      </div>

      <div>
        {isLoading ? (
          <Card className="rounded-xl p-6 bg-white border-amber-950/10">
            <Skeleton active paragraph={{ rows: 12 }} />
          </Card>
        ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 reveal-up is-visible delay-50">
          {/* Brand Information */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <ShopOutlined className="text-sharon-forest" />
                <span className="font-semibold text-gray-800">Brand Identity</span>
              </div>
            }
            className="rounded-xl border-amber-950/10 shadow-sm"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="brandName"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} status={errors.brandName ? 'error' : ''} />
                  )}
                />
                {errors.brandName && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.brandName.message}
                  </span>
                )}
              </Col>

              <Col xs={24} md={12}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Official Tagline <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="tagline"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} status={errors.tagline ? 'error' : ''} />
                  )}
                />
                {errors.tagline && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.tagline.message}
                  </span>
                )}
              </Col>

              <Col xs={24}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Brand Story & About Description <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      rows={3}
                      status={errors.description ? 'error' : ''}
                    />
                  )}
                />
                {errors.description && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.description.message}
                  </span>
                )}
              </Col>
            </Row>
          </Card>

          {/* Contact & WhatsApp Ordering */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <WhatsAppOutlined className="text-green-600" />
                <span className="font-semibold text-gray-800">
                  Contact & WhatsApp Order Channel
                </span>
              </div>
            }
            className="rounded-xl border-amber-950/10 shadow-sm"
          >
            <div className="p-3 mb-4 rounded-lg bg-green-50 border border-green-200 text-xs text-green-900 leading-relaxed">
              <strong>Crucial WhatsApp Setting:</strong> All "Order on WhatsApp" buttons on the
              storefront route directly to this WhatsApp phone number (with country code, no + or
              spaces). Ensure it has an active WhatsApp Business application configured.
            </div>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  WhatsApp Number (with Country Code) <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="whatsappNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      prefix={<WhatsAppOutlined className="text-green-600 mr-1" />}
                      placeholder="919840012345"
                      status={errors.whatsappNumber ? 'error' : ''}
                    />
                  )}
                />
                {errors.whatsappNumber && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.whatsappNumber.message}
                  </span>
                )}
              </Col>

              <Col xs={24} md={8}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Primary Phone <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} status={errors.phone ? 'error' : ''} />
                  )}
                />
                {errors.phone && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.phone.message}</span>
                )}
              </Col>

              <Col xs={24} md={8}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} status={errors.email ? 'error' : ''} />
                  )}
                />
                {errors.email && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>
                )}
              </Col>

              <Col xs={24}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Registered Headquarters Address <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextArea {...field} rows={2} status={errors.address ? 'error' : ''} />
                  )}
                />
                {errors.address && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.address.message}
                  </span>
                )}
              </Col>
            </Row>
          </Card>

          {/* Operations & Compliance */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <SafetyCertificateOutlined className="text-sharon-chai" />
                <span className="font-semibold text-gray-800">Operations & Licensing</span>
              </div>
            }
            className="rounded-xl border-amber-950/10 shadow-sm"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  General Operating Hours <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="operatingHours"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} status={errors.operatingHours ? 'error' : ''} />
                  )}
                />
              </Col>

              <Col xs={24} md={12}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  FSSAI Food License Number <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="fssaiLicense"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} status={errors.fssaiLicense ? 'error' : ''} />
                  )}
                />
                {errors.fssaiLicense && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.fssaiLicense.message}
                  </span>
                )}
              </Col>
            </Row>
          </Card>

          {/* Social Media Links */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <GlobalOutlined className="text-blue-600" />
                <span className="font-semibold text-gray-800">Social Media Channels</span>
              </div>
            }
            className="rounded-xl border-amber-950/10 shadow-sm"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Instagram URL</label>
                <Controller
                  name="socialLinks.instagram"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <Input {...rest} value={value || ''} onChange={onChange} placeholder="https://instagram.com/..." />
                  )}
                />
              </Col>

              <Col xs={24} sm={12}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Facebook URL</label>
                <Controller
                  name="socialLinks.facebook"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <Input {...rest} value={value || ''} onChange={onChange} placeholder="https://facebook.com/..." />
                  )}
                />
              </Col>

              <Col xs={24} sm={12}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">YouTube URL</label>
                <Controller
                  name="socialLinks.youtube"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <Input {...rest} value={value || ''} onChange={onChange} placeholder="https://youtube.com/..." />
                  )}
                />
              </Col>

              <Col xs={24} sm={12}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Twitter / X URL</label>
                <Controller
                  name="socialLinks.twitter"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <Input {...rest} value={value || ''} onChange={onChange} placeholder="https://twitter.com/..." />
                  )}
                />
              </Col>
            </Row>
          </Card>

          {/* Website Announcement Banner */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <NotificationOutlined className="text-rose-600" />
                <span className="font-semibold text-gray-800">
                  Top Bar Announcement Broadcast
                </span>
              </div>
            }
            className="rounded-xl border-amber-950/10 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div className="font-medium text-sm text-gray-800">
                    Enable Top Announcement Bar
                  </div>
                  <div className="text-xs text-gray-500">
                    Displays a prominent highlight strip across all customer pages
                  </div>
                </div>
                <Controller
                  name="announcement.isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      checkedChildren="Active"
                      unCheckedChildren="Hidden"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Announcement Message
                </label>
                <Controller
                  name="announcement.text"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <Input
                      {...rest}
                      value={value || ''}
                      onChange={onChange}
                      placeholder="e.g. Free delivery on orders over ₹499 • Visit our new outlet in Velachery!"
                    />
                  )}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={updateMutation.isPending}
              className="bg-sharon-forest hover:bg-emerald-800 h-11 px-8 font-medium shadow-md button-interaction hover-lift"
            >
              Save All Settings
            </Button>
          </div>
        </form>
      )}
      </div>
    </div>
  );
};
