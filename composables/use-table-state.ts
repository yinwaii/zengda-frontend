import { ref } from 'vue'

interface TableState {
  columnVisibility: any
  sortBy: any
  filterBy: any
}

export function useTableState(pageName: string) {
  const STORAGE_KEY = `table_state_${pageName}`
  
  // 从 localStorage 加载状态
  const loadState = (): TableState | null => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY)
      return savedState ? JSON.parse(savedState) : null
    } catch (error) {
      console.error('加载表格状态失败:', error)
      return null
    }
  }

  // 保存状态到 localStorage
  const saveState = (state: TableState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('保存表格状态失败:', error)
    }
  }

  // 清除状态
  const clearState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('清除表格状态失败:', error)
    }
  }

  return {
    loadState,
    saveState,
    clearState
  }
} 