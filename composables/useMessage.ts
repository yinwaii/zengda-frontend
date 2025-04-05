/**
 * 消息通知Composable
 * 用于统一处理消息通知，方便后期替换底层实现
 */
export const useMessage = () => {
  /**
   * 显示成功消息
   * @param message 消息内容
   */
  const success = (message: string) => {
    // 使用控制台替代，实际项目中可以改为使用Element-Plus、Ant Design Vue等UI库的消息通知
    console.log(`✅ ${message}`)
  }

  /**
   * 显示错误消息
   * @param message 消息内容
   */
  const error = (message: string) => {
    // 使用控制台替代，实际项目中可以改为使用Element-Plus、Ant Design Vue等UI库的消息通知
    console.error(`❌ ${message}`)
  }

  /**
   * 显示警告消息
   * @param message 消息内容
   */
  const warning = (message: string) => {
    // 使用控制台替代，实际项目中可以改为使用Element-Plus、Ant Design Vue等UI库的消息通知
    console.warn(`⚠️ ${message}`)
  }

  /**
   * 显示信息消息
   * @param message 消息内容
   */
  const info = (message: string) => {
    // 使用控制台替代，实际项目中可以改为使用Element-Plus、Ant Design Vue等UI库的消息通知
    console.info(`ℹ️ ${message}`)
  }

  return {
    success,
    error,
    warning,
    info
  }
} 