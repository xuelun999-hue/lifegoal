'use client';

import { useState } from 'react';
import { X, CreditCard, Smartphone, QrCode, Lock } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount: number;
  packageName: string;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  amount, 
  packageName 
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay' | 'card'>('wechat');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // 模擬付款處理
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
    }, 2000);
  };

  const handleTestPayment = () => {
    // 測試用：直接成功
    onPaymentSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold font-chinese">選擇付款方式</h3>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-jade-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-jade-800 mb-1">{packageName}</h4>
            <p className="text-jade-600 text-2xl font-bold">¥{amount}</p>
          </div>
          
          {/* 付款方式選擇 */}
          <div className="space-y-3 mb-6">
            <div className="text-sm font-medium text-gray-700 mb-3">選擇付款方式：</div>
            
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="wechat"
                checked={paymentMethod === 'wechat'}
                onChange={(e) => setPaymentMethod(e.target.value as 'wechat')}
                className="mr-3"
              />
              <Smartphone className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-sm">微信支付</span>
            </label>
            
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="alipay"
                checked={paymentMethod === 'alipay'}
                onChange={(e) => setPaymentMethod(e.target.value as 'alipay')}
                className="mr-3"
              />
              <QrCode className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm">支付寶</span>
            </label>
            
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                className="mr-3"
              />
              <CreditCard className="w-5 h-5 text-purple-600 mr-3" />
              <span className="text-sm">銀行卡</span>
            </label>
          </div>
          
          {/* 測試區域 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h5 className="text-yellow-800 font-medium mb-2">⚡ 測試模式</h5>
            <p className="text-yellow-700 text-sm mb-3">
              點擊下方按鈕直接體驗付款後的完整報告內容
            </p>
            <button
              onClick={handleTestPayment}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              🧪 測試付款成功（免費體驗）
            </button>
          </div>
          
          {/* 安全提示 */}
          <div className="flex items-center text-gray-500 text-xs mb-4">
            <Lock className="w-4 h-4 mr-1" />
            <span>支付安全由第三方平台保障</span>
          </div>
          
          {/* 付款按鈕 */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-jade-600 text-white py-2 px-4 rounded-lg hover:bg-jade-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? '處理中...' : `確認付款 ¥${amount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}