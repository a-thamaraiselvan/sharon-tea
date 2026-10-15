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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DesktopOutlined,
  LinkOutlined,
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

const { TextArea } = Input;

const slideSchema = z.object({
  title: z.string().min(2, 'Slide title must be at least 2 characters'),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().min(1, 'Please upload a hero banner image'),
  ctaText: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
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
      imageUrl: slide.imageUrl,
      ctaText: slide.ctaText || '',
      ctaLink: slide.ctaLink || '',
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
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
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 140,
      render: (url: string) => (
        <div className="w-28 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
          {url ? (
            <Image src={url} alt="Slide" width={112} height={64} className="object-cover" />
          ) : (
            <DesktopOutlined className="text-gray-400 text-lg" />
          )}
        </div>
      ),
    },
    {
      title: 'Title & Subtitle',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: HeroSlide) => (
        <div>
          <div className="font-semibold text-gray-900 text-base">{title}</div>
          {record.subtitle && (
            <div className="text-xs text-gray-500 mt-0.5">{record.subtitle}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Call to Action',
      key: 'cta',
      render: (_: unknown, record: HeroSlide) =>
        record.ctaText ? (
          <div>
            <Tag color="green">{record.ctaText}</Tag>
            {record.ctaLink && (
              <span className="text-xs text-gray-400 block mt-1 flex items-center gap-1">
                <LinkOutlined /> {record.ctaLink}
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">No CTA</span>
        ),
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      sorter: (a: HeroSlide, b: HeroSlide) => a.sortOrder - b.sortOrder,
    },
    {
      title: 'Visible',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean, record: HeroSlide) => (
        <Switch
          checked={isActive}
          loading={toggleStatusMutation.isPending}
          onChange={(checked) =>
            toggleStatusMutation.mutate({ id: record.id, isActive: checked })
          }
          checkedChildren="Live"
          unCheckedChildren="Hidden"
        />
      ),
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
              className="text-blue-600 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="Delete Slide">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
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

      <div>
        <Table
          dataSource={slides}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          className="bg-white rounded-xl shadow-sm border border-amber-950/10 overflow-hidden"
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
                  placeholder="e.g. Relish the velvety rich notes of slow-boiled Sharon Irani chai"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                CTA Button Text
              </label>
              <Controller
                name="ctaText"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <Input
                    {...rest}
                    value={value || ''}
                    onChange={onChange}
                    placeholder="e.g. Order via WhatsApp"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">CTA Link</label>
              <Controller
                name="ctaLink"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <Input
                    {...rest}
                    value={value || ''}
                    onChange={onChange}
                    placeholder="e.g. /products or /franchise"
                  />
                )}
              />
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
