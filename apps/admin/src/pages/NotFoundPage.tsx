import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist in Sharon Admin."
        extra={
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            className="bg-sharon-forest hover:bg-emerald-800"
          >
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
};
