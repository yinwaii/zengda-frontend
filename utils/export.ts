import * as XLSX from 'xlsx'

export interface ExportOptions {
  format: 'csv' | 'excel'
  selectedColumns: string[]
}

export function exportTableData(
  data: any[],
  columns: any[],
  options: ExportOptions
) {
  // 检查是否在浏览器环境中
  if (typeof window === 'undefined') {
    console.warn('Export functionality is only available in browser environment')
    return
  }

  // 根据选中的列过滤数据
  const selectedData = data.map(item => {
    const filteredItem: any = {}
    options.selectedColumns.forEach(key => {
      const column = columns.find(col => col.key === key)
      if (column) {
        filteredItem[column.title] = item[key]
      }
    })
    return filteredItem
  })

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(selectedData)

  // 设置列宽
  const colWidths = options.selectedColumns.map(key => {
    const column = columns.find(col => col.key === key)
    return { wch: Math.max(10, column?.title.length || 10) }
  })
  ws['!cols'] = colWidths

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  // 导出文件
  const fileName = `导出数据_${new Date().toLocaleDateString()}`
  if (options.format === 'csv') {
    XLSX.writeFile(wb, `${fileName}.csv`)
  } else {
    XLSX.writeFile(wb, `${fileName}.xlsx`)
  }
} 