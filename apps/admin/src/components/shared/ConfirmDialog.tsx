import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';

interface ConfirmDeleteOptions {
  title?: string;
  content?: React.ReactNode;
  onConfirm: () => Promise<void> | void;
  okText?: string;
  cancelText?: string;
}

export const showDeleteConfirm = ({
  title = 'Are you sure you want to delete this item?',
  content = 'This action cannot be undone.',
  onConfirm,
  okText = 'Delete',
  cancelText = 'Cancel',
}: ConfirmDeleteOptions) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined style={{ color: '#541424' }} />,
    content,
    okText,
    okType: 'danger',
    cancelText,
    okButtonProps: {
      style: {
        backgroundColor: '#541424',
        borderColor: '#541424',
      },
    },
    async onOk() {
      await onConfirm();
    },
  });
};

interface ConfirmActionOptions {
  title: string;
  content?: React.ReactNode;
  onConfirm: () => Promise<void> | void;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
}

export const showActionConfirm = ({
  title,
  content,
  onConfirm,
  okText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
}: ConfirmActionOptions) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined style={{ color: danger ? '#541424' : '#1C4C34' }} />,
    content,
    okText,
    okType: danger ? 'danger' : 'primary',
    cancelText,
    async onOk() {
      await onConfirm();
    },
  });
};
