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
  AppstoreOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/shared/PageHeader';
import { ImageUpload } from '../components/shared/ImageUpload';
import { showDeleteConfirm } from '../components/shared/ConfirmDialog';
import { menuCategoryService } from '../services/menuCategoryService';
import { MenuCategory, CreateMenuCategoryInput } from '../types';

const { TextArea } = Input;

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0, 'Sort order must be 0 or greater'),
  isActive: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export const MenuCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      imageUrl: null,
      sortOrder: 0,
      isActive: true,
    },
  });

  // Query categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['menuCategories'],
    queryFn: () => menuCategoryService.getAll(),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateMenuCategoryInput) => menuCategoryService.create(data),
    onSuccess: () => {
      message.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: ['menuCategories'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to create category');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMenuCategoryInput> }) =>
      menuCategoryService.update(id, data),
    onSuccess: () => {
      message.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['menuCategories'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update category');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuCategoryService.delete(id),
    onSuccess: () => {
      message.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['menuCategories'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to delete category');
    },
  });

  // Toggle active status
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      menuCategoryService.toggleActive(id, isActive),
    onSuccess: () => {
      message.success('Category status updated');
      queryClient.invalidateQueries({ queryKey: ['menuCategories'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to change category status');
    },
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    reset({
      name: '',
      slug: '',
      description: '',
      imageUrl: null,
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: MenuCategory) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.imageUrl || null,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = (formData: CategoryFormData) => {
    const payload: CreateMenuCategoryInput = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
      sortOrder: Number(formData.sortOrder) || 0,
      isActive: formData.isActive,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (category: MenuCategory) => {
    showDeleteConfirm({
      title: `Delete category "${category.name}"?`,
      content:
        'Deleting this category may detach all menu items assigned to it. Are you sure you wish to proceed?',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(category.id);
      },
    });
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (url: string | null) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
          {url ? (
            <Image src={url} alt="Category" width={48} height={48} className="object-cover" />
          ) : (
            <AppstoreOutlined className="text-gray-400 text-lg" />
          )}
        </div>
      ),
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: MenuCategory) => (
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          {record.description && (
            <div className="text-xs text-gray-500 line-clamp-1">{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => <Tag className="font-mono text-xs">{slug}</Tag>,
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      sorter: (a: MenuCategory, b: MenuCategory) => a.sortOrder - b.sortOrder,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean, record: MenuCategory) => (
        <Switch
          checked={isActive}
          loading={toggleMutation.isPending}
          onChange={(checked) => toggleMutation.mutate({ id: record.id, isActive: checked })}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: MenuCategory) => (
        <Space size="middle">
          <Tooltip title="Edit Category">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
              className="text-blue-600 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="Delete Category">
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
          title="Menu Categories"
          subtitle="Organize hot beverages, cool drinks, snacks, and sweets."
          actionLabel="Add Category"
          actionIcon={<PlusOutlined />}
          onAction={handleOpenCreate}
        />
      </div>

      <div>
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          className="bg-white rounded-xl shadow-sm border border-amber-950/10 overflow-hidden"
        />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        title={editingCategory ? 'Edit Menu Category' : 'Create Menu Category'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        centered
        width={540}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. Signature Teas, Snacks, Fresh Bakes"
                  status={errors.name ? 'error' : ''}
                />
              )}
            />
            {errors.name && (
              <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              URL Slug (Optional)
            </label>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="e.g. signature-teas (auto-generated if empty)" />
              )}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <TextArea
                  {...rest}
                  value={value || ''}
                  onChange={onChange}
                  rows={3}
                  placeholder="Brief description of this menu section..."
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <div className="pt-1">
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                  </div>
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Category Image</label>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  aspectRatioLabel="Recommended: 1:1 square, max 5MB"
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              className="bg-sharon-forest hover:bg-emerald-800"
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
