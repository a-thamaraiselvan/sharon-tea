import React, { useState } from 'react';
import { Upload, message, Button, Image } from 'antd';
import { UploadOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import { uploadService } from '../../services/uploadService';
import { resolveImageUrl } from '../../utils/imageUrl';

interface ImageUploadProps {
  value?: string | null;
  onChange?: (url: string | null) => void;
  aspectRatioLabel?: string;
  maxSizeMB?: number;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  aspectRatioLabel = 'Recommended: 1:1 or 16:9, max 5MB',
  maxSizeMB = 5,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files (JPG, PNG, WebP)!');
      return false;
    }
    const isLtMax = file.size / 1024 / 1024 < maxSizeMB;
    if (!isLtMax) {
      message.error(`Image must be smaller than ${maxSizeMB}MB!`);
      return false;
    }
    return true;
  };

  const handleCustomUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    setLoading(true);
    try {
      const result = await uploadService.uploadImage(file as File);
      setLoading(false);
      if (onChange) {
        onChange(result.url);
      }
      if (onSuccess) onSuccess(result);
      message.success('Image uploaded successfully');
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Image upload failed';
      message.error(msg);
      if (onError) onError(err as Error);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative inline-block w-40 h-40 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 group">
          <Image
            src={resolveImageUrl(value)}
            alt="Uploaded preview"
            width={160}
            height={160}
            className="object-cover w-full h-full"
            fallback="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><rect width='160' height='160' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23aaa'>No Preview</text></svg>"
          />
          {!disabled && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={handleRemove}
                title="Remove image"
              />
            </div>
          )}
        </div>
      ) : (
        <Upload
          name="image"
          listType="picture-card"
          showUploadList={false}
          customRequest={handleCustomUpload}
          beforeUpload={beforeUpload}
          disabled={disabled || loading}
          className="sharon-image-uploader"
        >
          <div className="flex flex-col items-center justify-center p-4 text-center cursor-pointer">
            {loading ? (
              <LoadingOutlined className="text-2xl text-sharon-forest" />
            ) : (
              <UploadOutlined className="text-2xl text-gray-500" />
            )}
            <div className="mt-2 text-xs font-medium text-gray-700">
              {loading ? 'Uploading...' : 'Upload Image'}
            </div>
          </div>
        </Upload>
      )}
      <span className="text-xs text-gray-400">{aspectRatioLabel}</span>
    </div>
  );
};
