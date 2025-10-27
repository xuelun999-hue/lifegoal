import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekPalmistryService } from '@/lib/deepseek-service';
import { EnhancedPalmAnalyzer } from '@/lib/enhanced-analyzer';
import { PalmPositioningService } from '@/lib/palm-positioning';

interface AnalysisRequest {
  imageData: string;
  userInfo: {
    gender?: string;
    age?: number;
  };
}

// 創建全局服務實例
let deepSeekService: DeepSeekPalmistryService | null = null;
let fallbackAnalyzer: EnhancedPalmAnalyzer | null = null;
let palmPositioning: PalmPositioningService | null = null;

function getDeepSeekService(): DeepSeekPalmistryService | null {
  if (!deepSeekService) {
    try {
      deepSeekService = new DeepSeekPalmistryService();
    } catch (error) {
      console.error('DeepSeek服務初始化失敗:', error);
      return null;
    }
  }
  return deepSeekService;
}

function getFallbackAnalyzer(): EnhancedPalmAnalyzer {
  if (!fallbackAnalyzer) {
    fallbackAnalyzer = new EnhancedPalmAnalyzer();
  }
  return fallbackAnalyzer;
}

function getPalmPositioning(): PalmPositioningService {
  if (!palmPositioning) {
    palmPositioning = new PalmPositioningService();
  }
  return palmPositioning;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { imageData, userInfo }: AnalysisRequest = await request.json();
    
    console.log('🔍 開始手相分析...');
    
    // 1. 首先進行手掌定位分析
    console.log('📍 分析手掌特徵定位...');
    const positioning = getPalmPositioning();
    const palmFeatures = await positioning.analyzePalmFeatures(imageData);
    
    // 2. 驗證手掌質量
    const qualityCheck = positioning.validatePalmQuality(palmFeatures);
    console.log(`🎯 手掌定位完成，信心度: ${(palmFeatures.confidence * 100).toFixed(1)}%`);
    
    // 嘗試使用DeepSeek服務
    const deepSeekService = getDeepSeekService();
    
    if (deepSeekService) {
      console.log('🤖 使用DeepSeek AI進行分析');
      
      try {
        const analysis = await deepSeekService.analyzePalmWithPositioning(imageData, userInfo, palmFeatures);
        const processingTime = Date.now() - startTime;
        
        console.log(`✅ DeepSeek分析完成，耗時: ${processingTime}ms`);
        
        return NextResponse.json({
          ...analysis,
          processingTime,
          palmPositioning: {
            features: palmFeatures,
            quality: qualityCheck
          },
          _debug: {
            method: 'deepseek_ai_enhanced',
            timestamp: new Date().toISOString()
          }
        });
        
      } catch (apiError) {
        console.error('DeepSeek API調用失敗:', apiError);
        // 繼續使用本地分析作為備用
      }
    }
    
    // 如果DeepSeek失敗，使用本地分析器
    console.log('🔄 使用本地知識庫分析');
    const analyzer = getFallbackAnalyzer();
    
    // 模擬分析時間
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const analysis = analyzer.analyzeBasedOnKnowledge(userInfo);
    const processingTime = Date.now() - startTime;
    
    const stats = analyzer.getKnowledgeStats();
    console.log(`📊 本地分析完成，知識庫: ${stats.knowledgeLength} 字符`);
    
    return NextResponse.json({
      ...analysis,
      processingTime,
      analysisMethod: 'local_knowledge',
      note: deepSeekService ? 'AI服務暫時不可用，使用本地知識庫分析' : 'DeepSeek服務未配置，使用本地分析',
      _debug: {
        method: 'local_fallback',
        knowledgeLoaded: stats.isLoaded,
        knowledgeSize: stats.knowledgeLength,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('分析過程中發生錯誤:', error);
    
    return NextResponse.json(
      { 
        error: '分析過程中發生錯誤，請稍後再試',
        processingTime,
        _debug: {
          method: 'error',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}