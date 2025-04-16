<template>
  <shadcn-dialog :open="open" @update:open="setIsOpen">
    <shadcn-dialog-content class="sm:max-w-[500px] max-h-[80vh]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ project?.id ? '编辑项目' : '新建项目' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ project?.id ? '修改项目信息' : '创建新的项目' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      <div class="overflow-y-auto max-h-[calc(80vh-8rem)]">
        <form @submit.prevent="handleSubmit">
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="name" class="text-right">名称</shadcn-label>
              <shadcn-input id="name" v-model="form.name" class="col-span-3" required />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="description" class="text-right">描述</shadcn-label>
              <shadcn-textarea id="description" v-model="form.description" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="productTypeId" class="text-right">产品类型</shadcn-label>
              <shadcn-select v-model="form.productTypeId" class="col-span-3">
                <shadcn-select-trigger>
                  <shadcn-select-value :placeholder="productTypes.length ? '选择产品类型' : '暂无产品类型'" />
                </shadcn-select-trigger>
                <shadcn-select-content>
                  <shadcn-select-group>
                    <shadcn-select-item v-for="type in productTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </shadcn-select-item>
                  </shadcn-select-group>
                </shadcn-select-content>
              </shadcn-select>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="templateId" class="text-right">项目模板</shadcn-label>
              <shadcn-select v-model="form.templateId" class="col-span-3">
                <shadcn-select-trigger>
                  <shadcn-select-value :placeholder="templates.length ? '选择项目模板' : '暂无项目模板'" />
                </shadcn-select-trigger>
                <shadcn-select-content>
                  <shadcn-select-group>
                    <shadcn-select-item v-for="template in templates" :key="template.id" :value="template.id">
                      {{ template.name }}
                    </shadcn-select-item>
                  </shadcn-select-group>
                </shadcn-select-content>
              </shadcn-select>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="quantity" class="text-right">数量</shadcn-label>
              <shadcn-input id="quantity" v-model="form.quantity" type="number" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="model" class="text-right">模型</shadcn-label>
              <shadcn-input id="model" v-model="form.model" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="attention" class="text-right">注意力</shadcn-label>
              <shadcn-input id="attention" v-model="form.attention" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="company" class="text-right">公司</shadcn-label>
              <shadcn-input id="company" v-model="form.company" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="tel" class="text-right">电话</shadcn-label>
              <shadcn-input id="tel" v-model="form.tel" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="mob" class="text-right">手机</shadcn-label>
              <shadcn-input id="mob" v-model="form.mob" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="fax" class="text-right">传真</shadcn-label>
              <shadcn-input id="fax" v-model="form.fax" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="email" class="text-right">邮件</shadcn-label>
              <shadcn-input id="email" v-model="form.email" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="number" class="text-right">号码</shadcn-label>
              <shadcn-input id="number" v-model="form.number" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="date" class="text-right">日期</shadcn-label>
              <shadcn-input id="date" v-model="form.date" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="valid" class="text-right">是否合法</shadcn-label>
              <shadcn-input id="valid" v-model="form.valid" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="price" class="text-right">价格</shadcn-label>
              <shadcn-input id="price" v-model="form.price" class="col-span-3" />
            </div>
          </div>
          <shadcn-dialog-footer>
            <shadcn-button type="submit">保存</shadcn-button>
          </shadcn-dialog-footer>
        </form>
      </div>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  open: boolean
  project?: ZdProject | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', project: ZdProject): void
}>()

const form = ref<{
  name: string
  description?: string
  productTypeId: number
  templateId: number
  quantity?: number
  model?: string
  attention?: string
  company?: string
  tel?: string
  mob?: string
  fax?: string
  email?: string
  number?: string
  date?: string
  valid?: string
  price?: string
}>({
  name: '',
  description: '',
  productTypeId: 1,
  templateId: 1,
  quantity: 1,
  model: '',
  attention: '',
  company: '',
  tel: '',
  mob: '',
  fax: '',
  email: '',
  number: '',
  date: '',
  valid: '',
  price: ''
})
const templates = ref<ZdTemplate[]>([])
const productTypes = ref<any[]>([])
const entityApis = useEntityApis()

// 加载下拉框数据
onMounted(async () => {
  try {
    // 获取模板列表
    const templateResponse = await entityApis.template.getByPage(0, 1000)
    templates.value = templateResponse.content || []
    
    // 尝试获取产品类型
    try {
      const typeResponse = await entityApis.ptype.getAll()
      productTypes.value = typeResponse || []
    } catch (error) {
      console.warn('无法获取产品类型列表:', error)
      productTypes.value = []
    }
    
  } catch (error) {
    console.error('加载数据失败:', error)
  }
})

// 监听项目变化，初始化表单
watch(() => props.project, (newProject) => {
  if (newProject) {
    form.value = {
      name: newProject.name,
      description: newProject.description,
      productTypeId: newProject.productTypeId,
      templateId: newProject.templateId,
      quantity: newProject.quantity,
      model: newProject.model,
      attention: newProject.attention,
      company: newProject.company,
      tel: newProject.tel,
      mob: newProject.mob,
      fax: newProject.fax,
      email: newProject.email,
      number: newProject.number,
      date: newProject.date,
      valid: newProject.valid,
      price: newProject.price
    }
  } else {
    form.value = {
      name: '',
      description: '',
      productTypeId: 1,
      templateId: 1,
      quantity: 1,
      model: '',
      attention: '',
      company: '',
      tel: '',
      mob: '',
      fax: '',
      email: '',
      number: '',
      date: '',
      valid: '',
      price: ''
    }
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    form.value = {
      name: '',
      description: '',
      productTypeId: 1,
      templateId: 1,
      quantity: 1,
      model: '',
      attention: '',
      company: '',
      tel: '',
      mob: '',
      fax: '',
      email: '',
      number: '',
      date: '',
      valid: '',
      price: ''
    }
  }
})

// 设置对话框开关状态
const setIsOpen = (value: boolean) => {
  emit('update:open', value)
}

// 处理表单提交
const handleSubmit = (event: Event) => {
  // 阻止表单默认提交行为
  if (event) event.preventDefault()
  
  // 表单验证
  if (!form.value.name) {
    console.error('项目名称不能为空')
    return
  }
  
  // 创建新的项目对象，不包含 id 和 isDeleted
  const newProject = {
    name: form.value.name,
    description: form.value.description,
    productTypeId: form.value.productTypeId,
    templateId: form.value.templateId,
    quantity: form.value.quantity,
    model: form.value.model,
    attention: form.value.attention,
    company: form.value.company,
    tel: form.value.tel,
    mob: form.value.mob,
    fax: form.value.fax,
    email: form.value.email,
    number: form.value.number,
    date: form.value.date,
    valid: form.value.valid,
    price: form.value.price
  }
  
  // 使用 JSON 序列化再解析创建普通对象深拷贝，移除 Proxy
  const plainData = JSON.parse(JSON.stringify(newProject))
  
  // 触发保存事件，将数据作为 data 参数传递
  emit('save', plainData)
  
  // 关闭对话框
  setIsOpen(false)
}
</script> 