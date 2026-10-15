import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Input,
  InputNumber,
  Select,
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
  CoffeeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/shared/PageHeader';
import { ImageUpload } from '../components/shared/ImageUpload';
import { showDeleteConfirm } from '../components/shared/ConfirmDialog';
import { menuItemService } from '../services/menuItemService';
import { menuCategoryService } from '../services/menuCategoryService';
import { MenuItem, CreateMenuItemInput } from '../types';

const { TextArea } = Input;
const { Option } = Select;

const menuItemSchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters'),
  slug: z.string().optional(),
  categoryId: z.string().min(1, 'Please select a category'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isAvailable: z.boolean().default(true),
  isVegetarian: z.boolean().default(true),
  sortOrder: z.number().int().min(0, 'Sort order must be 0 or greater'),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

export const MenuItemsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Queries
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['menuCategories'],
    queryFn: () => menuCategoryService.getAll(),
  });

  const { data: menuItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['menuItems', selectedCategory],
    queryFn: () => menuItemService.getAll({ categoryId: selectedCategory }),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      slug: '',
      categoryId: '',
      price: 20,
      shortDescription: '',
      description: '',
      imageUrl: null,
      isAvailable: true,
      isVegetarian: true,
      sortOrder: 0,
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateMenuItemInput) => menuItemService.create(data),
    onSuccess: () => {
      message.success('Menu item added successfully');
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to add menu item');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMenuItemInput> }) =>
      menuItemService.update(id, data),
    onSuccess: () => {
      message.success('Menu item updated successfully');
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update menu item');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuItemService.delete(id),
    onSuccess: () => {
      message.success('Menu item deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to delete menu item');
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      menuItemService.toggleAvailability(id, isAvailable),
    onSuccess: () => {
      message.success('Item availability updated');
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update item availability');
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    reset({
      name: '',
      slug: '',
      categoryId: selectedCategory || (categories[0]?.id || ''),
      price: 25,
      shortDescription: '',
      description: '',
      imageUrl: null,
      isAvailable: true,
      isVegetarian: true,
      sortOrder: menuItems.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    reset({
      name: item.name,
      slug: item.slug,
      categoryId: item.categoryId,
      price: item.price,
      shortDescription: item.shortDescription || '',
      description: item.description || '',
      imageUrl: item.imageUrl || null,
      isAvailable: item.isAvailable,
      isVegetarian: item.isVegetarian !== undefined ? item.isVegetarian : true,
      sortOrder: item.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    reset();
  };

  const onSubmit = (formData: MenuItemFormData) => {
    const payload: CreateMenuItemInput = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: formData.categoryId,
      price: Number(formData.price),
      shortDescription: formData.shortDescription || undefined,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
      isAvailable: formData.isAvailable,
      isVegetarian: formData.isVegetarian,
      sortOrder: Number(formData.sortOrder) || 0,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (item: MenuItem) => {
    showDeleteConfirm({
      title: `Delete "${item.name}"?`,
      content: 'This will remove the item from the customer menu.',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(item.id);
      },
    });
  };

  // Filter items by search query
  const filteredItems = menuItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      (item.shortDescription && item.shortDescription.toLowerCase().includes(query))
    );
  });

  const columns = [
    {
      title: 'Item',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 70,
      render: (url: string | null) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
          {url ? (
            <Image src={url} alt="Item" width={48} height={48} className="object-cover" />
          ) : (
            <CoffeeOutlined className="text-gray-400 text-lg" />
          )}
        </div>
      ),
    },
    {
      title: 'Name & Info',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: MenuItem) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{name}</span>
            {record.isVegetarian ? (
              <span className="w-3.5 h-3.5 border border-green-600 rounded flex items-center justify-center" title="Pure Veg">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              </span>
            ) : (
              <span className="w-3.5 h-3.5 border border-red-600 rounded flex items-center justify-center" title="Non-Veg">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              </span>
            )}
          </div>
          {record.shortDescription && (
            <div className="text-xs text-gray-500 line-clamp-1">{record.shortDescription}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (catId: string, record: MenuItem) => {
        const cat = categories.find((c) => c.id === catId);
        return <Tag color="blue">{cat?.name || record.categoryName || 'General'}</Tag>;
      },
    },
    {
      title: 'Price (₹)',
      dataIndex: 'price',
      key: 'price',
      width: 110,
      render: (price: number) => (
        <span className="font-semibold text-sharon-rust">₹{Number(price).toFixed(2)}</span>
      ),
      sorter: (a: MenuItem, b: MenuItem) => a.price - b.price,
    },
    {
      title: 'Available',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      width: 120,
      render: (isAvailable: boolean, record: MenuItem) => (
        <Switch
          checked={isAvailable}
          loading={toggleAvailabilityMutation.isPending}
          onChange={(checked) =>
            toggleAvailabilityMutation.mutate({ id: record.id, isAvailable: checked })
          }
          checkedChildren="Yes"
          unCheckedChildren="Sold Out"
        />
      ),
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      sorter: (a: MenuItem, b: MenuItem) => a.sortOrder - b.sortOrder,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      render: (_: unknown, record: MenuItem) => (
        <Space size="middle">
          <Tooltip title="Edit Item">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
              className="text-blue-600 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="Delete Item">
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
          title="Menu Items"
          subtitle="Manage in-stall hot teas, cold brews, snacks, and accompaniments."
          actionLabel="Add Menu Item"
          actionIcon={<PlusOutlined />}
          onAction={handleOpenCreate}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-950/10 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Select
            allowClear
            placeholder="All Categories"
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            className="w-48"
            loading={categoriesLoading}
          >
            {categories.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>

          <Input
            placeholder="Search items by name..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="w-full sm:w-64"
          />
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Showing {filteredItems.length} items
        </div>
      </div>

      <div>
        <Table
          dataSource={filteredItems}
          columns={columns}
          rowKey="id"
          loading={itemsLoading}
          pagination={{ pageSize: 10 }}
          className="bg-white rounded-xl shadow-sm border border-amber-950/10 overflow-hidden"
        />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        centered
        width={620}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Item Name <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. Sharon Irani Dum Chai"
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
                Category <span className="text-red-500">*</span>
              </label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select Category"
                    className="w-full"
                    status={errors.categoryId ? 'error' : ''}
                  >
                    {categories.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.categoryId && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.categoryId.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    step={1}
                    className="w-full"
                    prefix="₹"
                    onChange={(val) => field.onChange(val || 0)}
                  />
                )}
              />
              {errors.price && (
                <span className="text-xs text-red-500 mt-1 block">{errors.price.message}</span>
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
              <Controller
                name="isVegetarian"
                control={control}
                render={({ field }) => (
                  <div className="pt-1">
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      checkedChildren="Pure Veg"
                      unCheckedChildren="Non-Veg"
                    />
                  </div>
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Short Description (Highlighted on card)
            </label>
            <Controller
              name="shortDescription"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <Input
                  {...rest}
                  value={value || ''}
                  onChange={onChange}
                  placeholder="e.g. Slow-cooked spiced tea with rich condensed milk cream"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Description & Ingredients
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <TextArea
                  {...rest}
                  value={value || ''}
                  onChange={onChange}
                  rows={2}
                  placeholder="Detailed brewing notes, spice blend details, allergens..."
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Item Photo
              </label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    aspectRatioLabel="Recommended: 1:1 square photo, max 5MB"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Availability in Stall
              </label>
              <Controller
                name="isAvailable"
                control={control}
                render={({ field }) => (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      checkedChildren="Currently Available"
                      unCheckedChildren="Temporarily Sold Out"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Controls immediate visibility and order badge on the stall menu
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              className="bg-sharon-forest hover:bg-emerald-800"
            >
              {editingItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
