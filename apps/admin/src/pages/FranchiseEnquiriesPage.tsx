import React, { useState } from 'react';
import {
  Table,
  Button,
  Drawer,
  Tag,
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
  EnvironmentOutlined,
  SearchOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { PageHeader } from '../components/shared/PageHeader';
import { StatusBadge } from '../components/shared/StatusBadge';
import { showDeleteConfirm } from '../components/shared/ConfirmDialog';
import { franchiseService } from '../services/franchiseService';
import { FranchiseEnquiry, FranchiseStatus } from '../types';

const { TextArea } = Input;
const { Option } = Select;

export const FranchiseEnquiriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<FranchiseEnquiry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  // Queries
  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ['franchiseEnquiries'],
    queryFn: () => franchiseService.list(),
  });

  // Update Status / Notes Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: FranchiseStatus; adminNotes?: string } }) =>
      franchiseService.update(id, data),
    onSuccess: (updated) => {
      message.success('Enquiry updated successfully');
      queryClient.invalidateQueries({ queryKey: ['franchiseEnquiries'] });
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
    mutationFn: (id: string) => franchiseService.delete(id),
    onSuccess: () => {
      message.success('Enquiry deleted');
      queryClient.invalidateQueries({ queryKey: ['franchiseEnquiries'] });
      if (isDrawerOpen) setIsDrawerOpen(false);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to delete enquiry');
    },
  });

  const handleOpenDrawer = (record: FranchiseEnquiry) => {
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

  const handleStatusChange = (id: string, status: FranchiseStatus) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const handleDelete = (record: FranchiseEnquiry) => {
    showDeleteConfirm({
      title: `Delete Franchise Enquiry ${record.businessId || record.fullName}?`,
      content: 'This will permanently remove the candidate application record.',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(record.id);
      },
    });
  };

  // Filter items
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.fullName.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      (item.businessId && item.businessId.toLowerCase().includes(q))
    );
  });

  const columns = [
    {
      title: 'Business ID',
      dataIndex: 'businessId',
      key: 'businessId',
      width: 130,
      render: (id: string) => (
        <span className="font-mono text-xs font-bold text-sharon-forest">
          {id || 'FE-PENDING'}
        </span>
      ),
    },
    {
      title: 'Applicant',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name: string, record: FranchiseEnquiry) => (
        <div>
          <div className="font-semibold text-sharon-primary">{name}</div>
          <div className="text-xs text-gray-500">{record.phone}</div>
        </div>
      ),
    },
    {
      title: 'City / State',
      dataIndex: 'city',
      key: 'city',
      render: (city: string, record: FranchiseEnquiry) => (
        <span>{record.state ? `${city}, ${record.state}` : city}</span>
      ),
    },
    {
      title: 'Budget',
      dataIndex: 'investmentBudget',
      key: 'investmentBudget',
      render: (budget: string) => <Tag color="gold" className="font-medium">{budget}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: FranchiseStatus, record: FranchiseEnquiry) => (
        <Select
          value={status}
          size="small"
          className="w-32"
          onChange={(newStatus) => handleStatusChange(record.id, newStatus as FranchiseStatus)}
          onClick={(e) => e.stopPropagation()}
        >
          <Option value="new">New</Option>
          <Option value="contacted">Contacted</Option>
          <Option value="under_review">Under Review</Option>
          <Option value="converted">Converted</Option>
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
      sorter: (a: FranchiseEnquiry, b: FranchiseEnquiry) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: FranchiseEnquiry) => (
        <Space size="middle">
          <Tooltip title="View Candidate Profile">
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
    { key: 'under_review', label: `Under Review (${enquiries.filter((e) => e.status === 'under_review').length})` },
    { key: 'converted', label: `Converted (${enquiries.filter((e) => e.status === 'converted').length})` },
    { key: 'closed', label: `Closed (${enquiries.filter((e) => e.status === 'closed').length})` },
  ];

  return (
    <div>
      <div>
        <PageHeader
          title="Franchise Enquiries"
          subtitle="Manage investor applications, candidate evaluations, and store allotment workflows."
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200/80 mb-6 reveal-down is-visible delay-50">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
          className="mb-2"
        />

        <div className="flex items-center justify-between">
          <Input
            placeholder="Search by name, phone, city, or ID..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="max-w-md"
          />
          <span className="text-xs text-gray-500 font-medium">
            Found {filteredEnquiries.length} leads
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
          className="bg-white rounded-xl shadow-sm border border-neutral-200/80 overflow-hidden"
        />
      </div>

      {/* Candidate Details Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between pr-4">
            <div>
              <span className="text-base font-bold font-display text-sharon-primary">
                Franchise Candidate Details
              </span>
              <div className="text-xs text-gray-500">
                Application ID: {selectedEnquiry?.businessId || selectedEnquiry?.id}
              </div>
            </div>
            {selectedEnquiry && <StatusBadge status={selectedEnquiry.status} />}
          </div>
        }
        placement="right"
        width={560}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        rootClassName="drawer-enter"
      >
        {selectedEnquiry && (
          <div className="space-y-6">
            <Descriptions title="Personal & Contact Information" bordered size="small" column={1}>
              <Descriptions.Item label="Full Name">
                <span className="font-semibold text-gray-800">{selectedEnquiry.fullName}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                <a href={`tel:${selectedEnquiry.phone}`} className="text-blue-600 flex items-center gap-1">
                  <PhoneOutlined /> {selectedEnquiry.phone}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Email Address">
                <a href={`mailto:${selectedEnquiry.email}`} className="text-blue-600 flex items-center gap-1">
                  <MailOutlined /> {selectedEnquiry.email}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Target Location">
                <span className="flex items-center gap-1">
                  <EnvironmentOutlined /> {selectedEnquiry.city}
                  {selectedEnquiry.state ? `, ${selectedEnquiry.state}` : ''}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Planned Investment Budget">
                <Tag color="gold" className="font-bold text-sm">
                  {selectedEnquiry.investmentBudget}
                </Tag>
              </Descriptions.Item>
              {selectedEnquiry.currentOccupation && (
                <Descriptions.Item label="Current Occupation / Business">
                  {selectedEnquiry.currentOccupation}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Submission Date">
                {dayjs(selectedEnquiry.createdAt).format('DD MMMM YYYY, hh:mm A')}
              </Descriptions.Item>
            </Descriptions>

            {selectedEnquiry.message && (
              <div>
                <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">
                  Applicant Message / Motivation
                </h4>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedEnquiry.message}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">
                Workflow Status
              </h4>
              <Select
                value={selectedEnquiry.status}
                onChange={(val) => handleStatusChange(selectedEnquiry.id, val as FranchiseStatus)}
                className="w-full"
              >
                <Option value="new">New Application</Option>
                <Option value="contacted">Candidate Contacted</Option>
                <Option value="under_review">Document Review & Site Audit</Option>
                <Option value="converted">Allotted / Franchisee Onboarded</Option>
                <Option value="closed">Closed / Not Suitable</Option>
              </Select>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">
                Internal Sharon Admin Notes
              </h4>
              <TextArea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Log discussion notes, site feasibility notes, verification checklist..."
                className="mb-2"
              />
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveNotes}
                loading={updateMutation.isPending}
                className="bg-sharon-forest hover:bg-emerald-800"
              >
                Save Internal Notes
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
