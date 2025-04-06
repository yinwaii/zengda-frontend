import { useToast } from '@/components/ui/toast'
import { NODE_TYPES } from '~/utils/treeNodeFactory'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdComponent } from '~/models/entity/component'
import type { ZdBom } from '~/models/entity/bom'
import type { ZdSpecification } from '~/models/entity/specification'
import type { ZdSpecificationMeta } from '~/models/entity/specification'

/**
 * 实体处理函数的复用composable
 * 提供通用的保存和创建实体的处理函数
 */
export const useEntityHandlers = () => {
  const toast = useToast()
  const entityApis = useEntityApis()
  
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
      default:
        console.warn('未处理的节点类型:', nodeType)
    }
  }

  /**
   * 处理项目保存
   */
  const handleProjectSave = async (data: Partial<ZdProject>, reloadFunction: () => Promise<void>) => {
    try {
      await entityApis.project.update(data as ZdProject)
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
      await entityApis.template.update(data as ZdTemplate)
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
      await entityApis.psystem.update(data as ZdPSystem)
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
      await entityApis.component.update(data as ZdComponent)
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
      await entityApis.bom.update(data as ZdBom)
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
      
      // 创建规格书元数据对象
      const specMeta: ZdSpecificationMeta = {
        name: data.name || '',
        fileTag: data.fileTag || '',
        lastVersionId: data.latestVersionId || 0
      }
      
      // 如果是文件上传，使用update方法
      if (data.content) {
        const file = new File([data.content], `${specMeta.name}.html`, { type: 'text/html' })
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
      await entityApis.project.create(data as ZdProject)
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
      await entityApis.template.create(data as ZdTemplate)
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
      await entityApis.psystem.create(data as ZdPSystem)
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
      await entityApis.component.create(data as ZdComponent)
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
      await entityApis.bom.create(data as ZdBom)
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

  return {
    handleSave,
    handleCreate,
    handleProjectSave,
    handleTemplateSave,
    handleSystemSave,
    handleComponentSave,
    handleBomSave,
    handleSpecificationSave,
    handleProjectCreate,
    handleTemplateCreate,
    handleSystemCreate,
    handleComponentCreate,
    handleBomCreate,
    handleSpecificationCreate
  }
} 