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
  ShoppingOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/shared/PageHeader';
import { ImageUpload } from '../components/shared/ImageUpload';
import { showDeleteConfirm } from '../components/shared/ConfirmDialog';
import { productService } from '../services/productService';
import { Product, CreateProductInput } from '../types';

const { TextArea } = Input;

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().optional(),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
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

export const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Queries
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
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
      shortDescription: '',
      description: '',
      price: 199,
      originalPrice: 249,
      packSize: '250g',
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

  const handleOpenCreate = () => {
    setEditingProduct(null);
    reset({
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      price: 199,
      originalPrice: 249,
      packSize: '250g',
      ingredients: 'Premium Assam CTC Black Tea, Crushed Cardamom, Ginger, Cinnamon',
      preparationInstructions: 'Add 1 tsp to boiling water and milk, simmer for 3 minutes.',
      imageUrl: null,
      isAvailable: true,
      sortOrder: products.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalPrice ?? null,
      packSize: product.packSize,
      ingredients: product.ingredients || '',
      preparationInstructions: product.preparationInstructions || '',
      imageUrl: product.imageUrl || null,
      isAvailable: product.isAvailable,
      sortOrder: product.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = (formData: ProductFormData) => {
    const payload: CreateProductInput = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
      render: (url: string | null) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
          {url ? (
            <Image src={url} alt="Product" width={48} height={48} className="object-cover" />
          ) : (
            <ShoppingOutlined className="text-gray-400 text-lg" />
          )}
        </div>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Product) => (
        <div>
          <div className="font-semibold text-sharon-primary">{name}</div>
          <div className="text-xs text-gray-500">{record.shortDescription}</div>
        </div>
      ),
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
      render: (_: unknown, record: Product) => (
        <div>
          <span className="font-bold text-sharon-rust">₹{record.price}</span>
          {record.originalPrice && record.originalPrice > record.price && (
            <span className="text-xs text-gray-400 line-through ml-2">
              ₹{record.originalPrice}
            </span>
          )}
        </div>
      ),
      sorter: (a: Product, b: Product) => a.price - b.price,
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
        />
      </div>

      {/* Search Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200/80 mb-6 flex items-center justify-between reveal-down is-visible delay-50">
        <Input
          placeholder="Search products by name or pack size..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          className="max-w-md"
        />
        <div className="text-xs text-gray-500 font-medium">
          Total Products: {filteredProducts.length}
        </div>
      </div>

      <div className="reveal-up is-visible delay-100">
        <Table
          dataSource={filteredProducts}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
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
        rootClassName="modal-enter"
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
                    placeholder="e.g. Sharon Royal Masala Chai Blend"
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
                Pack Size <span className="text-red-500">*</span>
              </label>
              <Controller
                name="packSize"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. 250g Pouch / 500g Jar / 1 Kg Pack"
                    status={errors.packSize ? 'error' : ''}
                  />
                )}
              />
              {errors.packSize && (
                <span className="text-xs text-red-500 mt-1 block">{errors.packSize.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                Original Price (MRP)
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Short Description (Highlights)
            </label>
            <Controller
              name="shortDescription"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <Input
                  {...rest}
                  value={value || ''}
                  onChange={onChange}
                  placeholder="e.g. Master-blended spices with single-origin Assam golden tips"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Detailed Description
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
                  placeholder="Detailed background story, tasting notes, shelf life..."
                />
              )}
            />
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
    </div>
  );
};
