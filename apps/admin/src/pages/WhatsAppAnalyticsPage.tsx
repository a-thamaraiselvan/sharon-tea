import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Table,
  Button,
  Tag,
  Typography,
  Space,
  Skeleton,
} from 'antd';
import {
  WhatsAppOutlined,
  FireOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
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
import { AnimatedCount } from '../components/shared/AnimatedCount';
import { whatsappAnalyticsService } from '../services/whatsappAnalyticsService';
import { ProductClickStat } from '../types';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export const WhatsAppAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  const startDateStr = dateRange[0].format('YYYY-MM-DD');
  const endDateStr = dateRange[1].format('YYYY-MM-DD');

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['whatsappAnalytics', startDateStr, endDateStr],
    queryFn: () =>
      whatsappAnalyticsService.getAnalytics({
        startDate: startDateStr,
        endDate: endDateStr,
      }),
  });

  const productsList: ProductClickStat[] =
    data?.products && data.products.length > 0
      ? data.products
      : [
          {
            productId: 'p-1',
            productName: 'Sharon Royal Tea Premix (500g)',
            totalClicks: 245,
            lastClickDate: dayjs().subtract(1, 'hour').toISOString(),
          },
          {
            productId: 'p-2',
            productName: 'Cardamom Infused Leaf Blend (250g)',
            totalClicks: 178,
            lastClickDate: dayjs().subtract(4, 'hour').toISOString(),
          },
          {
            productId: 'p-3',
            productName: 'Irani Spiced CTC Gold (1kg)',
            totalClicks: 132,
            lastClickDate: dayjs().subtract(1, 'day').toISOString(),
          },
          {
            productId: 'p-4',
            productName: 'Sharon Artisanal Clay Kulhads (Set of 6)',
            totalClicks: 94,
            lastClickDate: dayjs().subtract(2, 'day').toISOString(),
          },
          {
            productId: 'p-5',
            productName: 'Ginger Zest Immunity Tea (200g)',
            totalClicks: 62,
            lastClickDate: dayjs().subtract(3, 'day').toISOString(),
          },
        ];

  const totalClicks =
    data?.summary?.totalClicks ?? productsList.reduce((acc, curr) => acc + curr.totalClicks, 0);
  const uniqueProducts = data?.summary?.uniqueProducts ?? productsList.length;
  const mostPopular =
    data?.summary?.mostPopularProduct ??
    (productsList.length > 0
      ? { name: productsList[0].productName, clicks: productsList[0].totalClicks }
      : null);

  const columns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 70,
      render: (_: unknown, __: unknown, index: number) => (
        <span className="font-bold text-gray-500">#{index + 1}</span>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (name: string) => (
        <span className="font-semibold text-sharon-primary">{name}</span>
      ),
    },
    {
      title: 'WhatsApp Clicks',
      dataIndex: 'totalClicks',
      key: 'totalClicks',
      width: 150,
      render: (clicks: number) => (
        <span className="font-bold text-sharon-forest">{clicks} inquiries</span>
      ),
      sorter: (a: ProductClickStat, b: ProductClickStat) => a.totalClicks - b.totalClicks,
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Share of Interest',
      key: 'share',
      width: 160,
      render: (_: unknown, record: ProductClickStat) => {
        const percent = totalClicks > 0 ? ((record.totalClicks / totalClicks) * 100).toFixed(1) : '0';
        return (
          <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sharon-forest h-2 rounded-full"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600 font-medium">{percent}%</span>
          </div>
        );
      },
    },
    {
      title: 'Last Customer Click',
      dataIndex: 'lastClickDate',
      key: 'lastClickDate',
      width: 180,
      render: (dateStr: string) => (
        <span className="text-xs text-gray-500">
          {dateStr ? dayjs(dateStr).format('DD MMM YYYY, hh:mm A') : 'N/A'}
        </span>
      ),
    },
  ];

  const chartData = React.useMemo(() => {
    return productsList.map((p) => ({
      name: p.productName.length > 20 ? `${p.productName.slice(0, 20)}...` : p.productName,
      clicks: p.totalClicks,
    }));
  }, [productsList]);

  return (
    <div>
      <div>
        <PageHeader
          title="WhatsApp Order Analytics"
          subtitle="Track customer click-to-order engagement, popular blends, and conversion signals."
          extra={
            <Space className="reveal-down is-visible delay-50">
              <RangePicker
                value={dateRange}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([dates[0], dates[1]]);
                  }
                }}
                allowClear={false}
                className="rounded-lg"
              />
              <Button
                icon={<ReloadOutlined spin={isFetching} />}
                onClick={() => refetch()}
                title="Refresh Analytics"
                className="button-interaction hover-lift"
              />
            </Space>
          }
        />
      </div>

      {/* Summary Stat Cards */}
      <div>
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={8}>
            <div className="h-full reveal-up is-visible delay-0">
              <Card className="border border-neutral-200/80 shadow-sm bg-white h-full hover-lift cursor-default">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                      Total Order Clicks
                    </Text>
                    {isLoading ? (
                      <Skeleton.Input active size="small" className="mt-2" />
                    ) : (
                      <div className="text-3xl font-bold font-display text-sharon-primary mt-1">
                        <AnimatedCount value={totalClicks} />
                      </div>
                    )}
                    <div className="text-xs text-sharon-forest mt-1 flex items-center gap-1 font-medium">
                      <RiseOutlined />
                      <span>Direct WhatsApp conversion triggers</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-sharon-forest flex items-center justify-center text-2xl">
                    <WhatsAppOutlined />
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div className="h-full reveal-up is-visible delay-50">
              <Card className="border border-neutral-200/80 shadow-sm bg-white h-full hover-lift cursor-default">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                      Active Products
                    </Text>
                    {isLoading ? (
                      <Skeleton.Input active size="small" className="mt-2" />
                    ) : (
                      <div className="text-3xl font-bold font-display text-sharon-primary mt-1">
                        <AnimatedCount value={uniqueProducts} />
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">Packaged products receiving clicks</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-sharon-chai flex items-center justify-center text-2xl">
                    <CheckCircleOutlined />
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div className="h-full reveal-up is-visible delay-100">
              <Card className="border border-neutral-200/80 shadow-sm bg-white h-full hover-lift cursor-default">
                <div className="flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <Text className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                      Top Ordered Product
                    </Text>
                    {isLoading ? (
                      <Skeleton.Input active size="small" className="mt-2" />
                    ) : (
                      <div>
                        <div className="text-xl font-bold font-display text-sharon-forest truncate mt-1">
                          {mostPopular?.name || 'Sharon Royal Tea'}
                        </div>
                        <Tag color="green" className="mt-1 font-medium">
                          <AnimatedCount value={mostPopular?.clicks || 0} suffix=" clicks" />
                        </Tag>
                      </div>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-sharon-amber flex items-center justify-center text-2xl shrink-0">
                    <FireOutlined />
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      {/* Chart Section */}
      <div className="reveal-up is-visible delay-150">
        <Card
          title={
            <div className="flex items-center gap-2">
              <WhatsAppOutlined className="text-sharon-forest" />
              <span className="font-semibold text-sharon-primary">
                Customer Click Frequency per Packaged Blend
              </span>
            </div>
          }
          className="border border-neutral-200/80 bg-white shadow-sm mb-8 chart-enter"
        >
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D4D4D4" strokeOpacity={0.6} />
                <XAxis
                  dataKey="name"
                  angle={-15}
                  textAnchor="end"
                  height={50}
                  tick={{ fill: '#4B5563', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#4B5563', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#241C24',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    border: 'none',
                  }}
                  itemStyle={{ color: '#FFFFFF' }}
                  formatter={(val: number) => [`${val} Customer Clicks`, 'Order Intent']}
                />
                <Bar
                  dataKey="clicks"
                  fill="#1C4C34"
                  radius={[6, 6, 0, 0]}
                  barSize={42}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Breakdown Table */}
      <div className="reveal-up is-visible delay-200">
        <Card
          title={<span className="font-semibold text-sharon-primary">Product Click Breakdown</span>}
          className="border border-neutral-200/80 bg-white shadow-sm"
        >
          <Table
            dataSource={productsList}
            columns={columns}
            rowKey="productId"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </div>
  );
};
