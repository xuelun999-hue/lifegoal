const fetch = require('node-fetch');

async function testDeepSeekConnection() {
  console.log('🧪 测试DeepSeek API连接...\n');
  
  const apiKey = 'sk-d002fee53f234e62849d94abcd67c65b';
  const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: '你好，请简单介绍一下手相学'
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ DeepSeek API连接成功!');
      console.log('📝 测试回应:', data.choices[0].message.content);
      console.log('🔢 Token使用情况:', data.usage || '未提供');
    } else {
      const errorText = await response.text();
      console.log('❌ API连接失败:', response.status, response.statusText);
      console.log('📄 错误详情:', errorText);
    }

  } catch (error) {
    console.log('❌ 网络错误:', error.message);
  }
}

testDeepSeekConnection();