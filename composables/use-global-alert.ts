import { ref } from 'vue'

const showAlert = ref(false)
const alertTitle = ref('')
const alertMessage = ref('')

export function useGlobalAlert() {
  const show = (message: string, title?: string) => {
    alertMessage.value = message
    alertTitle.value = title || '警告'
    showAlert.value = true
  }

  return {
    showAlert,
    alertTitle,
    alertMessage,
    show
  }
} 