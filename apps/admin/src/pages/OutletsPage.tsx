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
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/shared/PageHeader';
import { ImageUpload } from '../components/shared/ImageUpload';
import { showDeleteConfirm } from '../components/shared/ConfirmDialog';
import { outletService } from '../services/outletService';
import { Outlet, CreateOutletInput } from '../types';

const { TextArea } = Input;

const outletSchema = z.object({
  name: z.string().min(2, 'Outlet name must be at least 2 characters'),
  slug: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(8, 'Phone number is required'),
  operatingHours: z.string().min(3, 'Operating hours are required'),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  googleMapsUrl: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

type OutletFormData = z.infer<typeof outletSchema>;

export const OutletsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);

  // Queries
  const { data: outlets = [], isLoading } = useQuery({
    queryKey: ['outlets'],
    queryFn: () => outletService.getAll(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OutletFormData>({
    resolver: zodResolver(outletSchema),
    defaultValues: {
      name: '',
      slug: '',
      address: '',
      phone: '',
      operatingHours: '6:00 AM - 11:00 PM Daily',
      latitude: null,
      longitude: null,
      googleMapsUrl: '',
      imageUrl: null,
      isActive: true,
      sortOrder: 0,
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateOutletInput) => outletService.create(data),
    onSuccess: () => {
      message.success('Outlet created successfully');
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to create outlet');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateOutletInput> }) =>
      outletService.update(id, data),
    onSuccess: () => {
      message.success('Outlet updated successfully');
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update outlet');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => outletService.delete(id),
    onSuccess: () => {
      message.success('Outlet deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to delete outlet');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      outletService.toggleActive(id, isActive),
    onSuccess: () => {
      message.success('Outlet status updated');
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update outlet status');
    },
  });

  const handleOpenCreate = () => {
    setEditingOutlet(null);
    reset({
      name: '',
      slug: '',
      address: '',
      phone: '+91 ',
      operatingHours: '6:00 AM - 11:00 PM Daily',
      latitude: null,
      longitude: null,
      googleMapsUrl: '',
      imageUrl: null,
      isActive: true,
      sortOrder: outlets.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (outlet: Outlet) => {
    setEditingOutlet(outlet);
    reset({
      name: outlet.name,
      slug: outlet.slug,
      address: outlet.address,
      phone: outlet.phone,
      operatingHours: outlet.operatingHours,
      latitude: outlet.latitude ?? null,
      longitude: outlet.longitude ?? null,
      googleMapsUrl: outlet.googleMapsUrl || '',
      imageUrl: outlet.imageUrl || null,
      isActive: outlet.isActive,
      sortOrder: outlet.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOutlet(null);
    reset();
  };

  const onSubmit = (formData: OutletFormData) => {
    const payload: CreateOutletInput = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      address: formData.address,
      phone: formData.phone,
      operatingHours: formData.operatingHours,
      latitude: formData.latitude ?? null,
      longitude: formData.longitude ?? null,
      googleMapsUrl: formData.googleMapsUrl || undefined,
      imageUrl: formData.imageUrl || undefined,
      isActive: formData.isActive,
      sortOrder: Number(formData.sortOrder) || 0,
    };

    if (editingOutlet) {
      updateMutation.mutate({ id: editingOutlet.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (outlet: Outlet) => {
    showDeleteConfirm({
      title: `Delete outlet "${outlet.name}"?`,
      content: 'This will remove the stall location from public listings.',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(outlet.id);
      },
    });
  };

  const columns = [
    {
      title: 'Store Photo',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (url: string | null) => (
        <div className="w-14 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
          {url ? (
            <Image src={url} alt="Store" width={56} height={48} className="object-cover" />
          ) : (
            <EnvironmentOutlined className="text-gray-400 text-lg" />
          )}
        </div>
      ),
    },
    {
      title: 'Outlet Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Outlet) => (
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <EnvironmentOutlined className="text-sharon-forest" />
            <span className="line-clamp-1">{record.address}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => (
        <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
          <PhoneOutlined /> {phone}
        </span>
      ),
    },
    {
      title: 'Operating Hours',
      dataIndex: 'operatingHours',
      key: 'operatingHours',
      render: (hours: string) => (
        <span className="text-xs text-gray-600 flex items-center gap-1">
          <ClockCircleOutlined /> {hours}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean, record: Outlet) => (
        <Switch
          checked={isActive}
          loading={toggleStatusMutation.isPending}
          onChange={(checked) =>
            toggleStatusMutation.mutate({ id: record.id, isActive: checked })
          }
          checkedChildren="Open"
          unCheckedChildren="Closed"
        />
      ),
    },
    {
      title: 'Map',
      key: 'map',
      width: 70,
      render: (_: unknown, record: Outlet) =>
        record.googleMapsUrl ? (
          <Tooltip title="View on Google Maps">
            <a
              href={record.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-900 text-base"
            >
              <CompassOutlined />
            </a>
          </Tooltip>
        ) : (
          <span className="text-gray-300">-</span>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      render: (_: unknown, record: Outlet) => (
        <Space size="middle">
          <Tooltip title="Edit Outlet">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
              className="text-blue-600 hover:text-blue-700 button-interaction hover-scale"
            />
          </Tooltip>
          <Tooltip title="Delete Outlet">
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
          title="Outlets & Locations"
          subtitle="Manage official Sharon Tea and Coffee flagship stalls, kiosk units, and coordinates."
          actionLabel="Add Outlet"
          actionIcon={<PlusOutlined />}
          onAction={handleOpenCreate}
        />
      </div>

      <div className="reveal-up is-visible delay-100">
        <Table
          dataSource={outlets}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          className="bg-white rounded-xl shadow-sm border border-amber-950/10 overflow-hidden"
        />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        title={editingOutlet ? 'Edit Outlet Details' : 'Add New Sharon Outlet'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        centered
        width={640}
        rootClassName="modal-enter"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Outlet Name <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. Sharon Tea and Coffee - Anna Nagar"
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
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="+91 98765 43210"
                    status={errors.phone ? 'error' : ''}
                  />
                )}
              />
              {errors.phone && (
                <span className="text-xs text-red-500 mt-1 block">{errors.phone.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Physical Address <span className="text-red-500">*</span>
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={2}
                  placeholder="Street address, landmark, area, pincode..."
                  status={errors.address ? 'error' : ''}
                />
              )}
            />
            {errors.address && (
              <span className="text-xs text-red-500 mt-1 block">{errors.address.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Operating Hours <span className="text-red-500">*</span>
              </label>
              <Controller
                name="operatingHours"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. 6:00 AM - 11:00 PM (All 7 Days)"
                    status={errors.operatingHours ? 'error' : ''}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Google Maps Link
              </label>
              <Controller
                name="googleMapsUrl"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <Input
                    {...rest}
                    value={value || ''}
                    onChange={onChange}
                    placeholder="https://maps.google.com/?q=..."
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Latitude</label>
              <Controller
                name="latitude"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    step={0.00001}
                    className="w-full"
                    placeholder="13.0827"
                    value={field.value ?? undefined}
                    onChange={(val) => field.onChange(val ?? null)}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Longitude</label>
              <Controller
                name="longitude"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    step={0.00001}
                    className="w-full"
                    placeholder="80.2707"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Storefront Photo
              </label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    aspectRatioLabel="Recommended: 16:9 landscape store photo"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Store Operational Status
              </label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      checkedChildren="Open & Serving"
                      unCheckedChildren="Temporarily Closed"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Controls if this location shows on the customer store finder
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
              {editingOutlet ? 'Save Outlet' : 'Add Outlet'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
