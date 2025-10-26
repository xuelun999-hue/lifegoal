import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface HealthCheckFile {
  name: string;
  size: number;
  exists: boolean;
}

interface HealthCheckResponse {
  timestamp: string;
  environment: string | undefined;
  status: string;
  checks: {
    api_keys: {
      deepseek_configured: boolean;
      deepseek_url_configured: boolean;
      status: string;
    };
    knowledge_base: {
      status: string;
      files: HealthCheckFile[];
      total_size: number;
    };
    deployment: {
      vercel_env: string;
      vercel_url: string;
      status: string;
    };
  };
  warnings: string[];
  errors: string[];
}

export async function GET(request: NextRequest) {
  const checks: HealthCheckResponse = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    status: 'healthy',
    checks: {
      api_keys: {
        deepseek_configured: !!process.env.DEEPSEEK_API_KEY,
        deepseek_url_configured: !!process.env.DEEPSEEK_API_URL,
        status: 'pass'
      },
      knowledge_base: {
        status: 'checking',
        files: [],
        total_size: 0
      },
      deployment: {
        vercel_env: process.env.VERCEL_ENV || 'local',
        vercel_url: process.env.VERCEL_URL || 'localhost',
        status: 'pass'
      }
    },
    warnings: [],
    errors: []
  };

  // 檢查知識庫檔案
  try {
    const knowledgePath = join(process.cwd(), 'knowledge', 'processed');
    
    if (existsSync(knowledgePath)) {
      const files = ['palmistry-basics.md', '中国秘传手相术2.md'];
      
      for (const file of files) {
        const filePath = join(knowledgePath, file);
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf-8');
          checks.checks.knowledge_base.files.push({
            name: file,
            size: content.length,
            exists: true
          });
          checks.checks.knowledge_base.total_size += content.length;
        } else {
          checks.checks.knowledge_base.files.push({
            name: file,
            size: 0,
            exists: false
          });
          checks.errors.push(`Knowledge base file missing: ${file}`);
        }
      }
      
      if (checks.checks.knowledge_base.total_size > 0) {
        checks.checks.knowledge_base.status = 'pass';
      } else {
        checks.checks.knowledge_base.status = 'fail';
        checks.errors.push('No knowledge base content found');
      }
    } else {
      checks.checks.knowledge_base.status = 'fail';
      checks.errors.push('Knowledge base directory not found');
    }
  } catch (error) {
    checks.checks.knowledge_base.status = 'error';
    checks.errors.push(`Knowledge base check failed: ${error}`);
  }

  // 檢查 API 密鑰
  if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your_deepseek_api_key_here') {
    checks.checks.api_keys.status = 'fail';
    checks.errors.push('DeepSeek API key not properly configured');
  }

  // 檢查整體狀態
  if (checks.errors.length > 0) {
    checks.status = 'unhealthy';
  } else if (checks.warnings.length > 0) {
    checks.status = 'warning';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 
                    checks.status === 'warning' ? 200 : 500;

  return NextResponse.json(checks, { status: statusCode });
}