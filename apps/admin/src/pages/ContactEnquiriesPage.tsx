import React, { useState } from 'react';
import {
  Table,
  Button,
  Drawer,
  Space,
  Select,
  Input,
  Tabs,
  Descriptions,
  message,
  Tooltip,
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  SearchOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { PageHeader } from '../components/shared/PageHeader';
import { StatusBadge } from '../components/shared/StatusBadge';
import { showDeleteConfirm } from '../components/shared/ConfirmDialog';
import { contactService } from '../services/contactService';
import { ContactEnquiry, ContactStatus } from '../types';

const { TextArea } = Input;
const { Option } = Select;

export const ContactEnquiriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  // Query
  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ['contactEnquiries'],
    queryFn: () => contactService.list(),
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: ContactStatus; adminNotes?: string } }) =>
      contactService.update(id, data),
    onSuccess: (updated) => {
      message.success('Contact enquiry updated');
      queryClient.invalidateQueries({ queryKey: ['contactEnquiries'] });
      if (selectedEnquiry && selectedEnquiry.id === updated.id) {
        setSelectedEnquiry(updated);
        setNoteContent(updated.adminNotes || '');
      }
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update enquiry');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    onSuccess: () => {
      message.success('Enquiry deleted');
      queryClient.invalidateQueries({ queryKey: ['contactEnquiries'] });
      if (isDrawerOpen) setIsDrawerOpen(false);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to delete enquiry');
    },
  });

  const handleOpenDrawer = (record: ContactEnquiry) => {
    setSelectedEnquiry(record);
    setNoteContent(record.adminNotes || '');
    setIsDrawerOpen(true);
  };

  const handleSaveNotes = () => {
    if (!selectedEnquiry) return;
    updateMutation.mutate({
      id: selectedEnquiry.id,
      data: { adminNotes: noteContent },
    });
  };

  const handleStatusChange = (id: string, status: ContactStatus) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const handleDelete = (record: ContactEnquiry) => {
    showDeleteConfirm({
      title: `Delete message from ${record.name}?`,
      content: 'This will permanently remove the contact query.',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(record.id);
      },
    });
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q) ||
      (item.businessId && item.businessId.toLowerCase().includes(q))
    );
  });

  const columns = [
    {
      title: 'Business ID',
      dataIndex: 'businessId',
      key: 'businessId',
      width: 120,
      render: (id: string) => (
        <span className="font-mono text-xs font-bold text-sharon-forest">
          {id || 'CE-NEW'}
        </span>
      ),
    },
    {
      title: 'Sender',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ContactEnquiry) => (
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => <span className="text-xs text-gray-700">{phone}</span>,
    },
    {
      title: 'Message Preview',
      dataIndex: 'message',
      key: 'message',
      render: (msg: string) => (
        <span className="text-xs text-gray-600 line-clamp-1 max-w-xs">{msg}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: ContactStatus, record: ContactEnquiry) => (
        <Select
          value={status}
          size="small"
          className="w-28"
          onChange={(newStatus) => handleStatusChange(record.id, newStatus as ContactStatus)}
          onClick={(e) => e.stopPropagation()}
        >
          <Option value="new">New</Option>
          <Option value="contacted">Contacted</Option>
          <Option value="closed">Closed</Option>
        </Select>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (dateStr: string) => (
        <span className="text-xs text-gray-500">
          {dayjs(dateStr).format('DD MMM YYYY')}
        </span>
      ),
      sorter: (a: ContactEnquiry, b: ContactEnquiry) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: ContactEnquiry) => (
        <Space size="middle">
          <Tooltip title="View Message">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleOpenDrawer(record)}
              className="text-sharon-forest button-interaction hover-scale"
            />
          </Tooltip>
          <Tooltip title="Delete">
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

  const tabItems = [
    { key: 'all', label: `All (${enquiries.length})` },
    { key: 'new', label: `New (${enquiries.filter((e) => e.status === 'new').length})` },
    { key: 'contacted', label: `Contacted (${enquiries.filter((e) => e.status === 'contacted').length})` },
    { key: 'closed', label: `Closed (${enquiries.filter((e) => e.status === 'closed').length})` },
  ];

  return (
    <div>
      <div>
        <PageHeader
          title="Contact Enquiries"
          subtitle="Manage customer feedback, corporate catering enquiries, and general questions."
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-950/10 mb-6 reveal-down is-visible delay-50">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
          className="mb-2"
        />

        <div className="flex items-center justify-between">
          <Input
            placeholder="Search by sender name, phone, message content..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="max-w-md"
          />
          <span className="text-xs text-gray-500 font-medium">
            Found {filteredEnquiries.length} queries
          </span>
        </div>
      </div>

      <div className="reveal-up is-visible delay-100">
        <Table
          dataSource={filteredEnquiries}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          className="bg-white rounded-xl shadow-sm border border-amber-950/10 overflow-hidden"
        />
      </div>

      {/* Message Inspection Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between pr-4">
            <div>
              <span className="text-base font-bold font-display text-sharon-primary">
                Customer Message
              </span>
              <div className="text-xs text-gray-500">
                Ticket: {selectedEnquiry?.businessId || selectedEnquiry?.id}
              </div>
            </div>
            {selectedEnquiry && <StatusBadge status={selectedEnquiry.status} />}
          </div>
        }
        placement="right"
        width={500}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        rootClassName="drawer-enter"
      >
        {selectedEnquiry && (
          <div className="space-y-6">
            <Descriptions title="Sender Details" bordered size="small" column={1}>
              <Descriptions.Item label="Name">
                <span className="font-semibold text-gray-800">{selectedEnquiry.name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <a href={`mailto:${selectedEnquiry.email}`} className="text-blue-600 flex items-center gap-1">
                  <MailOutlined /> {selectedEnquiry.email}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <a href={`tel:${selectedEnquiry.phone}`} className="text-blue-600 flex items-center gap-1">
                  <PhoneOutlined /> {selectedEnquiry.phone}
                </a>
              </Descriptions.Item>
              {selectedEnquiry.subject && (
                <Descriptions.Item label="Subject">
                  {selectedEnquiry.subject}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Received On">
                {dayjs(selectedEnquiry.createdAt).format('DD MMMM YYYY, hh:mm A')}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">
                Message Content
              </h4>
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/60 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {selectedEnquiry.message}
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">
                Status
              </h4>
              <Select
                value={selectedEnquiry.status}
                onChange={(val) => handleStatusChange(selectedEnquiry.id, val as ContactStatus)}
                className="w-full"
              >
                <Option value="new">New Inquiry</Option>
                <Option value="contacted">Replied / Contacted</Option>
                <Option value="closed">Resolved & Closed</Option>
              </Select>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">
                Admin Notes & Response Log
              </h4>
              <TextArea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Record resolution notes, callback timestamps..."
                className="mb-2"
              />
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveNotes}
                loading={updateMutation.isPending}
                className="bg-sharon-forest hover:bg-emerald-800"
              >
                Save Notes
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
