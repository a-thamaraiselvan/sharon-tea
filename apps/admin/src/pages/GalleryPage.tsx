import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Input,
  InputNumber,
  Select,
  Image,
  Tag,
  message,
  Tabs,
  Empty,
  Skeleton,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/shared/PageHeader';
import { ImageUpload } from '../components/shared/ImageUpload';
import { showDeleteConfirm } from '../components/shared/ConfirmDialog';
import { galleryService } from '../services/galleryService';
import { GalleryItem, GalleryCategory, CreateGalleryItemInput } from '../types';
import { resolveImageUrl } from '../utils/imageUrl';

const { Option } = Select;

const galleryCategories: { label: string; value: GalleryCategory }[] = [
  { label: 'Tea Preparation', value: 'tea-preparation' },
  { label: 'Beverages', value: 'beverages' },
  { label: 'Store Interior', value: 'store-interior' },
  { label: 'Packaging', value: 'packaging' },
  { label: 'Customers', value: 'customer' },
  { label: 'Events & Catering', value: 'events' },
];

const gallerySchema = z.object({
  caption: z.string().min(2, 'Caption must be at least 2 characters'),
  category: z.enum([
    'tea-preparation',
    'beverages',
    'store-interior',
    'packaging',
    'customer',
    'events',
  ]),
  imageUrl: z.string().min(1, 'Please upload an image'),
  sortOrder: z.number().int().min(0).default(0),
});

type GalleryFormData = z.infer<typeof gallerySchema>;

export const GalleryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Query
  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['gallery', selectedCategory],
    queryFn: () =>
      galleryService.getAll(
        selectedCategory === 'all' ? undefined : (selectedCategory as GalleryCategory)
      ),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      caption: '',
      category: 'tea-preparation',
      imageUrl: '',
      sortOrder: 0,
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateGalleryItemInput) => galleryService.create(data),
    onSuccess: () => {
      message.success('Image added to gallery');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to add image');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGalleryItemInput> }) =>
      galleryService.update(id, data),
    onSuccess: () => {
      message.success('Gallery item updated');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update image');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => galleryService.delete(id),
    onSuccess: () => {
      message.success('Gallery photo removed');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to remove photo');
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    reset({
      caption: '',
      category:
        selectedCategory !== 'all' ? (selectedCategory as GalleryCategory) : 'tea-preparation',
      imageUrl: '',
      sortOrder: galleryItems.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    reset({
      caption: item.caption,
      category: item.category,
      imageUrl: item.imageUrl || (item as any).image_url || '',
      sortOrder: Number(item.sortOrder ?? (item as any).sort_order ?? 0),
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    reset();
  };

  const onSubmit = (formData: GalleryFormData) => {
    const payload: CreateGalleryItemInput = {
      caption: formData.caption,
      category: formData.category,
      imageUrl: formData.imageUrl,
      sortOrder: Number(formData.sortOrder) || 0,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (item: GalleryItem) => {
    showDeleteConfirm({
      title: 'Remove this photo from the gallery?',
      content: 'This image will be removed from customer gallery displays.',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(item.id);
      },
    });
  };

  const tabItems = [
    { key: 'all', label: 'All Photos' },
    ...galleryCategories.map((c) => ({
      key: c.value,
      label: c.label,
    })),
  ];

  return (
    <div>
      <div>
        <PageHeader
          title="Visual Brand Gallery"
          subtitle="Manage photo displays highlighting brewing artistry, stalls, and Sharon moments."
          actionLabel="Upload Image"
          actionIcon={<PlusOutlined />}
          onAction={handleOpenCreate}
        />
      </div>

      <div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200/80 mb-6 reveal-down is-visible delay-50">
          <Tabs
            activeKey={selectedCategory}
            onChange={(key) => setSelectedCategory(key)}
            items={tabItems}
          />
        </div>

        {isLoading ? (
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Col xs={24} sm={12} md={8} lg={6} key={i}>
                <Card className="rounded-xl overflow-hidden shadow-sm border border-neutral-200/80 bg-white">
                  <Skeleton.Image className="w-full h-48" active />
                  <Skeleton active paragraph={{ rows: 1 }} className="mt-4" />
                </Card>
              </Col>
            ))}
          </Row>
        ) : galleryItems.length === 0 ? (
          <Card className="rounded-xl border border-neutral-200/80 p-8 text-center bg-white reveal-up is-visible delay-100">
            <Empty
              description="No images found in this gallery category"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenCreate}
                className="bg-sharon-forest hover:bg-emerald-800 button-interaction hover-lift"
              >
                Upload First Image
              </Button>
            </Empty>
          </Card>
        ) : (
          <div className="reveal-up is-visible delay-100">
            <Row gutter={[16, 16]}>
              {galleryItems.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                  <Card
                    hoverable
                    cover={
                      <div className="h-48 overflow-hidden bg-gray-100 relative group">
                        <Image
                          src={resolveImageUrl(item.imageUrl || (item as any).image_url)}
                          alt={item.caption}
                          className="object-cover w-full h-48"
                        />
                        <div className="absolute top-2 right-2">
                          <Tag color="black" className="bg-black/60 border-none text-white text-[11px]">
                            #{item.sortOrder ?? (item as any).sort_order ?? 0}
                          </Tag>
                        </div>
                      </div>
                    }
                    actions={[
                      <Button
                        key="edit"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenEdit(item)}
                        className="text-blue-600 button-interaction hover-scale"
                      >
                        Edit
                      </Button>,
                      <Button
                        key="delete"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(item)}
                        className="button-interaction hover-scale"
                      >
                        Delete
                      </Button>,
                    ]}
                    className="rounded-xl overflow-hidden border border-neutral-200/80 shadow-sm flex flex-col justify-between hover-lift bg-white"
                  >
                    <div className="mb-2">
                      <Tag color="cyan" className="text-[11px] uppercase font-semibold mb-1">
                        {item.category.replace('-', ' ')}
                      </Tag>
                      <div className="font-medium text-sharon-primary text-sm line-clamp-2">
                        {item.caption}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>

      {/* Upload / Edit Modal */}
      <Modal
        title={editingItem ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        centered
        width={520}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Category <span className="text-red-500">*</span>
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select {...field} className="w-full">
                  {galleryCategories.map((c) => (
                    <Option key={c.value} value={c.value}>
                      {c.label}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Photo Caption <span className="text-red-500">*</span>
            </label>
            <Controller
              name="caption"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. Master Chai Brewer pouring frothy Irani tea from height"
                  status={errors.caption ? 'error' : ''}
                />
              )}
            />
            {errors.caption && (
              <span className="text-xs text-red-500 mt-1 block">{errors.caption.message}</span>
            )}
          </div>

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
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Upload High-Resolution Photo <span className="text-red-500">*</span>
            </label>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  aspectRatioLabel="Recommended: 4:3 or 16:9 high-res photo"
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
              {editingItem ? 'Save Changes' : 'Upload to Gallery'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
