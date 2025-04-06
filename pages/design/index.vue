<template>
  <div class="h-full p-6">
    <h1 class="text-2xl font-bold mb-6">设计管理系统</h1>

    <div class="flex flex-col h-[calc(100%-4rem)]">
      <!-- 项目管理树 -->
      <design-dynamic-entity-tree :tree-data="projectTreeData" tree-title="项目管理" :default-expanded-keys="[1]"
        @save="handleProjectSave" @create="handleProjectCreate" class="h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '@/components/ui/toast'
import { NODE_TYPES } from '~/utils/treeNodeFactory'
import type { TreeNodeData } from '~/components/abstract/tree/types'

const toast = useToast()
const entityApis = useEntityApis()
const entityTree = useEntityTree()

// 项目树数据
const projectTreeData = ref<TreeNodeData[]>([])
// 加载状态
const isLoading = ref(false)

// 显示消息通知包装函数
const showMessage = {
  success: (message: string) => {
    toast.toast({
      title: "成功",
      description: message,
      variant: "default",
    })
  },
  error: (message: string) => {
    toast.toast({
      title: "错误",
      description: message,
      variant: "destructive",
    })
  }
}

// 处理项目保存
const handleProjectSave = async (data: any, type: string) => {
  try {
    // 确保数据中有原始ID
    const originalId = data.originalId || (data.originalData ? data.originalData.id : null);
    if (!originalId) {
      console.error('保存失败：无法获取原始ID');
      showMessage.error('保存失败：无法获取原始ID');
      return;
    }

    // 确保原始ID是数字类型
    const numOriginalId = Number(originalId);
    if (isNaN(numOriginalId)) {
      console.error(`保存失败：原始ID "${originalId}" 不是有效的数字`);
      showMessage.error('保存失败：原始ID不是有效的数字');
      return;
    }

    // 准备向API发送的数据 - 确保使用原始ID
    const apiData = {
      ...data,
      id: numOriginalId
    };

    // 如果有原始数据，合并其中的非ID字段
    if (data.originalData) {
      Object.keys(data.originalData).forEach(key => {
        if (key !== 'id' && !(key in apiData)) {
          apiData[key] = data.originalData[key];
        }
      });
    }

    // 删除可能造成API问题的字段
    delete apiData.originalData;
    delete apiData.originalId;
    delete apiData.children;
    delete apiData.components;
    delete apiData.type; // 删除前端特有的类型字段

    console.log(`准备保存${type}数据:`, apiData);

    // 根据不同类型调用相应的API
    if (type === NODE_TYPES.PROJECT) {
      await entityApis.project.update(apiData);
      showMessage.success('项目更新成功');
    } else if (type === NODE_TYPES.TEMPLATE) {
      await entityApis.template.update(apiData);
      showMessage.success('模板更新成功');
    } else if (type === NODE_TYPES.COMPONENT) {
      await entityApis.component.update(apiData);
      showMessage.success('组件更新成功');
    } else if (type === NODE_TYPES.PSYSTEM) {
      await entityApis.psystem.update(apiData);
      showMessage.success('系统更新成功');
    }

    // 重新加载数据
    await loadProjectData();
  } catch (err) {
    console.error('保存失败:', err);
    showMessage.error('保存失败');
  }
}

// 处理项目创建
const handleProjectCreate = async (data: any, type: string) => {
  try {
    // 准备向API发送的数据 - 确保不包含复合ID
    const apiData = { ...data };

    // 删除ID和其他与API不兼容的字段
    delete apiData.id;
    delete apiData.originalId;
    delete apiData.originalData;
    delete apiData.children;
    delete apiData.components;
    delete apiData.type; // 删除前端特有的类型字段

    console.log(`准备创建${type}数据:`, apiData);

    // 根据不同类型调用相应的API
    if (type === NODE_TYPES.PROJECT) {
      await entityApis.project.create(apiData);
      showMessage.success('项目创建成功');
    } else if (type === NODE_TYPES.TEMPLATE) {
      await entityApis.template.create(apiData);
      showMessage.success('模板创建成功');
    } else if (type === NODE_TYPES.COMPONENT) {
      await entityApis.component.create(apiData);
      showMessage.success('组件创建成功');
    } else if (type === NODE_TYPES.PSYSTEM) {
      await entityApis.psystem.create(apiData);
      showMessage.success('系统创建成功');
    }

    // 重新加载数据
    await loadProjectData();
  } catch (err) {
    console.error('创建失败:', err);
    showMessage.error('创建失败');
  }
}

/**
 * 加载完整的项目数据树，包括关联的模板、产品系统和组件
 */
const loadProjectData = async () => {
  try {
    isLoading.value = true;
    const { treeData, loading } = await entityTree.loadEntityTree({
      page: 1,
      size: 10,
      loadTemplates: true,
      loadSystems: true,
      loadComponents: true,
      loadFullComponents: true,
      loadBoms: true,
      loadSpecifications: true
    });
    
    // 更新树数据
    projectTreeData.value = treeData;
    showMessage.success('加载数据成功');
  } catch (err) {
    console.error('加载数据失败:', err);
    showMessage.error('加载数据失败');
    projectTreeData.value = [];
  } finally {
    isLoading.value = false;
  }
}

// 初始化
onMounted(async () => {
  await loadProjectData()
})

// 页面元数据
definePageMeta({
  layout: 'default',
  middleware: ['auth'] as any, // 类型断言避免类型错误
  name: 'design-index' // 添加唯一名称
})
</script>
