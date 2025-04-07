import { ref } from 'vue'

export interface ConfirmOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'outline'
}

export function useConfirm() {
  const isOpen = ref(false)
  const options = ref<ConfirmOptions>({
    title: '确认',
    description: '确定继续此操作吗？',
    confirmText: '确认',
    cancelText: '取消',
    variant: 'destructive'
  })
  
  let resolvePromise: (value: boolean) => void

  const confirm = (confirmOptions: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      options.value = {
        ...options.value,
        ...confirmOptions
      }
      resolvePromise = resolve
      isOpen.value = true
    })
  }
  
  const handleConfirm = () => {
    isOpen.value = false
    resolvePromise(true)
  }
  
  const handleCancel = () => {
    isOpen.value = false
    resolvePromise(false)
  }
  
  const onOpenChange = (value: boolean) => {
    if (!value && isOpen.value) {
      handleCancel()
    }
    isOpen.value = value
  }
  
  return { 
    isOpen,
    options,
    confirm,
    handleConfirm,
    handleCancel,
    onOpenChange
  }
} 