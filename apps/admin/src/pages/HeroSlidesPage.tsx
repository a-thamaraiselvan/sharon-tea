import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Input,
  InputNumber,
  Switch,
  Space,
  Image,
  message,
  Tag,
  Tooltip,
  Select,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DesktopOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/shared/PageHeader';
import { ImageUpload } from '../components/shared/ImageUpload';
import { showDeleteConfirm } from '../components/shared/ConfirmDialog';
import { heroSlideService } from '../services/heroSlideService';
import { HeroSlide, CreateHeroSlideInput } from '../types';
import { resolveImageUrl } from '../utils/imageUrl';

const { TextArea } = Input;

export const APP_ROUTES = [
  { label: 'Beverage Menu (/menu)', value: '/menu' },
  { label: 'Packaged Tea Blends & Products (/products)', value: '/products' },
  { label: 'Franchise Opportunities (/franchise)', value: '/franchise' },
  { label: 'Visit Outlets (/visit-us)', value: '/visit-us' },
  { label: 'About Us & Heritage (/about-us)', value: '/about-us' },
  { label: 'Home Page (/)', value: '/' },
  { label: 'Contact Us (/contact)', value: '/contact' },
];

const RouteSelector: React.FC<{
  value?: string | null;
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = 'Select Screen Route' }) => {
  const isPreset = APP_ROUTES.some((r) => r.value === value);
  const [isCustom, setIsCustom] = useState(() => Boolean(value && !isPreset));

  return (
    <div className="space-y-1.5">
      <Select
        value={isCustom ? '__custom__' : (value || undefined)}
        placeholder={placeholder}
        allowClear
        className="w-full"
        onChange={(val) => {
          if (val === '__custom__') {
            setIsCustom(true);
          } else {
            setIsCustom(false);
            onChange(val || '');
          }
        }}
        options={[
          ...APP_ROUTES,
          { label: '✏️ Custom Link / External URL...', value: '__custom__' },
        ]}
      />
      {isCustom && (
        <Input
          value={value === '__custom__' ? '' : (value || '')}
          placeholder="e.g. https://... or custom path"
          onChange={(e) => onChange(e.target.value)}
          className="text-xs"
        />
      )}
    </div>
  );
};

const slideSchema = z.object({
  title: z.string().min(2, 'Slide title must be at least 2 characters'),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().min(1, 'Please upload a hero banner image'),
  ctaText: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  secondaryCtaText: z.string().optional().nullable(),
  secondaryCtaLink: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

type SlideFormData = z.infer<typeof slideSchema>;

export const HeroSlidesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Queries
  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['heroSlides'],
    queryFn: () => heroSlideService.getAll(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SlideFormData>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      imageUrl: '',
      ctaText: 'Explore Menu',
      ctaLink: '/menu',
      secondaryCtaText: 'Find Outlets',
      secondaryCtaLink: '/visit-us',
      sortOrder: 0,
      isActive: true,
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateHeroSlideInput) => heroSlideService.create(data),
    onSuccess: () => {
      message.success('Hero slide created');
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to create slide');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateHeroSlideInput> }) =>
      heroSlideService.update(id, data),
    onSuccess: () => {
      message.success('Hero slide updated');
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update slide');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => heroSlideService.delete(id),
    onSuccess: () => {
      message.success('Hero slide removed');
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to remove slide');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      heroSlideService.toggleActive(id, isActive),
    onSuccess: () => {
      message.success('Slide visibility toggled');
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to toggle slide status');
    },
  });

  const handleOpenCreate = () => {
    setEditingSlide(null);
    reset({
      title: '',
      subtitle: '',
      imageUrl: '',
      ctaText: 'Explore Menu',
      ctaLink: '/menu',
      secondaryCtaText: 'Find Outlets',
      secondaryCtaLink: '/visit-us',
      sortOrder: slides.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    reset({
      title: slide.title,
      subtitle: slide.subtitle || '',
      imageUrl: slide.imageUrl || (slide as any).image_url || '',
      ctaText: slide.ctaText || (slide as any).cta_text || '',
      ctaLink: slide.ctaLink || (slide as any).cta_link || '',
      secondaryCtaText: slide.secondaryCtaText || (slide as any).secondary_cta_text || '',
      secondaryCtaLink: slide.secondaryCtaLink || (slide as any).secondary_cta_link || '',
      sortOrder: Number(slide.sortOrder ?? (slide as any).sort_order ?? 0),
      isActive: Boolean(slide.isActive ?? (slide as any).is_active ?? true),
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlide(null);
    reset();
  };

  const onSubmit = (formData: SlideFormData) => {
    const payload: CreateHeroSlideInput = {
      title: formData.title,
      subtitle: formData.subtitle || undefined,
      imageUrl: formData.imageUrl,
      ctaText: formData.ctaText || undefined,
      ctaLink: formData.ctaLink || undefined,
      secondaryCtaText: formData.secondaryCtaText || undefined,
      secondaryCtaLink: formData.secondaryCtaLink || undefined,
      sortOrder: Number(formData.sortOrder) || 0,
      isActive: formData.isActive,
    };

    if (editingSlide) {
      updateMutation.mutate({ id: editingSlide.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (slide: HeroSlide) => {
    showDeleteConfirm({
      title: `Delete slide "${slide.title}"?`,
      content: 'This slide will no longer rotate in the homepage hero carousel.',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(slide.id);
      },
    });
  };

  const columns = [
    {
      title: 'Banner Preview',
      key: 'imageUrl',
      width: 140,
      render: (_: unknown, record: HeroSlide) => {
        const url = record.imageUrl || (record as any).image_url;
        return (
          <div className="w-28 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
            {url ? (
              <Image src={resolveImageUrl(url)} alt="Slide" width={112} height={64} className="object-cover" />
            ) : (
              <DesktopOutlined className="text-gray-400 text-lg" />
            )}
          </div>
        );
      },
    },
    {
      title: 'Title & Subtitle',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: HeroSlide) => (
        <div>
          <div className="font-semibold text-sharon-primary text-base">{title}</div>
          {record.subtitle && (
            <div className="text-xs text-gray-500 mt-0.5">{record.subtitle}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Call to Actions (Primary & Secondary)',
      key: 'cta',
      render: (_: unknown, record: HeroSlide) => {
        const ctaText = record.ctaText || (record as any).cta_text;
        const ctaLink = record.ctaLink || (record as any).cta_link;
        const secText = record.secondaryCtaText || (record as any).secondary_cta_text;
        const secLink = record.secondaryCtaLink || (record as any).secondary_cta_link;
        return (
          <div className="space-y-1.5">
            {ctaText ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag color="green" className="font-semibold">Primary: {ctaText}</Tag>
                {ctaLink && (
                  <span className="text-xs text-gray-500 font-mono">
                    <CompassOutlined className="text-gray-400 mr-0.5" />
                    {ctaLink}
                  </span>
                )}
              </div>
            ) : null}
            {secText ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag color="gold" className="font-semibold">Secondary: {secText}</Tag>
                {secLink && (
                  <span className="text-xs text-gray-500 font-mono">
                    <CompassOutlined className="text-gray-400 mr-0.5" />
                    {secLink}
                  </span>
                )}
              </div>
            ) : null}
            {!ctaText && !secText && (
              <span className="text-gray-400 text-xs">No CTAs configured</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Sort Order',
      key: 'sortOrder',
      width: 100,
      render: (_: unknown, record: HeroSlide) => record.sortOrder ?? (record as any).sort_order ?? 0,
      sorter: (a: HeroSlide, b: HeroSlide) =>
        (a.sortOrder ?? (a as any).sort_order ?? 0) - (b.sortOrder ?? (b as any).sort_order ?? 0),
    },
    {
      title: 'Visible',
      key: 'isActive',
      width: 120,
      render: (_: unknown, record: HeroSlide) => {
        const active = record.isActive ?? (record as any).is_active ?? true;
        return (
          <Switch
            checked={active}
            loading={toggleStatusMutation.isPending}
            onChange={(checked) =>
              toggleStatusMutation.mutate({ id: record.id, isActive: checked })
            }
            checkedChildren="Live"
            unCheckedChildren="Hidden"
          />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      render: (_: unknown, record: HeroSlide) => (
        <Space size="middle">
          <Tooltip title="Edit Slide">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
              className="text-blue-600 hover:text-blue-700 button-interaction hover-scale"
            />
          </Tooltip>
          <Tooltip title="Delete Slide">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              className="button-interaction hover-scale"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div>
        <PageHeader
          title="Homepage Hero Slides"
          subtitle="Control headline banners, marketing copy, and call-to-actions for the main landing slider."
          actionLabel="Add Slide"
          actionIcon={<PlusOutlined />}
          onAction={handleOpenCreate}
        />
      </div>

      <div className="reveal-up is-visible delay-100">
        <Table
          dataSource={slides}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200/80 overflow-hidden"
        />
      </div>

      {/* Slide Modal */}
      <Modal
        title={editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        centered
        width={620}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Headline Title <span className="text-red-500">*</span>
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. Authenticity Steeped in Tradition"
                  status={errors.title ? 'error' : ''}
                />
              )}
            />
            {errors.title && (
              <span className="text-xs text-red-500 mt-1 block">{errors.title.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Subtitle / Supporting Tagline
            </label>
            <Controller
              name="subtitle"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <TextArea
                  {...rest}
                  value={value || ''}
                  onChange={onChange}
                  rows={2}
                  placeholder="e.g. Relish the velvety rich notes of slow-boiled Sharon Irani tea"
                />
              )}
            />
          </div>

          {/* Primary Call-to-Action (Button 1) */}
          <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Tag color="green" className="mr-0 font-semibold">1</Tag> Primary CTA Button
              </span>
              <span className="text-[11px] text-emerald-700">Main action highlight</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Primary Button Text
                </label>
                <Controller
                  name="ctaText"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <Input
                      {...rest}
                      value={value || ''}
                      onChange={onChange}
                      placeholder="e.g. Explore Menu"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Primary Target Screen / Route
                </label>
                <Controller
                  name="ctaLink"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <RouteSelector
                      value={value}
                      onChange={onChange}
                      placeholder="Select Screen Route (e.g. /menu)"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Secondary Call-to-Action (Button 2) */}
          <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Tag color="gold" className="mr-0 font-semibold">2</Tag> Secondary CTA Button (Optional)
              </span>
              <span className="text-[11px] text-amber-700">Supporting action button</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Secondary Button Text
                </label>
                <Controller
                  name="secondaryCtaText"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <Input
                      {...rest}
                      value={value || ''}
                      onChange={onChange}
                      placeholder="e.g. Find Outlets / Partner With Us"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Secondary Target Screen / Route
                </label>
                <Controller
                  name="secondaryCtaLink"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <RouteSelector
                      value={value}
                      onChange={onChange}
                      placeholder="Select Screen Route (e.g. /visit-us)"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sort Order</label>
              <Controller
                name="sortOrder"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    className="w-full"
                    onChange={(val) => field.onChange(val || 0)}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Slide Status</label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <div className="pt-1">
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      checkedChildren="Active on Homepage"
                      unCheckedChildren="Hidden"
                    />
                  </div>
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Banner Background Image <span className="text-red-500">*</span>
            </label>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  aspectRatioLabel="Recommended: 16:9 or 21:9 ultra-wide banner (1920x800)"
                />
              )}
            />
            {errors.imageUrl && (
              <span className="text-xs text-red-500 mt-1 block">{errors.imageUrl.message}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              className="bg-sharon-forest hover:bg-emerald-800"
            >
              {editingSlide ? 'Save Changes' : 'Create Slide'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
