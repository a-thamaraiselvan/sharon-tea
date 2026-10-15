import React from 'react';
import { Tag } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PhoneOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { FranchiseStatus, ContactStatus } from '../../types';

interface StatusBadgeProps {
  status: FranchiseStatus | ContactStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const normalized = (status || '').toLowerCase();

  switch (normalized) {
    case 'new':
      return (
        <Tag
          color="blue"
          icon={<ClockCircleOutlined />}
          className={`font-medium px-2.5 py-0.5 rounded-full ${className || ''}`}
        >
          New
        </Tag>
      );
    case 'contacted':
      return (
        <Tag
          color="orange"
          icon={<PhoneOutlined />}
          className={`font-medium px-2.5 py-0.5 rounded-full ${className || ''}`}
        >
          Contacted
        </Tag>
      );
    case 'under_review':
      return (
        <Tag
          color="purple"
          icon={<EyeOutlined />}
          className={`font-medium px-2.5 py-0.5 rounded-full ${className || ''}`}
        >
          Under Review
        </Tag>
      );
    case 'converted':
      return (
        <Tag
          color="green"
          icon={<CheckCircleOutlined />}
          className={`font-medium px-2.5 py-0.5 rounded-full ${className || ''}`}
        >
          Converted
        </Tag>
      );
    case 'closed':
      return (
        <Tag
          color="default"
          icon={<CloseCircleOutlined />}
          className={`font-medium px-2.5 py-0.5 rounded-full ${className || ''}`}
        >
          Closed
        </Tag>
      );
    default:
      return (
        <Tag className={`font-medium px-2.5 py-0.5 rounded-full ${className || ''}`}>
          {status}
        </Tag>
      );
  }
};
