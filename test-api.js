// 测试API功能
const fs = require('fs');
const path = require('path');

// 模拟一个测试请求
async function testAPI() {
  console.log('🧪 测试手相分析API...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//', // 测试用的base64
        userInfo: {
          gender: 'unknown'
        }
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API响应成功!');
      console.log('📋 分析结果:');
      console.log(`   手型: ${result.handType}`);
      console.log(`   性格: ${result.personality}`);
      console.log(`   事业: ${result.career}`);
      console.log(`   财运: ${result.wealth}`);
      console.log(`   健康: ${result.health}`);
      console.log(`   感情: ${result.relationship}`);
      console.log(`   可信度: ${result.confidence}%`);
    } else {
      console.log('❌ API响应失败:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ API测试失败:', error.message);
    console.log('💡 请确保开发服务器正在运行 (npm run dev)');
  }
}

testAPI();