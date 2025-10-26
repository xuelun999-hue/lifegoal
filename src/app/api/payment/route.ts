import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment-service';

interface PaymentRequest {
  method: 'wechat' | 'alipay' | 'card';
  amount: number;
  packageName: string;
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { method, amount, packageName, userId }: PaymentRequest = await request.json();

    // 驗證請求參數
    if (!method || !amount || !packageName) {
      return NextResponse.json(
        { error: '缺少必要參數' },
        { status: 400 }
      );
    }

    // 驗證金額
    const validAmounts = [38, 48, 128];
    if (!validAmounts.includes(amount)) {
      return NextResponse.json(
        { error: '無效的付款金額' },
        { status: 400 }
      );
    }

    const paymentService = new PaymentService();
    const order = paymentService.createOrder(amount, packageName, userId);

    let result;
    switch (method) {
      case 'wechat':
        result = await paymentService.processWechatPayment(order);
        break;
      case 'alipay':
        result = await paymentService.processAlipayPayment(order);
        break;
      case 'card':
        result = await paymentService.processBankCardPayment(order);
        break;
      default:
        return NextResponse.json(
          { error: '不支持的付款方式' },
          { status: 400 }
        );
    }

    if (result.success) {
      // 記錄成功的付款（生產環境應該保存到數據庫）
      console.log(`Payment successful: ${JSON.stringify(result)}`);
      
      return NextResponse.json({
        success: true,
        orderId: result.orderId,
        transactionId: result.transactionId,
        message: '付款成功'
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: result.error || '付款失敗',
          orderId: result.orderId
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: '付款處理過程中發生錯誤' },
      { status: 500 }
    );
  }
}

// 驗證付款狀態
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');

  if (!orderId || !transactionId) {
    return NextResponse.json(
      { error: '缺少訂單ID或交易ID' },
      { status: 400 }
    );
  }

  const paymentService = new PaymentService();
  const isValid = await paymentService.verifyPayment(orderId, transactionId);

  return NextResponse.json({
    orderId,
    transactionId,
    verified: isValid,
    status: isValid ? 'completed' : 'failed'
  });
}