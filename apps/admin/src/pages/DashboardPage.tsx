import React from 'react';
import { Card, Row, Col, Table, Button, Tag, Space, Typography, Skeleton } from 'antd';
import {
  CoffeeOutlined,
  ShoppingOutlined,
  TeamOutlined,
  MailOutlined,
  ArrowRightOutlined,
  WhatsAppOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PageHeader } from '../components/shared/PageHeader';
import { StatusBadge } from '../components/shared/StatusBadge';
import { AnimatedCount } from '../components/shared/AnimatedCount';
import { menuItemService } from '../services/menuItemService';
import { productService } from '../services/productService';
import { franchiseService } from '../services/franchiseService';
import { contactService } from '../services/contactService';
import { whatsappAnalyticsService } from '../services/whatsappAnalyticsService';
import { FranchiseEnquiry } from '../types';

const { Text } = Typography;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Queries
  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => menuItemService.getAll(),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const { data: franchiseEnquiries, isLoading: franchiseLoading } = useQuery({
    queryKey: ['franchiseEnquiries'],
    queryFn: () => franchiseService.list(),
  });

  const { data: contactEnquiries, isLoading: contactLoading } = useQuery({
    queryKey: ['contactEnquiries'],
    queryFn: () => contactService.list(),
  });

  const { data: whatsappData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['whatsappAnalytics', 'dashboard'],
    queryFn: () => whatsappAnalyticsService.getAnalytics(),
  });

  const totalMenuItems = menuItems?.length || 0;
  const totalProducts = products?.length || 0;
  const totalFranchise = franchiseEnquiries?.length || 0;
  const newFranchiseCount = franchiseEnquiries?.filter((e) => e.status === 'new').length || 0;
  const totalContact = contactEnquiries?.length || 0;
  const newContactCount = contactEnquiries?.filter((e) => e.status === 'new').length || 0;

  // Chart data: product clicks (memoized to prevent Recharts rerenders on unrelated state)
  const displayChartData = React.useMemo(() => {
    const raw = (whatsappData?.products || [])
      .slice(0, 7)
      .map((item) => ({
        name: item.productName.length > 15 ? `${item.productName.slice(0, 15)}...` : item.productName,
        clicks: item.totalClicks,
      }));

    if (raw.length > 0) return raw;

    return [
      { name: 'Sharon Special Tea', clicks: 124 },
      { name: 'Cardamom Premix', clicks: 88 },
      { name: 'Masala Chai Blend', clicks: 64 },
      { name: 'Ginger Tea Powder', clicks: 42 },
      { name: 'Kulhad Cups Set', clicks: 35 },
    ];
  }, [whatsappData?.products]);

  const recentFranchiseColumns = [
    {
      title: 'Business ID',
      dataIndex: 'businessId',
      key: 'businessId',
      render: (text: string) => <span className="font-mono text-xs font-semibold">{text}</span>,
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Budget',
      dataIndex: 'investmentBudget',
      key: 'investmentBudget',
      render: (budget: string) => <Tag color="gold">{budget}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, _record: FranchiseEnquiry) => (
        <Button
          type="link"
          size="small"
          onClick={() => navigate('/franchise-enquiries')}
          className="text-sharon-forest p-0"
        >
          View Details
        </Button>
      ),
    },
  ];

  const recentEnquiries = React.useMemo(
    () => (franchiseEnquiries || []).slice(0, 5),
    [franchiseEnquiries]
  );

  return (
    <div>
      <div>
        <PageHeader
          title="Sharon Tea Stall Overview"
          subtitle="Real-time monitor of menu offerings, packaged products, orders, and leads."
          extra={
            <Space>
              <Button
                icon={<WhatsAppOutlined />}
                onClick={() => navigate('/whatsapp-analytics')}
                className="border-sharon-forest text-sharon-forest"
              >
                Order Insights
              </Button>
            </Space>
          }
        />
      </div>

      {/* Stats Cards */}
      <div>
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <div className="h-full reveal-up is-visible delay-0">
              <Card
                hoverable
                className="border-amber-950/10 shadow-sm cursor-pointer hover:border-sharon-forest transition-all h-full hover-lift"
                onClick={() => navigate('/menu-items')}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Text className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                      Menu Items
                    </Text>
                    {menuLoading ? (
                      <Skeleton.Input active size="small" className="mt-2" />
                    ) : (
                      <div className="text-3xl font-bold font-display text-sharon-primary mt-1">
                        <AnimatedCount value={totalMenuItems} />
                      </div>
                    )}
                    <div className="mt-2 text-xs text-sharon-forest flex items-center gap-1 font-medium">
                      <span>Manage menu catalog</span>
                      <ArrowRightOutlined className="text-[10px]" />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-sharon-forest flex items-center justify-center text-xl">
                    <CoffeeOutlined />
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="h-full reveal-up is-visible delay-50">
              <Card
                hoverable
                className="border-amber-950/10 shadow-sm cursor-pointer hover:border-sharon-forest transition-all h-full hover-lift"
                onClick={() => navigate('/products')}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Text className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                      Packaged Products
                    </Text>
                    {productsLoading ? (
                      <Skeleton.Input active size="small" className="mt-2" />
                    ) : (
                      <div className="text-3xl font-bold font-display text-sharon-primary mt-1">
                        <AnimatedCount value={totalProducts} />
                      </div>
                    )}
                    <div className="mt-2 text-xs text-sharon-forest flex items-center gap-1 font-medium">
                      <span>WhatsApp direct catalog</span>
                      <ArrowRightOutlined className="text-[10px]" />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-sharon-chai flex items-center justify-center text-xl">
                    <ShoppingOutlined />
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="h-full reveal-up is-visible delay-100">
              <Card
                hoverable
                className="border-amber-950/10 shadow-sm cursor-pointer hover:border-sharon-forest transition-all h-full hover-lift"
                onClick={() => navigate('/franchise-enquiries')}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Text className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                        Franchise Leads
                      </Text>
                      {newFranchiseCount > 0 && (
                        <Tag color="red" className="m-0 text-[10px] px-1 py-0 font-bold">
                          {newFranchiseCount} NEW
                        </Tag>
                      )}
                    </div>
                    {franchiseLoading ? (
                      <Skeleton.Input active size="small" className="mt-2" />
                    ) : (
                      <div className="text-3xl font-bold font-display text-sharon-primary mt-1">
                        <AnimatedCount value={totalFranchise} />
                      </div>
                    )}
                    <div className="mt-2 text-xs text-sharon-forest flex items-center gap-1 font-medium">
                      <span>View applications</span>
                      <ArrowRightOutlined className="text-[10px]" />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl">
                    <TeamOutlined />
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="h-full reveal-up is-visible delay-150">
              <Card
                hoverable
                className="border-amber-950/10 shadow-sm cursor-pointer hover:border-sharon-forest transition-all h-full hover-lift"
                onClick={() => navigate('/contact-enquiries')}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Text className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                        Contact Messages
                      </Text>
                      {newContactCount > 0 && (
                        <Tag color="red" className="m-0 text-[10px] px-1 py-0 font-bold">
                          {newContactCount} NEW
                        </Tag>
                      )}
                    </div>
                    {contactLoading ? (
                      <Skeleton.Input active size="small" className="mt-2" />
                    ) : (
                      <div className="text-3xl font-bold font-display text-sharon-primary mt-1">
                        <AnimatedCount value={totalContact} />
                      </div>
                    )}
                    <div className="mt-2 text-xs text-sharon-forest flex items-center gap-1 font-medium">
                      <span>Customer feedback</span>
                      <ArrowRightOutlined className="text-[10px]" />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl">
                    <MailOutlined />
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      {/* Analytics Chart & Quick Links */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} lg={16}>
          <div className="h-full reveal-up is-visible delay-200">
            <Card
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WhatsAppOutlined className="text-green-600 text-lg" />
                    <span className="font-semibold text-gray-800">
                      WhatsApp Order Clicks by Product (Last 30 Days)
                    </span>
                  </div>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => navigate('/whatsapp-analytics')}
                    className="text-sharon-forest"
                  >
                    Full Report
                  </Button>
                </div>
              }
              className="border-amber-950/10 shadow-sm h-full chart-enter"
            >
              {analyticsLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <Skeleton active paragraph={{ rows: 5 }} />
                </div>
              ) : (
                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayChartData} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e9df" />
                      <XAxis
                        dataKey="name"
                        angle={-20}
                        textAnchor="end"
                        height={45}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#241C24',
                          color: '#FAF7F2',
                          borderRadius: '8px',
                          border: 'none',
                        }}
                        formatter={(value: number) => [`${value} Clicks`, 'Interest']}
                      />
                      <Bar
                        dataKey="clicks"
                        fill="#1C4C34"
                        radius={[6, 6, 0, 0]}
                        barSize={36}
                        isAnimationActive={true}
                        animationDuration={1000}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="h-full reveal-up is-visible delay-200">
            <Card
              title={
                <div className="flex items-center gap-2">
                  <RiseOutlined className="text-sharon-amber" />
                  <span className="font-semibold text-gray-800">Quick Operations</span>
                </div>
              }
              className="border-amber-950/10 shadow-sm h-full flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Button
                  block
                  className="text-left flex items-center justify-between h-12 px-4 rounded-lg border-gray-200 hover:border-sharon-forest hover:text-sharon-forest button-interaction hover-lift"
                  onClick={() => navigate('/menu-items')}
                >
                  <div className="flex items-center gap-3">
                    <CoffeeOutlined className="text-sharon-forest text-base" />
                    <span className="font-medium">Add New Menu Item</span>
                  </div>
                  <ArrowRightOutlined className="text-gray-400 text-xs" />
                </Button>

                <Button
                  block
                  className="text-left flex items-center justify-between h-12 px-4 rounded-lg border-gray-200 hover:border-sharon-forest hover:text-sharon-forest button-interaction hover-lift"
                  onClick={() => navigate('/products')}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingOutlined className="text-sharon-chai text-base" />
                    <span className="font-medium">Update Packaged Products</span>
                  </div>
                  <ArrowRightOutlined className="text-gray-400 text-xs" />
                </Button>

                <Button
                  block
                  className="text-left flex items-center justify-between h-12 px-4 rounded-lg border-gray-200 hover:border-sharon-forest hover:text-sharon-forest button-interaction hover-lift"
                  onClick={() => navigate('/hero-slides')}
                >
                  <div className="flex items-center gap-3">
                    <RiseOutlined className="text-sharon-amber text-base" />
                    <span className="font-medium">Manage Hero Banners</span>
                  </div>
                  <ArrowRightOutlined className="text-gray-400 text-xs" />
                </Button>

                <Button
                  block
                  className="text-left flex items-center justify-between h-12 px-4 rounded-lg border-gray-200 hover:border-sharon-forest hover:text-sharon-forest button-interaction hover-lift"
                  onClick={() => navigate('/outlets')}
                >
                  <div className="flex items-center gap-3">
                    <TeamOutlined className="text-blue-600 text-base" />
                    <span className="font-medium">Update Outlet Locations</span>
                  </div>
                  <ArrowRightOutlined className="text-gray-400 text-xs" />
                </Button>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong className="block mb-1 text-sm font-display text-sharon-rust">
                  Sharon WhatsApp Engine
                </strong>
                Order buttons on customer website automatically route users to WhatsApp with
                pre-filled product details. Monitor customer interest right from the analytics tab.
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Recent Franchise Enquiries */}
      <div className="reveal-up is-visible delay-200">
        <Card
          title={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">Recent Franchise Applications</span>
              <Button
                type="link"
                onClick={() => navigate('/franchise-enquiries')}
                className="text-sharon-forest p-0"
              >
                View All Applications
              </Button>
            </div>
          }
          className="border-amber-950/10 shadow-sm"
        >
          <Table
            dataSource={recentEnquiries}
            columns={recentFranchiseColumns}
            rowKey="id"
            pagination={false}
            loading={franchiseLoading}
            scroll={{ x: 600 }}
            locale={{ emptyText: 'No franchise enquiries yet' }}
          />
        </Card>
      </div>
    </div>
  );
};
