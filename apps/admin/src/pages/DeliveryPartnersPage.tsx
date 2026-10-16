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
  RocketOutlined,
  SearchOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../components/shared/PageHeader';
import { showDeleteConfirm } from '../components/shared/ConfirmDialog';
import {
  deliveryPartnerService,
  FALLBACK_DELIVERY_PARTNERS,
} from '../services/deliveryPartnerService';
import { DeliveryPartner, CreateDeliveryPartnerInput } from '../types';
import { resolveImageUrl } from '../utils/imageUrl';

const { TextArea } = Input;

const deliveryPartnerSchema = z.object({
  name: z.string().min(2, 'Partner name is required'),
  slug: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
  partnerUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
  badgeText: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

type DeliveryPartnerFormData = z.infer<typeof deliveryPartnerSchema>;

export const DeliveryPartnersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<DeliveryPartner | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeliveryPartnerFormData>({
    resolver: zodResolver(deliveryPartnerSchema),
    defaultValues: {
      name: '',
      slug: '',
      logoUrl: '',
      partnerUrl: '',
      badgeText: '',
      description: '',
      sortOrder: 0,
      isActive: true,
    },
  });

  // Query
  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['deliveryPartners'],
    queryFn: () => deliveryPartnerService.getAll(),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateDeliveryPartnerInput) => deliveryPartnerService.create(data),
    onSuccess: () => {
      message.success('Delivery partner created successfully');
      queryClient.invalidateQueries({ queryKey: ['deliveryPartners'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to create delivery partner');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDeliveryPartnerInput> }) =>
      deliveryPartnerService.update(id, data),
    onSuccess: () => {
      message.success('Delivery partner updated successfully');
      queryClient.invalidateQueries({ queryKey: ['deliveryPartners'] });
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update delivery partner');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deliveryPartnerService.delete(id),
    onSuccess: () => {
      message.success('Delivery partner deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['deliveryPartners'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to delete delivery partner');
    },
  });

  // Bulk Delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => deliveryPartnerService.bulkDelete(ids),
    onSuccess: () => {
      message.success(`Successfully deleted ${selectedRowKeys.length} delivery partners`);
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ['deliveryPartners'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to bulk delete delivery partners');
    },
  });

  // Toggle active status
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      deliveryPartnerService.toggleActive(id, isActive),
    onSuccess: () => {
      message.success('Partner status updated');
      queryClient.invalidateQueries({ queryKey: ['deliveryPartners'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to change partner status');
    },
  });

  const handleOpenCreate = () => {
    setEditingPartner(null);
    reset({
      name: '',
      slug: '',
      logoUrl: '',
      partnerUrl: '',
      badgeText: '',
      description: '',
      sortOrder: partners.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (partner: DeliveryPartner) => {
    setEditingPartner(partner);
    reset({
      name: partner.name,
      slug: partner.slug,
      logoUrl: partner.logoUrl || partner.logo_url || '',
      partnerUrl: partner.partnerUrl || partner.partner_url || '',
      badgeText: partner.badgeText || partner.badge_text || '',
      description: partner.description || '',
      sortOrder: partner.sortOrder,
      isActive: partner.isActive,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPartner(null);
    reset();
  };

  const handleApplyPreset = (preset: typeof FALLBACK_DELIVERY_PARTNERS[number]) => {
    setValue('name', preset.name);
    setValue('slug', preset.slug);
    setValue('logoUrl', preset.logoUrl || '');
    setValue('partnerUrl', preset.partnerUrl || '');
    setValue('badgeText', preset.badgeText || '');
    setValue('description', preset.description || '');
    setValue('sortOrder', preset.sortOrder);
    setValue('isActive', true);
  };

  const onSubmit = (formData: DeliveryPartnerFormData) => {
    const payload: CreateDeliveryPartnerInput = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      logoUrl: formData.logoUrl || undefined,
      partnerUrl: formData.partnerUrl || undefined,
      badgeText: formData.badgeText || undefined,
      description: formData.description || undefined,
      sortOrder: Number(formData.sortOrder) || 0,
      isActive: formData.isActive,
    };

    if (editingPartner) {
      updateMutation.mutate({ id: editingPartner.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (partner: DeliveryPartner) => {
    showDeleteConfirm({
      title: `Delete delivery partner "${partner.name}"?`,
      content: 'This will remove the delivery integration from Sharon ordering channels. Are you sure?',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(partner.id);
      },
    });
  };

  const handleBulkDelete = () => {
    showDeleteConfirm({
      title: `Delete ${selectedRowKeys.length} selected delivery partners?`,
      content: 'Are you sure you want to permanently delete all selected delivery partners?',
      onConfirm: async () => {
        await bulkDeleteMutation.mutateAsync(selectedRowKeys as string[]);
      },
    });
  };

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      width: 80,
      render: (url: string | null | undefined, record: DeliveryPartner) => {
        const logo = url || record.logo_url;
        return (
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-gray-200 p-1 shadow-xs">
            {logo ? (
              <Image src={resolveImageUrl(logo)} alt={record.name} width={40} height={40} className="object-contain" />
            ) : (
              <RocketOutlined className="text-gray-400 text-lg" />
            )}
          </div>
        );
      },
    },
    {
      title: 'Partner Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DeliveryPartner) => (
        <div>
          <span className="font-semibold text-gray-900 text-sm">{text}</span>
          {record.slug && (
            <span className="block text-xs text-gray-400 mt-0.5 font-mono">slug: {record.slug}</span>
          )}
        </div>
      ),
    },
    {
      title: 'Ordering Link',
      dataIndex: 'partnerUrl',
      key: 'partnerUrl',
      render: (url: string | null | undefined, record: DeliveryPartner) => {
        const link = url || record.partner_url;
        if (!link) return <span className="text-xs text-gray-400">Not configured</span>;
        return (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-medium truncate max-w-xs"
          >
            <GlobalOutlined /> {link}
          </a>
        );
      },
    },
    {
      title: 'Badge / Highlight',
      dataIndex: 'badgeText',
      key: 'badgeText',
      width: 140,
      render: (text: string | null | undefined, record: DeliveryPartner) => {
        const badge = text || record.badge_text;
        return badge ? (
          <Tag color="orange" className="font-semibold px-2 py-0.5 rounded-full text-xs">
            {badge}
          </Tag>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        );
      },
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 90,
      render: (val: number) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean, record: DeliveryPartner) => (
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
      width: 110,
      render: (_: unknown, record: DeliveryPartner) => (
        <Space size="middle">
          <Tooltip title="Edit Partner">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
              className="text-blue-600 hover:text-blue-700 button-interaction hover-scale"
            />
          </Tooltip>
          <Tooltip title="Delete Partner">
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
          title="Delivery Partners & Vendors"
          subtitle="Manage online food delivery aggregator integrations (Swiggy, Zomato, etc.)"
          actionLabel="Add Delivery Partner"
          actionIcon={<PlusOutlined />}
          onAction={handleOpenCreate}
        />
      </div>

      {/* Quick Presets Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200/80 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
            Quick Add Vendors:
          </span>
          <Button
            size="small"
            className="border-orange-500 text-orange-600 hover:bg-orange-50 font-medium"
            onClick={() => {
              handleOpenCreate();
              setTimeout(() => handleApplyPreset(FALLBACK_DELIVERY_PARTNERS[0]), 50);
            }}
          >
            + Swiggy Preset
          </Button>
          <Button
            size="small"
            className="border-red-500 text-red-600 hover:bg-red-50 font-medium"
            onClick={() => {
              handleOpenCreate();
              setTimeout(() => handleApplyPreset(FALLBACK_DELIVERY_PARTNERS[1]), 50);
            }}
          >
            + Zomato Preset
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search delivery partners..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="w-full sm:w-64"
          />
          <div className="text-xs text-gray-500 font-medium shrink-0">
            {filteredPartners.length} {filteredPartners.length === 1 ? 'partner' : 'partners'}
          </div>
        </div>
      </div>

      {/* Bulk action toolbar */}
      {selectedRowKeys.length > 0 && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
          <span className="text-sm font-semibold text-emerald-900">
            {selectedRowKeys.length} {selectedRowKeys.length === 1 ? 'partner' : 'partners'} selected
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
          dataSource={filteredPartners}
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
        title={editingPartner ? 'Edit Delivery Partner' : 'Add New Delivery Partner'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        centered
        width={580}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Partner Name <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. Swiggy, Zomato, Dunzo"
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
                Slug (Optional)
              </label>
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="e.g. swiggy (auto-generated if empty)" />
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Logo URL / Icon Link
            </label>
            <Controller
              name="logoUrl"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <Input
                  {...rest}
                  value={value || ''}
                  onChange={onChange}
                  placeholder="https://.../swiggy_logo.png"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Partner Order Link (Outlet Page URL)
            </label>
            <Controller
              name="partnerUrl"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <Input
                  {...rest}
                  value={value || ''}
                  onChange={onChange}
                  placeholder="https://www.swiggy.com/restaurants/sharon-tea-stall-..."
                  status={errors.partnerUrl ? 'error' : ''}
                />
              )}
            />
            {errors.partnerUrl && (
              <span className="text-xs text-red-500 mt-1 block">{errors.partnerUrl.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Badge / ETA Highlight
              </label>
              <Controller
                name="badgeText"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <Input
                    {...rest}
                    value={value || ''}
                    onChange={onChange}
                    placeholder="e.g. 30 Mins • Live Tracking"
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
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <TextArea
                  {...rest}
                  value={value || ''}
                  onChange={onChange}
                  rows={3}
                  placeholder="Order fresh Sharon Tea & Coffee on your favorite delivery app..."
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
                <div className="pt-1 flex items-center gap-2">
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                  <span className="text-xs text-gray-500">
                    Controls if partner is displayed across website delivery badges
                  </span>
                </div>
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
              {editingPartner ? 'Save Changes' : 'Create Partner'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DeliveryPartnersPage;
