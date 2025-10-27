'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Eye, EyeOff, RotateCcw, FileText } from 'lucide-react';
import { DetailedPalmFeatures } from './DetailedPalmFeatures';
import type { PalmFeatures } from '@/types';

interface PalmVisualizationProps {
  imageUrl: string;
  palmFeatures: PalmFeatures;
  onRegenerateFeatures?: () => void;
}

export function PalmVisualization({ 
  imageUrl, 
  palmFeatures, 
  onRegenerateFeatures 
}: PalmVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailedFeatures, setShowDetailedFeatures] = useState(false);

  const drawPalmFeatures = useCallback((
    ctx: CanvasRenderingContext2D, 
    features: PalmFeatures, 
    imageWidth: number, 
    imageHeight: number
  ) => {
    // 座標轉換：如果座標值大於100，認為是像素座標，否則認為是百分比座標
    const convertCoord = (coord: { x: number; y: number }) => {
      if (coord.x > 100 || coord.y > 100) {
        // 像素座標，直接使用
        return { x: coord.x, y: coord.y };
      } else {
        // 百分比座標，轉換為像素
        return {
          x: (coord.x / 100) * imageWidth,
          y: (coord.y / 100) * imageHeight
        };
      }
    };

    const center = convertCoord(features.palmCenter);
    // 半徑處理：如果大於100，認為是像素值，否則認為是百分比
    const radius = features.palmRadius > 100 
      ? features.palmRadius 
      : (features.palmRadius / 100) * Math.min(imageWidth, imageHeight) * 0.5;

    // 設置繪圖樣式
    ctx.lineWidth = 3;
    ctx.font = `${Math.max(12, imageWidth / 40)}px Arial`;
    ctx.textAlign = 'center';

    // 1. 繪製手掌中心和半徑圓
    ctx.strokeStyle = '#10b981'; // 翡翠綠
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // 手掌中心點
    ctx.beginPath();
    ctx.arc(center.x, center.y, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // 中心標籤
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(center.x - 30, center.y - 25, 60, 16);
    ctx.fillStyle = '#10b981';
    ctx.fillText('手掌中心', center.x, center.y - 12);

    // 2. 繪製 ROI 正方形
    const roiTopLeft = convertCoord(features.roiSquare.topLeft);
    const roiBottomRight = convertCoord(features.roiSquare.bottomRight);
    
    ctx.strokeStyle = '#3b82f6'; // 藍色
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      roiTopLeft.x, 
      roiTopLeft.y, 
      roiBottomRight.x - roiTopLeft.x, 
      roiBottomRight.y - roiTopLeft.y
    );
    ctx.setLineDash([]); // 重置虛線

    // ROI 標籤
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(roiTopLeft.x, roiTopLeft.y - 20, 80, 16);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('分析區域', roiTopLeft.x + 40, roiTopLeft.y - 7);

    // 3. 繪製關鍵點（手指）
    const fingerColors = {
      '拇指尖': '#ef4444', // 紅色
      '食指尖': '#f97316', // 橙色
      '中指尖': '#eab308', // 黃色
      '無名指尖': '#22c55e', // 綠色
      '小指尖': '#8b5cf6', // 紫色
      '手腕中心': '#6b7280' // 灰色
    };

    features.keyPoints.forEach((point) => {
      const pos = convertCoord(point);
      const color = fingerColors[point.type as keyof typeof fingerColors] || '#6b7280';
      
      // 繪製關鍵點
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // 添加白色邊框
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 關鍵點標籤
      ctx.fillStyle = '#ffffff';
      const labelWidth = point.type.length * 8 + 10;
      ctx.fillRect(pos.x - labelWidth/2, pos.y - 30, labelWidth, 16);
      ctx.fillStyle = color;
      ctx.fillText(point.type, pos.x, pos.y - 17);
    });

    // 4. 繪製模擬掌紋線
    drawPalmLines(ctx, center, radius, features.rotationAngle);

    // 5. 顯示檢測信息
    drawDetectionInfo(ctx, features, imageWidth, imageHeight);
  }, []);

  const drawPalmLines = (
    ctx: CanvasRenderingContext2D, 
    center: { x: number; y: number }, 
    radius: number, 
    rotationAngle: number
  ) => {
    const angleRad = (rotationAngle * Math.PI) / 180;
    
    // 生命線 (紅色)
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    const lifeLineStart = {
      x: center.x - radius * 0.3 * Math.cos(angleRad + 0.5),
      y: center.y - radius * 0.2 * Math.sin(angleRad + 0.5)
    };
    const lifeLineEnd = {
      x: center.x - radius * 0.6 * Math.cos(angleRad - 0.8),
      y: center.y + radius * 0.7 * Math.sin(angleRad - 0.8)
    };
    
    // 繪製彎曲的生命線
    ctx.moveTo(lifeLineStart.x, lifeLineStart.y);
    ctx.quadraticCurveTo(
      center.x - radius * 0.5, 
      center.y + radius * 0.2, 
      lifeLineEnd.x, 
      lifeLineEnd.y
    );
    ctx.stroke();
    
    // 生命線標籤
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lifeLineStart.x - 25, lifeLineStart.y - 30, 50, 16);
    ctx.fillStyle = '#dc2626';
    ctx.fillText('生命線', lifeLineStart.x, lifeLineStart.y - 17);

    // 智慧線 (藍色)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    const wisdomLineStart = {
      x: center.x - radius * 0.4 * Math.cos(angleRad),
      y: center.y - radius * 0.1 * Math.sin(angleRad)
    };
    const wisdomLineEnd = {
      x: center.x + radius * 0.5 * Math.cos(angleRad),
      y: center.y + radius * 0.3 * Math.sin(angleRad)
    };
    
    ctx.moveTo(wisdomLineStart.x, wisdomLineStart.y);
    ctx.lineTo(wisdomLineEnd.x, wisdomLineEnd.y);
    ctx.stroke();
    
    // 智慧線標籤
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(wisdomLineEnd.x - 25, wisdomLineEnd.y + 10, 50, 16);
    ctx.fillStyle = '#2563eb';
    ctx.fillText('智慧線', wisdomLineEnd.x, wisdomLineEnd.y + 23);

    // 感情線 (粉色)
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    const emotionLineStart = {
      x: center.x - radius * 0.5 * Math.cos(angleRad - 0.3),
      y: center.y - radius * 0.4 * Math.sin(angleRad - 0.3)
    };
    const emotionLineEnd = {
      x: center.x + radius * 0.6 * Math.cos(angleRad - 0.2),
      y: center.y - radius * 0.3 * Math.sin(angleRad - 0.2)
    };
    
    ctx.moveTo(emotionLineStart.x, emotionLineStart.y);
    ctx.quadraticCurveTo(
      center.x + radius * 0.1, 
      center.y - radius * 0.5, 
      emotionLineEnd.x, 
      emotionLineEnd.y
    );
    ctx.stroke();
    
    // 感情線標籤
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(emotionLineStart.x - 25, emotionLineStart.y - 30, 50, 16);
    ctx.fillStyle = '#ec4899';
    ctx.fillText('感情線', emotionLineStart.x, emotionLineStart.y - 17);
  };

  const drawDetectionInfo = (
    ctx: CanvasRenderingContext2D, 
    features: PalmFeatures, 
    width: number, 
    height: number
  ) => {
    // 檢測信息背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 100);
    
    // 檢測信息文字
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    const info = [
      `信心度: ${(features.confidence * 100).toFixed(1)}%`,
      `旋轉角度: ${features.rotationAngle.toFixed(1)}°`,
      `手掌半徑: ${features.palmRadius.toFixed(1)}`,
      `關鍵點: ${features.keyPoints.length}個`,
    ];
    
    info.forEach((text, index) => {
      ctx.fillText(text, 20, 30 + index * 18);
    });
  };

  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // 設置畫布尺寸
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 畫原圖
      ctx.drawImage(img, 0, 0);
      
      // 如果顯示特徵，則繪製標註
      if (showFeatures) {
        drawPalmFeatures(ctx, palmFeatures, img.width, img.height);
      }
      
      setImageLoaded(true);
    };

    img.src = imageUrl;
  }, [imageUrl, palmFeatures, showFeatures, drawPalmFeatures]);

  const toggleFeatures = () => {
    setShowFeatures(!showFeatures);
    // 重新繪製
    if (canvasRef.current && imageLoaded) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          if (!showFeatures) {
            drawPalmFeatures(ctx, palmFeatures, img.width, img.height);
          }
        };
        img.src = imageUrl;
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto rounded-lg shadow-lg border"
          style={{ maxHeight: '600px' }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-gray-500">正在加載手掌特徵分析...</div>
          </div>
        )}
      </div>
      
      {imageLoaded && (
        <div className="space-y-4">
          {/* 控制按鈕 */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleFeatures}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {showFeatures ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showFeatures ? '隱藏特徵' : '顯示特徵'}</span>
            </button>
            
            {onRegenerateFeatures && (
              <button
                onClick={onRegenerateFeatures}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重新分析</span>
              </button>
            )}
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {showDetails ? '隱藏詳情' : '顯示詳情'}
            </button>
            
            {palmFeatures.detailedFeatures && (
              <button
                onClick={() => setShowDetailedFeatures(!showDetailedFeatures)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>{showDetailedFeatures ? '隱藏詳細分析' : '詳細特徵分析'}</span>
              </button>
            )}
          </div>
          
          {/* 圖例 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              <span>手掌中心與範圍</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-blue-500"></div>
              <span>分析區域</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-red-600"></div>
              <span>生命線</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-blue-600"></div>
              <span>智慧線</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-pink-500"></div>
              <span>感情線</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>手指關鍵點</span>
            </div>
          </div>
          
          {/* 詳細信息 */}
          {showDetails && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <h4 className="font-semibold mb-3">檢測詳情</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>手掌特徵：</strong>
                  <ul className="mt-1 space-y-1">
                    <li>中心座標: ({palmFeatures.palmCenter.x.toFixed(1)}, {palmFeatures.palmCenter.y.toFixed(1)})</li>
                    <li>半徑: {palmFeatures.palmRadius.toFixed(1)}</li>
                    <li>旋轉角度: {palmFeatures.rotationAngle.toFixed(1)}°</li>
                    <li>檢測信心度: {(palmFeatures.confidence * 100).toFixed(1)}%</li>
                  </ul>
                </div>
                <div>
                  <strong>關鍵點位置：</strong>
                  <ul className="mt-1 space-y-1">
                    {palmFeatures.keyPoints.map((point, index) => (
                      <li key={index}>
                        {point.type}: ({point.x.toFixed(1)}, {point.y.toFixed(1)})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* 詳細特徵分析 */}
          {showDetailedFeatures && palmFeatures.detailedFeatures && (
            <div className="mt-6 p-6 bg-white rounded-lg border border-purple-200">
              <h4 className="text-lg font-semibold mb-4 flex items-center text-purple-800">
                <FileText className="w-5 h-5 mr-2" />
                詳細手相特徵分析報告
              </h4>
              <DetailedPalmFeatures features={palmFeatures.detailedFeatures} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}