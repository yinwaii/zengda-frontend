// Web Worker 处理文档转换
// 注意: 此文件在Worker环境中运行

// 导入mammoth库进行docx转换
// 由于Worker环境下，需要动态导入
let mammoth: any = null;

// 消息类型
type WorkerMessageType = 
  | 'DOCX_TO_HTML' 
  | 'HTML_TO_DOCX' 
  | 'PREPROCESS_HTML'
  | 'READY';

// 消息结构
interface WorkerMessage {
  type: WorkerMessageType;
  id: string;
  payload?: any;
}

// 响应结构
interface WorkerResponse {
  type: WorkerMessageType;
  id: string;
  success: boolean;
  error?: string;
  html?: string;
  messages?: string[];
}

// 初始化Worker
async function initWorker() {
  try {
    // 动态导入mammoth库
    mammoth = await import('mammoth');
    // 通知主线程Worker已准备就绪
    self.postMessage({
      type: 'READY',
      id: 'init',
      success: true
    });
  } catch (error) {
    console.error('Worker初始化失败:', error);
    self.postMessage({
      type: 'READY',
      id: 'init',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// 处理docx到html的转换
async function handleDocxToHtml(message: WorkerMessage): Promise<void> {
  const { id, payload } = message;
  
  if (!mammoth) {
    self.postMessage({
      type: 'DOCX_TO_HTML',
      id,
      success: false,
      error: 'Mammoth库未加载'
    });
    return;
  }
  
  try {
    // 确保payload包含文件数据
    if (!payload || !payload.buffer) {
      throw new Error('无效的文件数据');
    }
    
    // 转换docx到html
    const result = await mammoth.convertToHtml({ 
      arrayBuffer: payload.buffer 
    });
    
    // 返回转换结果
    self.postMessage({
      type: 'DOCX_TO_HTML',
      id,
      success: true,
      html: result.value,
      messages: result.messages
    });
  } catch (error) {
    console.error('Worker: DOCX转HTML失败', error);
    self.postMessage({
      type: 'DOCX_TO_HTML',
      id,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// 预处理HTML内容
function handlePreprocessHtml(message: WorkerMessage): void {
  const { id, payload } = message;
  
  try {
    // 确保payload包含HTML
    if (!payload || typeof payload.html !== 'string') {
      throw new Error('无效的HTML数据');
    }
    
    // 预处理HTML (清理脚本、样式等)
    let cleanHtml = payload.html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<link\b[^<]*>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
      
    // 可添加更多复杂的HTML预处理
    
    // 返回预处理结果
    self.postMessage({
      type: 'PREPROCESS_HTML',
      id,
      success: true,
      html: cleanHtml
    });
  } catch (error) {
    console.error('Worker: HTML预处理失败', error);
    self.postMessage({
      type: 'PREPROCESS_HTML',
      id,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// 监听主线程消息
self.addEventListener('message', async (event) => {
  const message = event.data as WorkerMessage;
  
  // 处理不同类型的消息
  switch (message.type) {
    case 'DOCX_TO_HTML':
      await handleDocxToHtml(message);
      break;
      
    case 'PREPROCESS_HTML':
      handlePreprocessHtml(message);
      break;
      
    default:
      console.warn('Worker: 未知消息类型', message.type);
      self.postMessage({
        type: message.type,
        id: message.id || 'unknown',
        success: false,
        error: `未知消息类型: ${message.type}`
      });
  }
});

// 初始化Worker
initWorker();

// 添加TypeScript的Worker类型声明
export {}; 