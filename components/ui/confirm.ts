import { createVNode, render, h, ref } from 'vue'
import { 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle, 
  DialogDescription 
} from '~/components/ui/dialog'

export interface ConfirmOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'outline'
}

export function useConfirm() {
  const confirm = (options: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      // 创建一个临时的div容器
      const container = document.createElement('div')
      
      // 创建一个包含确认对话框内容的vnode
      const content = h(DialogContent, { class: 'sm:max-w-[425px]' }, [
        h(DialogHeader, {}, [
          h(DialogTitle, {}, options.title || '确认'),
          h(DialogDescription, {}, options.description || '确定继续此操作吗？')
        ]),
        h(DialogFooter, {}, [
          h('button', { 
            class: 'px-4 py-2 rounded bg-gray-200 text-gray-800 mr-2',
            onClick: () => {
              render(null, container)
              container.remove()
              resolve(false)
            }
          }, options.cancelText || '取消'),
          h('button', { 
            class: 'px-4 py-2 rounded bg-red-500 text-white',
            onClick: () => {
              render(null, container)
              container.remove()
              resolve(true)
            }
          }, options.confirmText || '确认')
        ])
      ])
      
      // 渲染内容
      render(content, container)
      document.body.appendChild(container)
    })
  }
  
  return { confirm }
} 