import { useToast } from '@/components/ui/toast'
import { NODE_TYPES } from '~/utils/treeNodeFactory'
import { toApiId } from '~/utils/idConverter'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdComponent } from '~/models/entity/component'
import type { ZdBom } from '~/models/entity/bom'
import type { ZdSpecification } from '~/models/entity/specification'
import type { ZdSpecificationMeta } from '~/models/entity/specification'
import type { ZdPType } from '~/models/entity/ptype'

/**
 * 实体处理函数的复用composable
 * 提供通用的保存和创建实体的处理函数
 */
export const useEntityHandlers = () => {
  const toast = useToast()
  const entityApis = useEntityApis()
  
  /**
   * 处理数据ID转换的通用函数
   * 确保在发送API请求前，使用正确的数字ID格式
   * @param data 要处理的数据
   * @returns 处理后的数据(id已转换为数字格式)
   */
  const prepareEntityData = <T extends Record<string, any>>(data: Partial<T>): Partial<T> => {
    // 创建数据的副本，避免修改原对象
    const processedData = { ...data } as any
    
    if (processedData.id) {
      const numericId = toApiId(processedData.id)
      if (numericId !== null) {
        console.log(`将id从 ${processedData.id} 转换为数字ID: ${numericId}`)
        processedData.id = numericId
      }
    }

    
    return processedData
  }

  /**
   * 处理项目保存
   */
  const handleProjectSave = async (data: Partial<ZdProject>, reloadFunction: () => Promise<void>) => {
    try {
      const projectData = prepareEntityData<ZdProject>(data)
      await entityApis.project.update(projectData as ZdProject)
      toast.toast({
        title: "成功",
        description: "项目更新成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('更新项目失败:', error)
      toast.toast({
        title: "错误",
        description: "更新项目失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理模板保存
   */
  const handleTemplateSave = async (data: Partial<ZdTemplate>, reloadFunction: () => Promise<void>) => {
    try {
      const templateData = prepareEntityData<ZdTemplate>(data)
      await entityApis.template.update(templateData as ZdTemplate)
      toast.toast({
        title: "成功",
        description: "模板更新成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('更新模板失败:', error)
      toast.toast({
        title: "错误",
        description: "更新模板失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理系统保存
   */
  const handleSystemSave = async (data: Partial<ZdPSystem>, reloadFunction: () => Promise<void>) => {
    try {
      console.log('处理系统保存，接收到的数据:', data)
      
      // 使用通用处理函数处理ID转换
      const systemData = prepareEntityData<ZdPSystem>(data)
      console.log('发送到API的系统数据:', systemData)
      
      await entityApis.psystem.update(systemData as ZdPSystem)
      toast.toast({
        title: "成功",
        description: "系统更新成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('更新系统失败:', error)
      toast.toast({
        title: "错误",
        description: "更新系统失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理组件保存
   */
  const handleComponentSave = async (data: Partial<ZdComponent>, reloadFunction: () => Promise<void>) => {
    try {
      console.log('处理组件保存，接收到的数据:', data)
      
      // 使用通用处理函数处理ID转换
      const componentData = prepareEntityData<ZdComponent>(data)
      console.log('发送到API的组件数据:', componentData)
      
      await entityApis.component.update(componentData as ZdComponent)
      toast.toast({
        title: "成功",
        description: "组件更新成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('更新组件失败:', error)
      toast.toast({
        title: "错误",
        description: "更新组件失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理BOM保存
   */
  const handleBomSave = async (data: Partial<ZdBom>, reloadFunction: () => Promise<void>) => {
    try {
      const bomData = prepareEntityData<ZdBom>(data)
      await entityApis.bom.update(bomData as ZdBom)
      toast.toast({
        title: "成功",
        description: "BOM更新成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('更新BOM失败:', error)
      toast.toast({
        title: "错误",
        description: "更新BOM失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理规格书保存
   */
  const handleSpecificationSave = async (data: Partial<ZdSpecification>, reloadFunction: () => Promise<void>) => {
    try {
      // 规格书保存逻辑（通常需要特殊处理）
      if (!data.id) return
      
      // 使用通用函数处理ID转换
      const specData = prepareEntityData<ZdSpecification>(data)
      
      // 创建规格书元数据对象
      const specMeta: ZdSpecificationMeta = {
        name: specData.name || '',
        fileTag: specData.fileTag || '',
        lastVersionId: specData.latestVersionId || 0
      }
      
      // 如果是文件上传，使用update方法
      if (specData.content) {
        const file = new File([specData.content], `${specMeta.name}.html`, { type: 'text/html' })
        await entityApis.specification.update(
          specMeta.fileTag,
          file,
          specMeta
        )
      }
      
      toast.toast({
        title: "成功",
        description: "规格书更新成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('更新规格书失败:', error)
      toast.toast({
        title: "错误",
        description: "更新规格书失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理项目创建
   */
  const handleProjectCreate = async (data: Partial<ZdProject>, reloadFunction: () => Promise<void>) => {
    try {
      const projectData = prepareEntityData<ZdProject>(data)
      await entityApis.project.create(projectData as ZdProject)
      toast.toast({
        title: "成功",
        description: "项目创建成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('创建项目失败:', error)
      toast.toast({
        title: "错误",
        description: "创建项目失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理模板创建
   */
  const handleTemplateCreate = async (data: Partial<ZdTemplate>, reloadFunction: () => Promise<void>) => {
    try {
      const templateData = prepareEntityData<ZdTemplate>(data)
      await entityApis.template.create(templateData as ZdTemplate)
      toast.toast({
        title: "成功",
        description: "模板创建成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('创建模板失败:', error)
      toast.toast({
        title: "错误",
        description: "创建模板失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理系统创建
   */
  const handleSystemCreate = async (data: Partial<ZdPSystem>, reloadFunction: () => Promise<void>) => {
    try {
      console.log('处理系统创建，接收到的数据:', data)
      
      // 使用通用处理函数处理ID转换
      const systemData = prepareEntityData<ZdPSystem>(data)
      console.log('发送到API的系统数据:', systemData)
      
      await entityApis.psystem.create(systemData as ZdPSystem)
      toast.toast({
        title: "成功",
        description: "系统创建成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('创建系统失败:', error)
      toast.toast({
        title: "错误",
        description: "创建系统失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理组件创建
   */
  const handleComponentCreate = async (data: Partial<ZdComponent>, reloadFunction: () => Promise<void>) => {
    try {
      console.log('处理组件创建，接收到的数据:', data)
      
      // 使用通用处理函数处理ID转换
      const componentData = prepareEntityData<ZdComponent>(data)
      console.log('发送到API的组件数据:', componentData)
      
      await entityApis.component.create(componentData as ZdComponent)
      toast.toast({
        title: "成功",
        description: "组件创建成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('创建组件失败:', error)
      toast.toast({
        title: "错误",
        description: "创建组件失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理BOM创建
   */
  const handleBomCreate = async (data: Partial<ZdBom>, reloadFunction: () => Promise<void>) => {
    try {
      const bomData = prepareEntityData<ZdBom>(data)
      await entityApis.bom.create(bomData as ZdBom)
      toast.toast({
        title: "成功",
        description: "BOM创建成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('创建BOM失败:', error)
      toast.toast({
        title: "错误",
        description: "创建BOM失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理规格书创建
   */
  const handleSpecificationCreate = async (data: Partial<ZdSpecification>, reloadFunction: () => Promise<void>) => {
    try {
      // 规格书创建逻辑（通常需要特殊处理）
      const specMeta: ZdSpecificationMeta = {
        name: data.name || '',
        fileTag: data.fileTag || '',
        lastVersionId: data.latestVersionId || 0
      }
      
      if (data.content) {
        const file = new File([data.content], `${specMeta.name}.html`, { type: 'text/html' })
        await entityApis.specification.upload(
          specMeta.fileTag,
          file,
          specMeta
        )
      }
      
      toast.toast({
        title: "成功",
        description: "规格书创建成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('创建规格书失败:', error)
      toast.toast({
        title: "错误",
        description: "创建规格书失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理产品类型保存
   * @param data 产品类型数据
   * @param reloadFunction 保存后刷新数据的函数
   */
  const handlePtypeSave = async (data: Partial<ZdPType>, reloadFunction: () => Promise<void>) => {
    try {
      // 准备数据，移除不需要的属性
      const ptypeData = prepareEntityData(data)
      
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
      await reloadFunction()
    } catch (error) {
      console.error('更新产品类型失败:', error)
      toast.toast({
        title: "错误",
        description: "更新产品类型失败",
        variant: "destructive",
      })
    }
  }
  
  /**
   * 处理产品类型创建
   * @param data 产品类型数据
   * @param reloadFunction 创建后刷新数据的函数
   */
  const handlePtypeCreate = async (data: Partial<ZdPType>, reloadFunction: () => Promise<void>) => {
    try {
      // 准备数据，移除不需要的属性
      const ptypeData = prepareEntityData(data)
      
      // 移除空的时间字段，避免数据库错误
      if ('createdTime' in ptypeData && !ptypeData.createdTime) {
        delete ptypeData.createdTime;
      }
      if ('updatedTime' in ptypeData && !ptypeData.updatedTime) {
        delete ptypeData.updatedTime;
      }
      
      console.log('提交产品类型数据:', ptypeData)
      
      // 调用API创建产品类型数据
      await entityApis.ptype.create(ptypeData as ZdPType)
      
      toast.toast({
        title: "成功",
        description: "产品类型创建成功",
      })
      await reloadFunction()
    } catch (error) {
      console.error('创建产品类型失败:', error)
      toast.toast({
        title: "错误",
        description: "创建产品类型失败",
        variant: "destructive",
      })
    }
  }

  /**
   * 处理数据保存的通用函数
   * @param data 要保存的数据
   * @param nodeType 节点类型
   * @param reloadFunction 保存后刷新数据的函数
   */
  const handleSave = (data: any, nodeType: string, reloadFunction: () => Promise<void>) => {
    console.log('保存数据:', data, '节点类型:', nodeType)
    
    switch(nodeType) {
      case NODE_TYPES.PROJECT:
        return handleProjectSave(data, reloadFunction)
      case NODE_TYPES.TEMPLATE:
        return handleTemplateSave(data, reloadFunction)
      case NODE_TYPES.PSYSTEM:
        return handleSystemSave(data, reloadFunction)
      case NODE_TYPES.COMPONENT:
        return handleComponentSave(data, reloadFunction)
      case NODE_TYPES.BOM:
        return handleBomSave(data, reloadFunction)
      case NODE_TYPES.SPECIFICATION:
        return handleSpecificationSave(data, reloadFunction)
      case NODE_TYPES.PTYPE:
        return handlePtypeSave(data, reloadFunction)
      default:
        console.warn('未处理的节点类型:', nodeType)
    }
  }
  
  /**
   * 处理新数据创建的通用函数
   * @param data 要创建的数据
   * @param nodeType 节点类型
   * @param reloadFunction 创建后刷新数据的函数
   */
  const handleCreate = (data: any, nodeType: string, reloadFunction: () => Promise<void>) => {
    console.log('创建数据:', data, '节点类型:', nodeType)
    
    switch(nodeType) {
      case NODE_TYPES.PROJECT:
        return handleProjectCreate(data, reloadFunction)
      case NODE_TYPES.TEMPLATE:
        return handleTemplateCreate(data, reloadFunction)
      case NODE_TYPES.PSYSTEM:
        return handleSystemCreate(data, reloadFunction)
      case NODE_TYPES.COMPONENT:
        return handleComponentCreate(data, reloadFunction)
      case NODE_TYPES.BOM:
        return handleBomCreate(data, reloadFunction)
      case NODE_TYPES.SPECIFICATION:
        return handleSpecificationCreate(data, reloadFunction)
      case NODE_TYPES.PTYPE:
        return handlePtypeCreate(data, reloadFunction)
      default:
        console.warn('未处理的节点类型:', nodeType)
    }
  }

  return {
    handleSave,
    handleCreate,
    handleProjectSave,
    handleTemplateSave,
    handleSystemSave,
    handleComponentSave,
    handleBomSave,
    handleSpecificationSave,
    handlePtypeSave,
    handleProjectCreate,
    handleTemplateCreate,
    handleSystemCreate,
    handleComponentCreate,
    handleBomCreate,
    handleSpecificationCreate,
    handlePtypeCreate,
    prepareEntityData
  }
}
