/**
 * AI 视觉识别服务 - 使用 Gemini Vision API
 * 免费额度：每天 1500 次请求
 * 获取 API Key: https://aistudio.google.com/app/apikey
 */

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * 识别图片中的物品并估算尺寸
 * @param {string} imageBase64 - Base64 编码的图片
 * @returns {Promise<Object>} 识别结果
 */
export async function recognizeLuggage(imageBase64) {
  // 如果没有配置 API Key，返回模拟数据
  if (!GEMINI_API_KEY) {
    console.warn('未配置 GEMINI_API_KEY，使用模拟数据');
    return getMockResult();
  }

  try {
    // 提取 base64 数据（去掉 data:image/jpeg;base64, 前缀）
    const base64Data = imageBase64.split(',')[1];
    const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';

    const prompt = `分析这张图片中的物品，这是要放入汽车后备箱的行李。

请完成以下任务：
1. 识别物品类型（如：行李箱、背包、纸箱、婴儿车、吉他等）
2. 根据常见物品尺寸，估算该物品的长、宽、高（单位：厘米）
3. 计算体积（升）= 长×宽×高 / 1000

请严格按以下 JSON 格式返回，不要添加任何其他文字：
{
  "type": "物品类型",
  "dimensions": {
    "length": 数字,
    "width": 数字,
    "height": 数字
  },
  "volume": 数字,
  "confidence": 0到1之间的数字
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 256,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // 解析 JSON 响应
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        type: result.type || '未知物品',
        dimensions: {
          length: result.dimensions?.length || 50,
          width: result.dimensions?.width || 40,
          height: result.dimensions?.height || 30
        },
        volume: result.volume || 60,
        confidence: result.confidence || 0.8
      };
    }

    throw new Error('无法解析识别结果');
  } catch (error) {
    console.error('AI 识别失败:', error);
    // 失败时返回模拟数据
    return getMockResult();
  }
}

/**
 * 获取模拟识别结果（用于开发测试）
 */
function getMockResult() {
  const mockItems = [
    { type: '行李箱', length: 65, width: 42, height: 48, volume: 131 },
    { type: '背包', length: 45, width: 30, height: 20, volume: 27 },
    { type: '纸箱', length: 50, width: 40, height: 35, volume: 70 },
    { type: '手提袋', length: 35, width: 25, height: 40, volume: 35 },
  ];

  const randomItem = mockItems[Math.floor(Math.random() * mockItems.length)];

  return {
    type: randomItem.type,
    dimensions: {
      length: randomItem.length,
      width: randomItem.width,
      height: randomItem.height
    },
    volume: randomItem.volume,
    confidence: 0.85
  };
}

/**
 * 压缩图片（减小上传大小）
 * @param {string} dataUrl - Base64 图片
 * @param {number} maxWidth - 最大宽度
 * @param {number} quality - 质量 0-1
 * @returns {Promise<string>} 压缩后的 Base64 图片
 */
export function compressImage(dataUrl, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
}