import React from 'react';
import { Button, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  actionButton?: React.ReactNode;
  extra?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actionLabel,
  actionIcon,
  onAction,
  actionButton,
  extra,
}) => {
  return (
    <div className="mb-6 pb-4 border-b border-amber-950/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb
            className="mb-2 text-xs"
            items={breadcrumbs.map((b) => ({
              title: b.path ? <Link to={b.path}>{b.label}</Link> : b.label,
            }))}
          />
        )}
        <h1 className="text-2xl font-bold tracking-tight text-sharon-primary m-0 font-display">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1 m-0">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {extra}
        {actionButton}
        {actionLabel && onAction && (
          <Button
            type="primary"
            icon={actionIcon}
            onClick={onAction}
            className="bg-sharon-forest hover:bg-emerald-800 border-none shadow-sm h-9 px-4 font-medium"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
