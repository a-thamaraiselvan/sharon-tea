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
  AppstoreAddOutlined,
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
import { resolveImageUrl } from '../utils/imageUrl';

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

interface BulkCategoryRow {
  name: string;
  description: string;
  sortOrder: number;
}

export const ProductCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Bulk add state
  const [bulkRows, setBulkRows] = useState<BulkCategoryRow[]>([
    { name: '', description: '', sortOrder: 1 },
    { name: '', description: '', sortOrder: 2 },
  ]);

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

  // Query product categories specifically
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['productCategories'],
    queryFn: () => menuCategoryService.getAll({ type: 'product' }),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateMenuCategoryInput) =>
      menuCategoryService.create({ ...data, type: 'product' }),
    onSuccess: () => {
      message.success('Product category created successfully');
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to create product category');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMenuCategoryInput> }) =>
      menuCategoryService.update(id, { ...data, type: 'product' }),
    onSuccess: () => {
      message.success('Product category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update product category');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuCategoryService.delete(id),
    onSuccess: () => {
      message.success('Product category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to delete product category');
    },
  });

  // Bulk Delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => menuCategoryService.bulkDelete(ids),
    onSuccess: () => {
      message.success(`Successfully deleted ${selectedRowKeys.length} product categories`);
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to bulk delete product categories');
    },
  });

  // Bulk Create mutation
  const bulkCreateMutation = useMutation({
    mutationFn: (items: CreateMenuCategoryInput[]) =>
      menuCategoryService.bulkCreate(items.map((it) => ({ ...it, type: 'product' }))),
    onSuccess: (data) => {
      message.success(`Successfully added ${data.length} product categories`);
      setIsBulkModalOpen(false);
      setBulkRows([
        { name: '', description: '', sortOrder: 1 },
        { name: '', description: '', sortOrder: 2 },
      ]);
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to bulk create product categories');
    },
  });

  // Toggle active status
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      menuCategoryService.toggleActive(id, isActive),
    onSuccess: () => {
      message.success('Product category status updated');
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to change product category status');
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
      imageUrl: category.imageUrl || (category as any).image_url || null,
      sortOrder: Number(category.sortOrder ?? (category as any).sort_order ?? 0),
      isActive: category.isActive !== false && (category as any).is_active !== false,
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
      type: 'product',
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
        'Deleting this retail category may detach products assigned to it. Are you sure you wish to proceed?',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(category.id);
      },
    });
  };

  const handleBulkDelete = () => {
    showDeleteConfirm({
      title: `Delete ${selectedRowKeys.length} selected product categories?`,
      content: 'Are you sure you want to permanently delete all selected product categories?',
      onConfirm: async () => {
        await bulkDeleteMutation.mutateAsync(selectedRowKeys as string[]);
      },
    });
  };

  const handleAddBulkRow = () => {
    setBulkRows((prev) => [
      ...prev,
      { name: '', description: '', sortOrder: prev.length + 1 },
    ]);
  };

  const handleRemoveBulkRow = (index: number) => {
    setBulkRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkRowChange = (index: number, field: keyof BulkCategoryRow, val: string | number) => {
    setBulkRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleSaveBulk = () => {
    const validRows = bulkRows.filter((r) => r.name.trim().length > 0);
    if (validRows.length === 0) {
      message.warning('Please enter at least one category name');
      return;
    }

    const payload: CreateMenuCategoryInput[] = validRows.map((r, i) => ({
      name: r.name.trim(),
      slug: r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'product',
      description: r.description.trim() || undefined,
      sortOrder: r.sortOrder || categories.length + i + 1,
      isActive: true,
    }));

    bulkCreateMutation.mutate(payload);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (url: string | null, record: MenuCategory) => {
        const imageSrc = url || (record as any).image_url;
        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
            {imageSrc ? (
              <Image src={resolveImageUrl(imageSrc)} alt="Category" width={48} height={48} className="object-cover" />
            ) : (
              <AppstoreOutlined className="text-gray-400 text-lg" />
            )}
          </div>
        );
      },
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: MenuCategory) => (
        <div>
          <span className="font-semibold text-gray-800 text-sm">{text}</span>
          {record.slug && (
            <span className="block text-xs text-gray-400 mt-0.5 font-mono">/{record.slug}</span>
          )}
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string | null) => (
        <span className="text-xs text-gray-500">{text || '—'}</span>
      ),
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      render: (_: unknown, record: MenuCategory) => (
        <Tag color="blue">{Number(record.sortOrder ?? (record as any).sort_order ?? 0)}</Tag>
      ),
      sorter: (a: MenuCategory, b: MenuCategory) => {
        const orderA = Number(a.sortOrder ?? (a as any).sort_order ?? 0);
        const orderB = Number(b.sortOrder ?? (b as any).sort_order ?? 0);
        return orderA - orderB;
      },
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
              className="text-blue-600 hover:text-blue-700 button-interaction hover-scale"
            />
          </Tooltip>
          <Tooltip title="Delete Category">
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
          title="Product Categories"
          subtitle="Manage categories for retail packaged teas, powders, and merchandise (Black Tea, Masala Tea, Herbal Tea, etc.)."
          actionLabel="Add Product Category"
          actionIcon={<PlusOutlined />}
          onAction={handleOpenCreate}
          extra={
            <Button
              icon={<AppstoreAddOutlined />}
              onClick={() => setIsBulkModalOpen(true)}
              className="border-sharon-forest text-sharon-forest hover:bg-sharon-forest/5 font-medium"
            >
              Bulk Add Categories
            </Button>
          }
        />
      </div>

      {/* Bulk action toolbar */}
      {selectedRowKeys.length > 0 && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
          <span className="text-sm font-semibold text-emerald-900">
            {selectedRowKeys.length} {selectedRowKeys.length === 1 ? 'category' : 'categories'} selected
          </span>
          <Space>
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              loading={bulkDeleteMutation.isPending}
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedRowKeys.length})
            </Button>
            <Button onClick={() => setSelectedRowKeys([])}>Cancel</Button>
          </Space>
        </div>
      )}

      <div className="reveal-up is-visible delay-100">
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200/80 overflow-hidden"
        />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        title={editingCategory ? 'Edit Product Category' : 'Create Product Category'}
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
                  placeholder="e.g. Masala Tea, Herbal Tea, Green Tea"
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
                <Input {...field} placeholder="e.g. masala-tea (auto-generated if empty)" />
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
                  placeholder="Details about packaged blends in this category..."
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
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              className="bg-sharon-forest hover:bg-emerald-800"
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Add Categories Modal */}
      <Modal
        title="Bulk Add Product Categories"
        open={isBulkModalOpen}
        onCancel={() => setIsBulkModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        width={700}
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-gray-500">
            Add multiple retail product categories in a single batch. Empty rows will be ignored.
          </p>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {bulkRows.map((row, idx) => (
              <div
                key={idx}
                className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex flex-col sm:flex-row gap-2 items-start sm:items-center"
              >
                <div className="w-full sm:w-1/3">
                  <Input
                    placeholder="Category Name *"
                    value={row.name}
                    onChange={(e) => handleBulkRowChange(idx, 'name', e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <Input
                    placeholder="Short Description"
                    value={row.description}
                    onChange={(e) => handleBulkRowChange(idx, 'description', e.target.value)}
                  />
                </div>
                <div className="w-24">
                  <InputNumber
                    min={0}
                    placeholder="Order"
                    className="w-full"
                    value={row.sortOrder}
                    onChange={(val) => handleBulkRowChange(idx, 'sortOrder', val || 0)}
                  />
                </div>
                {bulkRows.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveBulkRow(idx)}
                  />
                )}
              </div>
            ))}
          </div>

          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={handleAddBulkRow}
            className="border-neutral-300"
          >
            Add Another Category Row
          </Button>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button onClick={() => setIsBulkModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              loading={bulkCreateMutation.isPending}
              onClick={handleSaveBulk}
              className="bg-sharon-forest hover:bg-emerald-800"
            >
              Save All Categories
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductCategoriesPage;
