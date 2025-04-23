import { useToast } from '@/components/ui/toast'
import type { ZdPType } from '~/models/entity/ptype'
import { useEntityHandlers } from '../use-entity-handlers'

// 获取prepareEntityData函数
const { prepareEntityData } = useEntityHandlers()

/**
 * 处理产品类型保存
 * @param data 产品类型数据
 * @param reloadFunction 保存后刷新数据的函数
 */
export const handlePtypeSave = async (data: Partial<ZdPType>, reloadFunction: () => Promise<void>) => {
  const toast = useToast()
  const entityApis = useEntityApis()
  
  try {
    // 准备数据，移除不需要的属性
    const ptypeData = prepareEntityData<ZdPType>(data)
    
    // 移除空的时间字段，避免数据库错误
    if ('createdTime' in ptypeData && !ptypeData.createdTime) {
      delete ptypeData.createdTime;
    }
    if ('updatedTime' in ptypeData && !ptypeData.updatedTime) {
      delete ptypeData.updatedTime;
    }
    
    console.log('提交产品类型数据:', ptypeData)
    
    // 调用API保存产品类型数据
    await entityApis.ptype.update(ptypeData as ZdPType)
    
    toast.toast({
      title: "成功",
      description: "产品类型更新成功",
    })
    
    // 刷新数据
    if (reloadFunction) {
      await reloadFunction()
    }
    
    return true
  } catch (err) {
    console.error('保存产品类型失败:', err)
    toast.toast({
      title: "错误",
      description: "保存产品类型失败",
      variant: "destructive"
    })
    return false
  }
} 