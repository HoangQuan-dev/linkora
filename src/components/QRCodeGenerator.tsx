'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { Download, Copy, QrCode, X } from 'lucide-react';
import { QRCodeData } from '@/types';
import { cn, copyToClipboard } from '@/utils';

interface QRCodeGeneratorProps {
  url: string;
  onClose: () => void;
}

export function QRCodeGenerator({ url, onClose }: QRCodeGeneratorProps) {
  const [qrData, setQrData] = useState<QRCodeData>({
    url,
    size: 256,
    color: '#000000',
    backgroundColor: '#ffffff'
  });
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'linkora-qr.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(url);
    setCopied(success);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeOptions = [128, 256, 512];
  const colorOptions = [
    { name: 'Black', value: '#000000' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <QrCode className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold">QR Code</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Display */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <QRCode
              value={qrData.url}
              size={qrData.size}
              fgColor={qrData.color}
              bgColor={qrData.backgroundColor}
              level="H"
            />
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-4 mb-6">
          {/* Size */}
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <div className="flex gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => setQrData(prev => ({ ...prev, size }))}
                  className={cn(
                    'px-3 py-1 rounded-lg text-sm transition-colors',
                    qrData.size === size
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setQrData(prev => ({ ...prev, color: color.value }))}
                  className={cn(
                    'w-8 h-8 rounded-lg border-2 transition-all',
                    qrData.color === color.value
                      ? 'border-blue-500 scale-110'
                      : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleCopyUrl}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2',
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
        </div>

        {/* URL Display */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">URL:</p>
          <p className="text-sm font-mono break-all">{url}</p>
        </div>
      </motion.div>
    </motion.div>
  );
} 