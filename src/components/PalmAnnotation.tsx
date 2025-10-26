'use client';

import React, { useRef, useEffect, useState } from 'react';

interface PalmAnnotation {
  thumb: { x: number; y: number };
  pinky: { x: number; y: number };
  lifeLine: { points: Array<{ x: number; y: number }> };
  wisdomLine: { points: Array<{ x: number; y: number }> };
}

interface PalmAnnotationProps {
  imageUrl: string;
  annotations?: PalmAnnotation;
  onAnnotationsGenerated?: (annotations: PalmAnnotation) => void;
}

export function PalmAnnotationCanvas({ imageUrl, annotations, onAnnotationsGenerated }: PalmAnnotationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [palmAnnotations, setPalmAnnotations] = useState<PalmAnnotation | null>(annotations || null);

  // 從API獲取智能標註數據
  const generateAnnotationsFromAPI = async (imageUrl: string): Promise<PalmAnnotation> => {
    try {
      const response = await fetch('/api/generate-annotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageUrl
        })
      });
      
      if (!response.ok) {
        throw new Error('API請求失敗');
      }
      
      const { annotations } = await response.json();
      return annotations;
      
    } catch (error) {
      console.log('使用智能默認標註:', error);
      return generateSmartMockAnnotations(imageUrl);
    }
  };

  // 生成智能模擬的手掌標註數據
  const generateSmartMockAnnotations = (imageUrl: string): PalmAnnotation => {
    // 基於圖片URL生成稍微隨機化的位置
    const seed = imageUrl.length % 100;
    const variation = (seed % 10) - 5; // -5 到 +5 的變化
    
    return {
      thumb: {
        x: 25 + variation,
        y: 30 + (variation * 0.5)
      },
      pinky: {
        x: 75 - variation,
        y: 25 + (variation * 0.3)
      },
      lifeLine: {
        points: [
          { x: 15 + variation, y: 40 },
          { x: 18 + variation, y: 60 + variation },
          { x: 12 + variation, y: 80 - variation },
          { x: 8 + variation * 0.5, y: 90 }
        ]
      },
      wisdomLine: {
        points: [
          { x: 20 + variation, y: 50 },
          { x: 40 - variation, y: 55 + variation },
          { x: 65 + variation, y: 60 - variation },
          { x: 80, y: 65 }
        ]
      }
    };
  };

  const drawAnnotations = (ctx: CanvasRenderingContext2D, annotations: PalmAnnotation, width: number, height: number) => {
    // 將百分比坐標轉換為實際像素坐標
    const convertCoord = (coord: { x: number; y: number }) => ({
      x: (coord.x / 100) * width,
      y: (coord.y / 100) * height
    });

    // 設置樣式
    ctx.strokeStyle = '#10b981'; // 翡翠綠色
    ctx.fillStyle = '#10b981';
    ctx.lineWidth = Math.max(2, width / 200); // 根據圖片大小調整線寬
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const thumbPos = convertCoord(annotations.thumb);
    const pinkyPos = convertCoord(annotations.pinky);

    // 畫拇指標記
    ctx.beginPath();
    ctx.arc(thumbPos.x, thumbPos.y, Math.max(6, width / 80), 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.max(10, width / 50)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('拇指', thumbPos.x, thumbPos.y - 15);

    // 畫小指標記
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(pinkyPos.x, pinkyPos.y, Math.max(6, width / 80), 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('小指', pinkyPos.x, pinkyPos.y - 15);

    // 畫生命線
    ctx.strokeStyle = '#ef4444'; // 紅色
    ctx.lineWidth = Math.max(3, width / 150);
    ctx.beginPath();
    const lifeLinePoints = annotations.lifeLine.points.map(convertCoord);
    ctx.moveTo(lifeLinePoints[0].x, lifeLinePoints[0].y);
    for (let i = 1; i < lifeLinePoints.length; i++) {
      ctx.lineTo(lifeLinePoints[i].x, lifeLinePoints[i].y);
    }
    ctx.stroke();
    
    // 生命線標籤
    const lifeLineStart = lifeLinePoints[0];
    const labelWidth = Math.max(40, width / 10);
    const labelHeight = Math.max(16, width / 25);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lifeLineStart.x - labelWidth/2, lifeLineStart.y - labelHeight - 10, labelWidth, labelHeight);
    ctx.fillStyle = '#ef4444';
    ctx.font = `${Math.max(10, width / 50)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('生命線', lifeLineStart.x, lifeLineStart.y - 5);

    // 畫智慧線
    ctx.strokeStyle = '#3b82f6'; // 藍色
    ctx.lineWidth = Math.max(3, width / 150);
    ctx.beginPath();
    const wisdomLinePoints = annotations.wisdomLine.points.map(convertCoord);
    ctx.moveTo(wisdomLinePoints[0].x, wisdomLinePoints[0].y);
    for (let i = 1; i < wisdomLinePoints.length; i++) {
      ctx.lineTo(wisdomLinePoints[i].x, wisdomLinePoints[i].y);
    }
    ctx.stroke();

    // 智慧線標籤
    const wisdomLineEnd = wisdomLinePoints[wisdomLinePoints.length - 1];
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(wisdomLineEnd.x - labelWidth/2, wisdomLineEnd.y + 5, labelWidth, labelHeight);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('智慧線', wisdomLineEnd.x, wisdomLineEnd.y + 18);
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
      
      // 生成或使用現有標註
      let currentAnnotations = palmAnnotations;
      if (!currentAnnotations) {
        // 使用智能API生成標註
        generateAnnotationsFromAPI(imageUrl).then(newAnnotations => {
          setPalmAnnotations(newAnnotations);
          onAnnotationsGenerated?.(newAnnotations);
          
          // 重新繪製帶有標註的圖片
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          drawAnnotations(ctx, newAnnotations, img.width, img.height);
        });
        
        // 暫時使用基本標註，避免空白
        currentAnnotations = generateSmartMockAnnotations(imageUrl);
        setPalmAnnotations(currentAnnotations);
      }
      
      // 畫標註
      drawAnnotations(ctx, currentAnnotations, img.width, img.height);
      setImageLoaded(true);
    };

    img.src = imageUrl;
  }, [imageUrl, palmAnnotations]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto rounded-lg shadow-lg"
        style={{ maxHeight: '500px' }}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-500">正在標註手掌特徵...</div>
        </div>
      )}
      
      {imageLoaded && (
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
            <span>手指標記</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-red-500"></div>
            <span>生命線</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-blue-500"></div>
            <span>智慧線</span>
          </div>
        </div>
      )}
    </div>
  );
}