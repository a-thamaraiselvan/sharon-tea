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
  ShoppingOutlined,
  SearchOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/shared/PageHeader';
import { ImageUpload } from '../components/shared/ImageUpload';
import { showDeleteConfirm } from '../components/shared/ConfirmDialog';
import { productService } from '../services/productService';
import { menuCategoryService } from '../services/menuCategoryService';
import { Product, CreateProductInput } from '../types';
import { resolveImageUrl } from '../utils/imageUrl';

const { TextArea } = Input;
const { Option } = Select;

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  shortDescription: z
    .string()
    .max(100, 'Short description cannot exceed 100 characters')
    .optional()
    .nullable(),
  description: z
    .string()
    .max(600, 'Detailed description cannot exceed 600 characters')
    .optional()
    .nullable(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  originalPrice: z.number().min(0).optional().nullable(),
  packSize: z.string().min(1, 'Pack size is required (e.g. 250g, 500g)'),
  ingredients: z.string().optional().nullable(),
  preparationInstructions: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isAvailable: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

type ProductFormData = z.infer<typeof productSchema>;

interface BulkProductRow {
  name: string;
  packSize: string;
  price: number;
  originalPrice: number;
  shortDescription: string;
}

export const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [bulkRows, setBulkRows] = useState<BulkProductRow[]>([
    { name: '', packSize: '250g Pouch', price: 190, originalPrice: 200, shortDescription: '' },
    { name: '', packSize: '250g Pouch', price: 210, originalPrice: 220, shortDescription: '' },
  ]);

  // Queries
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['productCategories'],
    queryFn: () => menuCategoryService.getAll({ type: 'product' }),
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => productService.getAll({ categoryId: selectedCategory }),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      categoryId: '',
      shortDescription: '',
      description: '',
      price: 190,
      originalPrice: 200,
      packSize: '250g Pouch',
      ingredients: '',
      preparationInstructions: '',
      imageUrl: null,
      isAvailable: true,
      sortOrder: 0,
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateProductInput) => productService.create(data),
    onSuccess: () => {
      message.success('Packaged product added successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to add product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductInput> }) =>
      productService.update(id, data),
    onSuccess: () => {
      message.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update product');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      message.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to delete product');
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      productService.toggleAvailability(id, isAvailable),
    onSuccess: () => {
      message.success('Product availability updated');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update product availability');
    },
  });

  // Bulk Delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => productService.bulkDelete(ids),
    onSuccess: () => {
      message.success(`Successfully deleted ${selectedRowKeys.length} products`);
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to bulk delete products');
    },
  });

  // Bulk Create mutation
  const bulkCreateMutation = useMutation({
    mutationFn: (items: CreateProductInput[]) => productService.bulkCreate(items),
    onSuccess: (data) => {
      message.success(`Successfully added ${data.length} products`);
      setIsBulkModalOpen(false);
      setBulkRows([
        { name: '', packSize: '250g Pouch', price: 190, originalPrice: 200, shortDescription: '' },
        { name: '', packSize: '250g Pouch', price: 210, originalPrice: 220, shortDescription: '' },
      ]);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to bulk add products');
    },
  });

  const handleBulkDelete = () => {
    showDeleteConfirm({
      title: `Delete ${selectedRowKeys.length} selected products?`,
      content: 'Are you sure you want to permanently delete all selected products?',
      onConfirm: async () => {
        await bulkDeleteMutation.mutateAsync(selectedRowKeys as string[]);
      },
    });
  };

  const handleAddBulkRow = () => {
    setBulkRows((prev) => [
      ...prev,
      { name: '', packSize: '250g Pouch', price: 190, originalPrice: 200, shortDescription: '' },
    ]);
  };

  const handleRemoveBulkRow = (index: number) => {
    setBulkRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkRowChange = (index: number, field: keyof BulkProductRow, val: string | number) => {
    setBulkRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleSaveBulk = () => {
    const validRows = bulkRows.filter((r) => r.name.trim().length > 0);
    if (validRows.length === 0) {
      message.warning('Please enter at least one product name');
      return;
    }

    const payload: CreateProductInput[] = validRows.map((r, i) => ({
      name: r.name.trim(),
      slug: r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: r.shortDescription.trim() || undefined,
      price: Number(r.price) || 0,
      originalPrice: Number(r.originalPrice) || undefined,
      packSize: r.packSize.trim() || '250g Pouch',
      isAvailable: true,
      sortOrder: products.length + i + 1,
    }));

    bulkCreateMutation.mutate(payload);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    reset({
      name: '',
      slug: '',
      categoryId: selectedCategory || (categories[0]?.id || ''),
      shortDescription: '',
      description: '',
      price: 190,
      originalPrice: 200,
      packSize: '250g Pouch',
      ingredients: 'Premium Assam CTC Black Tea, Handcrafted Spices',
      preparationInstructions: 'Add 1 tsp to boiling water and milk, simmer for 3 minutes.',
      imageUrl: null,
      isAvailable: true,
      sortOrder: products.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    const catId = product.categoryId || (product as any).category_id || '';
    reset({
      name: product.name,
      slug: product.slug,
      categoryId: catId,
      shortDescription: product.shortDescription || (product as any).short_description || '',
      description: product.description || '',
      price: Number(product.price) || 0,
      originalPrice: product.originalPrice != null ? Number(product.originalPrice) : ((product as any).original_price != null ? Number((product as any).original_price) : null),
      packSize: product.packSize || (product as any).pack_size || '250g Pouch',
      ingredients: product.ingredients || '',
      preparationInstructions: product.preparationInstructions || (product as any).preparation_instructions || '',
      imageUrl: product.imageUrl || (product as any).image_url || null,
      isAvailable: product.isAvailable !== false && (product as any).is_available !== false,
      sortOrder: Number(product.sortOrder ?? (product as any).sort_order ?? 0),
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = (formData: ProductFormData) => {
    const selectedCat = categories.find((c) => c.id === formData.categoryId);
    const payload: CreateProductInput = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: formData.categoryId || undefined,
      category: selectedCat?.name || undefined,
      shortDescription: formData.shortDescription || undefined,
      description: formData.description || undefined,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      packSize: formData.packSize,
      ingredients: formData.ingredients || undefined,
      preparationInstructions: formData.preparationInstructions || undefined,
      imageUrl: formData.imageUrl || undefined,
      isAvailable: formData.isAvailable,
      sortOrder: Number(formData.sortOrder) || 0,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (product: Product) => {
    showDeleteConfirm({
      title: `Delete product "${product.name}"?`,
      content: 'This will remove the product from WhatsApp catalogue and website.',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(product.id);
      },
    });
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory) {
      const pCatId = p.categoryId || (p as any).category_id;
      if (pCatId !== selectedCategory) return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.packSize.toLowerCase().includes(q) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
    );
  });

  const columns = [
    {
      title: 'Product',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 70,
      render: (url: string | null, record: Product) => {
        const imageSrc = url || (record as any).image_url;
        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
            {imageSrc ? (
              <Image src={resolveImageUrl(imageSrc)} alt="Product" width={48} height={48} className="object-cover" />
            ) : (
              <ShoppingOutlined className="text-gray-400 text-lg" />
            )}
          </div>
        );
      },
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Product) => (
        <div>
          <div className="font-semibold text-sharon-primary">{name}</div>
          <div className="text-xs text-gray-500">{record.shortDescription || (record as any).short_description}</div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (catId: string, record: Product) => {
        const effectiveCatId = catId || (record as any).category_id;
        const cat = categories.find((c) => c.id === effectiveCatId);
        return <Tag color="green">{cat?.name || record.category || 'Retail Tea'}</Tag>;
      },
    },
    {
      title: 'Pack Size',
      dataIndex: 'packSize',
      key: 'packSize',
      render: (size: string) => <Tag color="orange">{size}</Tag>,
    },
    {
      title: 'Price (₹)',
      key: 'pricing',
      width: 140,
      render: (_: unknown, record: Product) => {
        const currentPrice = Number(record.price) || 0;
        const origPrice = record.originalPrice != null ? Number(record.originalPrice) : null;
        return (
          <div>
            <span className="font-bold text-sharon-rust">₹{currentPrice.toFixed(2)}</span>
            {origPrice && origPrice > currentPrice && (
              <span className="text-xs text-gray-400 line-through ml-2">
                ₹{origPrice.toFixed(2)}
              </span>
            )}
          </div>
        );
      },
      sorter: (a: Product, b: Product) => Number(a.price) - Number(b.price),
    },
    {
      title: 'Availability',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      width: 130,
      render: (isAvailable: boolean, record: Product) => (
        <Switch
          checked={isAvailable}
          loading={toggleAvailabilityMutation.isPending}
          onChange={(checked) =>
            toggleAvailabilityMutation.mutate({ id: record.id, isAvailable: checked })
          }
          checkedChildren="In Stock"
          unCheckedChildren="Out of Stock"
        />
      ),
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      render: (_: unknown, record: Product) => (
        <Tag color="blue">{Number(record.sortOrder ?? (record as any).sort_order ?? 0)}</Tag>
      ),
      sorter: (a: Product, b: Product) => {
        const orderA = Number(a.sortOrder ?? (a as any).sort_order ?? 0);
        const orderB = Number(b.sortOrder ?? (b as any).sort_order ?? 0);
        return orderA - orderB;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      render: (_: unknown, record: Product) => (
        <Space size="middle">
          <Tooltip title="Edit Product">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
              className="text-blue-600 hover:text-blue-700 button-interaction hover-scale"
            />
          </Tooltip>
          <Tooltip title="Delete Product">
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
          title="Packaged Products"
          subtitle="Manage signature retail tea powders, blends, and merchandise ordered via WhatsApp."
          actionLabel="Add Product"
          actionIcon={<PlusOutlined />}
          onAction={handleOpenCreate}
          extra={
            <Button
              icon={<AppstoreAddOutlined />}
              onClick={() => setIsBulkModalOpen(true)}
              className="border-sharon-forest text-sharon-forest hover:bg-sharon-forest/5 font-medium"
            >
              Bulk Add Products
            </Button>
          }
        />
      </div>

      {/* Bulk action toolbar */}
      {selectedRowKeys.length > 0 && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
          <span className="text-sm font-semibold text-emerald-900">
            {selectedRowKeys.length} {selectedRowKeys.length === 1 ? 'product' : 'products'} selected
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

      {/* Search Header */}
      {/* Search Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200/80 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between reveal-down is-visible delay-50">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Select
            allowClear
            placeholder="All Product Categories"
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            className="w-52"
            loading={categoriesLoading}
          >
            {categories.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>

          <Input
            placeholder="Search products by name or pack size..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="w-full sm:w-64"
          />
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Showing {filteredProducts.length} products
        </div>
      </div>

      <div className="reveal-up is-visible delay-100">
        <Table
          dataSource={filteredProducts}
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

      {/* Modal Form */}
      <Modal
        title={editingProduct ? 'Edit Packaged Product' : 'Add Packaged Product'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        centered
        width={680}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. Sharon Royal Masala Tea Blend"
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
                Category
              </label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select Retail Category"
                    className="w-full"
                    allowClear
                    loading={categoriesLoading}
                  >
                    {categories.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Pack Size <span className="text-red-500">*</span>
              </label>
              <Controller
                name="packSize"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. 250g Pouch"
                    status={errors.packSize ? 'error' : ''}
                  />
                )}
              />
              {errors.packSize && (
                <span className="text-xs text-red-500 mt-1 block">{errors.packSize.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Selling Price (₹) <span className="text-red-500">*</span>
              </label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Original MRP (₹)
              </label>
              <Controller
                name="originalPrice"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    className="w-full"
                    prefix="₹"
                    placeholder="Optional MRP"
                    value={field.value ?? undefined}
                    onChange={(val) => field.onChange(val ?? null)}
                  />
                )}
              />
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
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Short Description (Card preview highlights)
              </label>
              <span className="text-[11px] text-gray-400">Max 100 characters</span>
            </div>
            <Controller
              name="shortDescription"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <Input
                  {...rest}
                  value={value || ''}
                  onChange={onChange}
                  maxLength={100}
                  showCount
                  placeholder="e.g. Rich chocolate flavour with a refreshing tea taste."
                  status={errors.shortDescription ? 'error' : ''}
                />
              )}
            />
            {errors.shortDescription && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.shortDescription.message}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Detailed Description
              </label>
              <span className="text-[11px] text-gray-400">Max 600 characters</span>
            </div>
            <Controller
              name="description"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <TextArea
                  {...rest}
                  value={value || ''}
                  onChange={onChange}
                  rows={3}
                  maxLength={600}
                  showCount
                  placeholder="Detailed background story, tasting notes, shelf life, aroma characteristics..."
                  status={errors.description ? 'error' : ''}
                />
              )}
            />
            {errors.description && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Ingredients</label>
              <Controller
                name="ingredients"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <TextArea
                    {...rest}
                    value={value || ''}
                    onChange={onChange}
                    rows={2}
                    placeholder="Cardamom, Cloves, Ginger, Cinnamon, CTC Black Tea..."
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Preparation Instructions
              </label>
              <Controller
                name="preparationInstructions"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <TextArea
                    {...rest}
                    value={value || ''}
                    onChange={onChange}
                    rows={2}
                    placeholder="Boil 150ml milk and water, add 1 tsp powder, simmer 3 mins..."
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Image
              </label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    aspectRatioLabel="Recommended: 1:1 square pack photo"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Availability Status
              </label>
              <Controller
                name="isAvailable"
                control={control}
                render={({ field }) => (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      checkedChildren="Ready to Order"
                      unCheckedChildren="Out of Stock"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Controls if customers can click to order via WhatsApp
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
              {editingProduct ? 'Save Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Add Products Modal */}
      <Modal
        title="Bulk Add Packaged Products"
        open={isBulkModalOpen}
        onCancel={() => setIsBulkModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        width={800}
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-gray-500">
            Add multiple packaged blends or pouches at once. Empty rows will be ignored.
          </p>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {bulkRows.map((row, idx) => (
              <div
                key={idx}
                className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex flex-col sm:flex-row gap-2 items-start sm:items-center"
              >
                <div className="w-full sm:w-1/4">
                  <Input
                    placeholder="Product Name *"
                    value={row.name}
                    onChange={(e) => handleBulkRowChange(idx, 'name', e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-1/5">
                  <Input
                    placeholder="Pack Size (e.g. 250g)"
                    value={row.packSize}
                    onChange={(e) => handleBulkRowChange(idx, 'packSize', e.target.value)}
                  />
                </div>
                <div className="w-24">
                  <InputNumber
                    min={0}
                    placeholder="Price ₹"
                    className="w-full"
                    value={row.price}
                    onChange={(val) => handleBulkRowChange(idx, 'price', val || 0)}
                  />
                </div>
                <div className="w-24">
                  <InputNumber
                    min={0}
                    placeholder="MRP ₹"
                    className="w-full"
                    value={row.originalPrice}
                    onChange={(val) => handleBulkRowChange(idx, 'originalPrice', val || 0)}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <Input
                    placeholder="Short highlight (max 100)"
                    maxLength={100}
                    value={row.shortDescription}
                    onChange={(e) => handleBulkRowChange(idx, 'shortDescription', e.target.value)}
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
            Add Another Product Row
          </Button>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button onClick={() => setIsBulkModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              loading={bulkCreateMutation.isPending}
              onClick={handleSaveBulk}
              className="bg-sharon-forest hover:bg-emerald-800"
            >
              Save All Products
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
