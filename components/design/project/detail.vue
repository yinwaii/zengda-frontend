<template>
	<div class="space-y-6">
		<!-- 配置选择器区域 -->
		<shadcn-card v-if="configurations">
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-medium">项目配置</h3>
					<div class="flex items-center gap-2">
						<shadcn-button size="sm" variant="outline" @click="handleAddConfig">
							<LucidePlus class="h-4 w-4 mr-1" />
							新增配置
						</shadcn-button>
					</div>
				</div>
			</shadcn-card-header>
			<shadcn-card-content>
				<div class="flex items-center gap-3">
					<shadcn-select v-model="selectedConfigId">
						<shadcn-select-trigger class="w-full max-w-xs">
							<template #default>
								{{ getSelectedConfigName() }}
							</template>
						</shadcn-select-trigger>
						<shadcn-select-content>
							<shadcn-select-item v-for="config in configurations" :key="config.id" :value="config.id">
								{{ config.id }} - 最后更新: {{ formatDate(config.updatedTime) || formatDate(config.createdTime) || '未知' }}
							</shadcn-select-item>
						</shadcn-select-content>
					</shadcn-select>
					<shadcn-button size="sm" variant="outline" @click="handleEditConfig" :disabled="!selectedConfig">
						<LucidePencil class="h-4 w-4 mr-1" />
						编辑
					</shadcn-button>
					<shadcn-button size="sm" variant="destructive" @click="handleDeleteConfig" :disabled="!selectedConfig">
						<LucideTrash class="h-4 w-4 mr-1" />
						删除
					</shadcn-button>
				</div>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-card>
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold">{{ project.name }}</h2>
						<p class="text-sm text-muted-foreground mt-1">{{ project.description || '暂无描述' }}</p>
					</div>
					<div class="flex items-center gap-2">
						<shadcn-button @click="$emit('edit')">
							<LucidePencil class="mr-2 h-4 w-4" />
							编辑
						</shadcn-button>
					</div>
				</div>
			</shadcn-card-header>
			<shadcn-card-content>
				<template v-if="isEditing">
					<form @submit.prevent="handleSubmit" class="space-y-4">
						<div class="space-y-2">
							<shadcn-label for="name">名称</shadcn-label>
							<shadcn-input id="name" v-model="editForm.name" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="description">描述</shadcn-label>
							<shadcn-textarea id="description" v-model="editForm.description" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="productTypeId">产品类型</shadcn-label>
							<shadcn-select v-model="editForm.productTypeId">
								<shadcn-select-trigger>
									<shadcn-select-value :placeholder="'选择产品类型'" />
								</shadcn-select-trigger>
								<shadcn-select-content>
									<shadcn-select-item v-for="type in productTypes" :key="type.id" :value="type.id">
										{{ type.name }}
									</shadcn-select-item>
								</shadcn-select-content>
							</shadcn-select>
						</div>
						<div class="space-y-2">
							<shadcn-label for="templateId">模板</shadcn-label>
							<shadcn-select v-model="editForm.templateId">
								<shadcn-select-trigger>
									<shadcn-select-value :placeholder="'选择模板'" />
								</shadcn-select-trigger>
								<shadcn-select-content>
									<shadcn-select-item v-for="template in templates" :key="template.id" :value="template.id">
										{{ template.name }}
									</shadcn-select-item>
								</shadcn-select-content>
							</shadcn-select>
						</div>
						<div class="space-y-2">
							<shadcn-label for="quantity">数量</shadcn-label>
							<shadcn-input id="quantity" v-model="editForm.quantity" type="number" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="model">模型</shadcn-label>
							<shadcn-input id="model" v-model="editForm.model" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="attention">注意力</shadcn-label>
							<shadcn-input id="attention" v-model="editForm.attention" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="company">公司</shadcn-label>
							<shadcn-input id="company" v-model="editForm.company" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="tel">电话</shadcn-label>
							<shadcn-input id="tel" v-model="editForm.tel" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="mob">手机</shadcn-label>
							<shadcn-input id="mob" v-model="editForm.mob" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="fax">传真</shadcn-label>
							<shadcn-input id="fax" v-model="editForm.fax" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="email">邮件</shadcn-label>
							<shadcn-input id="email" v-model="editForm.email" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="number">号码</shadcn-label>
							<shadcn-input id="number" v-model="editForm.number" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="date">日期</shadcn-label>
							<shadcn-input id="date" v-model="editForm.date" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="valid">是否合法</shadcn-label>
							<shadcn-input id="valid" v-model="editForm.valid" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="price">价格</shadcn-label>
							<shadcn-input id="price" v-model="editForm.price" />
						</div>
						<div class="flex justify-end gap-2">
							<shadcn-button type="button" variant="outline" @click="$emit('cancel')">
								取消
							</shadcn-button>
							<shadcn-button type="submit">
								保存
							</shadcn-button>
						</div>
					</form>
				</template>
				<template v-else>
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">ID</dt>
							<dd class="mt-1">{{ project.id }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">名称</dt>
							<dd class="mt-1">{{ project.name }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">描述</dt>
							<dd class="mt-1">{{ project.description || '暂无描述' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">产品类型</dt>
							<dd class="mt-1">{{ getProductTypeName(project.productTypeId) }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">模板</dt>
							<dd class="mt-1">{{ getTemplateName(project.templateId) }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">数量</dt>
							<dd class="mt-1">{{ project.quantity || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">模型</dt>
							<dd class="mt-1">{{ project.model || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">注意力</dt>
							<dd class="mt-1">{{ project.attention || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">公司</dt>
							<dd class="mt-1">{{ project.company || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">电话</dt>
							<dd class="mt-1">{{ project.tel || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">手机</dt>
							<dd class="mt-1">{{ project.mob || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">传真</dt>
							<dd class="mt-1">{{ project.fax || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">邮件</dt>
							<dd class="mt-1">{{ project.email || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">号码</dt>
							<dd class="mt-1">{{ project.number || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">日期</dt>
							<dd class="mt-1">{{ project.date || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">是否合法</dt>
							<dd class="mt-1">{{ project.valid || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">价格</dt>
							<dd class="mt-1">{{ project.price || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">创建人</dt>
							<dd class="mt-1">{{ project.createdBy || '暂无创建人' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
							<dd class="mt-1">{{ formatDate(project.createdTime) || '暂无创建时间' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">修改人</dt>
							<dd class="mt-1">{{ project.updatedBy || '暂无修改人' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
							<dd class="mt-1">{{ formatDate(project.updatedTime) || '暂无修改时间' }}</dd>
						</div>

						<!-- 添加报价和规格书生成按钮 -->
						<div class="space-y-2 p-4 border rounded-lg col-span-2">
							<dt class="text-sm font-medium text-muted-foreground">项目操作</dt>
							<dd class="mt-3 flex gap-3">
								<shadcn-button variant="outline" @click="openPriceDialog">
									<LucideCalculator class="mr-2 h-4 w-4" />
									报价结果计算
								</shadcn-button>
								<shadcn-button variant="outline" @click="generateSpecification" :disabled="specLoading">
									<LucideFileText class="mr-2 h-4 w-4" />
									{{ specLoading ? '生成中...' : '规格书生成' }}
								</shadcn-button>
							</dd>
						</div>
					</div>
					<div class="flex justify-end mt-4">
						<shadcn-button @click="$emit('edit')">
							<LucidePencil class="mr-2 h-4 w-4" />
							编辑
						</shadcn-button>
					</div>
				</template>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<design-parameter-preview :nodeId="project.id" type="project" />

		<!-- 配置数据表格区域 -->
		<shadcn-card v-if="selectedConfig">
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-medium">配置信息</h3>
					<h4 v-if="currentNodeName" class="text-sm font-medium text-muted-foreground">
						当前节点: {{ currentNodeName }}
					</h4>
				</div>
			</shadcn-card-header>
			<shadcn-card-content>
				<div class="grid grid-cols-2 gap-4 mb-4">
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">配置ID</dt>
						<dd class="mt-1">{{ selectedConfig?.id }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">最后版本ID</dt>
						<dd class="mt-1">{{ selectedConfig?.lastVersionId }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">是否显示</dt>
						<dd class="mt-1">
							<shadcn-badge :variant="selectedConfig?.isShow ? 'default' : 'outline'">
								{{ selectedConfig?.isShow ? '是' : '否' }}
							</shadcn-badge>
						</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">更新时间</dt>
						<dd class="mt-1">{{ formatDate(selectedConfig?.updatedTime) || formatDate(selectedConfig?.createdTime) || '暂无' }}</dd>
					</div>
				</div>

				<shadcn-tabs default-value="arguments" class="w-full">
					<shadcn-tabs-list class="grid w-full grid-cols-3">
						<shadcn-tabs-trigger value="arguments">节点参数</shadcn-tabs-trigger>
						<shadcn-tabs-trigger value="valueConfig">值配置</shadcn-tabs-trigger>
						<shadcn-tabs-trigger value="componentConfig">组件配置</shadcn-tabs-trigger>
					</shadcn-tabs-list>
					
					<shadcn-tabs-content value="arguments" class="pt-4">
						<div class="flex justify-between items-center mb-4">
							<h3 class="text-base font-semibold">节点参数配置</h3>
							<shadcn-button size="sm" variant="outline" @click="handleAddArgument">
								<LucidePlus class="h-4 w-4 mr-1" />
								新增参数
							</shadcn-button>
						</div>
						
						<div v-if="isEditingArgument" class="border p-4 rounded-lg mb-4">
							<h4 class="text-sm font-medium mb-3">{{ editingArgument.id ? '编辑参数' : '新增参数' }}</h4>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-4">
									<div class="space-y-2">
										<shadcn-label for="arg-name">参数名称</shadcn-label>
										<shadcn-input id="arg-name" v-model="editingArgument.name" placeholder="输入参数名称" />
									</div>
									<div class="space-y-2">
										<shadcn-label for="arg-type">参数类型</shadcn-label>
										<shadcn-select v-model="editingArgument.type">
											<shadcn-select-trigger>
												<shadcn-select-value placeholder="选择参数类型" />
											</shadcn-select-trigger>
											<shadcn-select-content>
												<shadcn-select-item value="string">字符串</shadcn-select-item>
												<shadcn-select-item value="number">数字</shadcn-select-item>
												<shadcn-select-item value="boolean">布尔值</shadcn-select-item>
												<shadcn-select-item value="object">对象</shadcn-select-item>
												<shadcn-select-item value="array">数组</shadcn-select-item>
											</shadcn-select-content>
										</shadcn-select>
									</div>
								</div>
								<div class="space-y-2">
									<shadcn-label for="arg-value">参数值</shadcn-label>
									<shadcn-textarea id="arg-value" v-model="editingArgument.value" placeholder="输入参数值" />
									<p class="text-xs text-muted-foreground">
										根据选择的类型输入相应格式的值。数字类型直接输入数字，布尔类型输入true/false，对象和数组请输入有效的JSON格式。
									</p>
								</div>
								<div class="flex justify-end space-x-2">
									<shadcn-button variant="outline" @click="cancelEditArgument">取消</shadcn-button>
									<shadcn-button @click="saveArgument">保存</shadcn-button>
								</div>
							</div>
						</div>
						
						<div v-if="objectArgument && objectArgument.arguments && objectArgument.arguments.length > 0">
							<div class="rounded-md border">
								<shadcn-table>
									<shadcn-table-header>
										<shadcn-table-row>
											<shadcn-table-head>名称</shadcn-table-head>
											<shadcn-table-head>类型</shadcn-table-head>
											<shadcn-table-head>值</shadcn-table-head>
											<shadcn-table-head class="w-[100px]">操作</shadcn-table-head>
										</shadcn-table-row>
									</shadcn-table-header>
									<shadcn-table-body>
										<shadcn-table-row v-for="arg in objectArgument.arguments" :key="arg.id">
											<shadcn-table-cell>{{ arg.name }}</shadcn-table-cell>
											<shadcn-table-cell>{{ arg.type }}</shadcn-table-cell>
											<shadcn-table-cell class="max-w-[300px] truncate" :title="arg.value">
												{{ arg.value }}
											</shadcn-table-cell>
											<shadcn-table-cell>
												<div class="flex items-center gap-2">
													<shadcn-button size="icon" variant="ghost" @click="handleEditArgument(arg)">
														<LucidePencil class="h-4 w-4" />
													</shadcn-button>
													<shadcn-button size="icon" variant="ghost" @click="handleDeleteArgument(arg)">
														<LucideTrash class="h-4 w-4" />
													</shadcn-button>
												</div>
											</shadcn-table-cell>
										</shadcn-table-row>
									</shadcn-table-body>
								</shadcn-table>
							</div>
						</div>
						<div v-else-if="objectArgument" class="p-4 bg-muted/10 rounded-lg text-center">
							<p class="text-muted-foreground">当前节点暂无参数配置</p>
							<shadcn-button variant="outline" size="sm" class="mt-2" @click="handleAddArgument">
								添加第一个参数
							</shadcn-button>
						</div>
						<div v-else class="p-4 bg-muted/10 rounded-lg text-center">
							<p class="text-muted-foreground">请选择一个节点查看配置参数</p>
						</div>
					</shadcn-tabs-content>
					
					<shadcn-tabs-content value="valueConfig">
						<div class="p-4 bg-muted/20 rounded-lg">
							<pre class="overflow-auto max-h-80 text-xs whitespace-pre-wrap">{{ formatConfig(selectedConfig?.valueConfig) }}</pre>
						</div>
					</shadcn-tabs-content>
					
					<shadcn-tabs-content value="componentConfig">
						<div class="p-4 bg-muted/20 rounded-lg">
							<pre class="overflow-auto max-h-80 text-xs whitespace-pre-wrap">{{ formatConfig(selectedConfig?.componentConfig) }}</pre>
						</div>
					</shadcn-tabs-content>
				</shadcn-tabs>
			</shadcn-card-content>
		</shadcn-card>
	</div>

	<!-- 配置对话框 -->
	<configuration-dialog 
		:modelValue="showConfigDialog"
		@update:modelValue="showConfigDialog = $event"
		:editing-item="editingConfig"
		@submit="onConfigSubmit" 
	/>

	<!-- 确认删除对话框 -->
	<shadcn-alert-dialog v-model:open="showDeleteConfirm">
		<shadcn-alert-dialog-content>
			<shadcn-alert-dialog-header>
				<shadcn-alert-dialog-title>确认删除</shadcn-alert-dialog-title>
				<shadcn-alert-dialog-description>
					您确定要删除此配置吗？此操作不可撤销。
				</shadcn-alert-dialog-description>
			</shadcn-alert-dialog-header>
			<shadcn-alert-dialog-footer>
				<shadcn-alert-dialog-cancel>取消</shadcn-alert-dialog-cancel>
				<shadcn-alert-dialog-action @click="confirmDelete">删除</shadcn-alert-dialog-action>
			</shadcn-alert-dialog-footer>
		</shadcn-alert-dialog-content>
	</shadcn-alert-dialog>

	<!-- 报价结果对话框 -->
	<shadcn-dialog v-model:open="isPriceDialogOpen">
		<shadcn-dialog-content class="max-w-3xl">
			<shadcn-dialog-header>
				<shadcn-dialog-title>报价结果计算</shadcn-dialog-title>
				<shadcn-dialog-description>
					选择配置并查看相关的报价结果
				</shadcn-dialog-description>
			</shadcn-dialog-header>

			<div class="space-y-4">
				<!-- 配置选择 -->
				<div class="space-y-2">
					<shadcn-label for="price-config">选择配置</shadcn-label>
					<shadcn-select v-model="priceConfigId" @update:modelValue="loadPriceData">
						<shadcn-select-trigger id="price-config" class="w-full">
							<shadcn-select-value placeholder="选择配置"></shadcn-select-value>
						</shadcn-select-trigger>
						<shadcn-select-content>
							<shadcn-select-item v-for="config in configurations" :key="config.id" :value="config.id">
								{{ config.id }} - 最后更新: {{ formatDate(config.updatedTime) || formatDate(config.createdTime) || '未知' }}
							</shadcn-select-item>
						</shadcn-select-content>
					</shadcn-select>
				</div>

				<!-- 加载状态 -->
				<div v-if="priceLoading" class="flex justify-center py-8">
					<div class="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
				</div>

				<!-- 价格信息 -->
				<div v-else-if="priceData">
					<div class="flex justify-between items-center mb-4">
						<div>
							<h4 class="text-lg font-semibold">总价: {{ formatPrice(priceData.totalPrice) }}</h4>
							<p class="text-sm text-muted-foreground">配置ID: {{ priceData.configId }}</p>
						</div>
					</div>

					<!-- 价格项表格 -->
					<abstract-data-table :columns="priceColumns" :data="priceItems" searchColumn="name"
						searchPlaceholder="搜索价格项名称...">
					</abstract-data-table>
				</div>

				<!-- 空状态 -->
				<div v-else-if="priceConfigId" class="text-center py-8">
					<p class="text-muted-foreground">未找到价格数据</p>
				</div>

				<div v-else class="text-center py-8">
					<p class="text-muted-foreground">请选择一个配置查看报价结果</p>
				</div>
			</div>

			<shadcn-dialog-footer>
				<shadcn-button variant="outline" @click="isPriceDialogOpen = false">
					关闭
				</shadcn-button>
			</shadcn-dialog-footer>
		</shadcn-dialog-content>
	</shadcn-dialog>

	<!-- 确认删除参数对话框 -->
	<shadcn-alert-dialog v-model:open="showDeleteArgConfirm">
		<shadcn-alert-dialog-content>
			<shadcn-alert-dialog-header>
				<shadcn-alert-dialog-title>确认删除参数</shadcn-alert-dialog-title>
				<shadcn-alert-dialog-description>
					您确定要删除此参数吗？此操作不可撤销。
				</shadcn-alert-dialog-description>
			</shadcn-alert-dialog-header>
			<shadcn-alert-dialog-footer>
				<shadcn-alert-dialog-cancel>取消</shadcn-alert-dialog-cancel>
				<shadcn-alert-dialog-action @click="confirmDeleteArgument">删除</shadcn-alert-dialog-action>
			</shadcn-alert-dialog-footer>
		</shadcn-alert-dialog-content>
	</shadcn-alert-dialog>
</template>

<script setup lang="ts">
import { LucidePencil, LucidePlus, LucideTrash, LucideCalculator, LucideFileText } from 'lucide-vue-next'
import { toRaw, computed, ref, watch, onMounted } from 'vue'
import { formatDate } from '~/utils/date'
import type { ZdProject } from '~/models/entity/project'
import type { ZdParameter } from '~/models/entity/parameter'
import type { ZdConfiguration } from '~/models/entity/configuration'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdObjectArgument, ZdParameterArgument } from '~/models/entity/argument'
// import type { ZdPrice, ZdPriceItem } from '~/models/entity/price'
import ConfigurationDialog from '~/components/design/configuration/dialog.vue'
import { useToast } from '~/components/ui/toast'
import { toApiId } from '~/utils/idConverter'

const props = defineProps<{
	project: ZdProject
	isEditing: boolean
	parameters: ZdParameter[]
	data?: TreeNodeData // 可选的树节点数据
}>()

const emit = defineEmits<{
	edit: []
	cancel: []
	save: [form: Partial<ZdProject>]
}>()

const toast = useToast().toast
const entityApis = useEntityApis()

// 计算属性，处理项目数据
const project = computed(() => {
	// 优先使用直接传入的project
	return props.project || {}
})

// 添加下拉框数据
const templates = ref<ZdTemplate[]>([])
const productTypes = ref<any[]>([])

// 加载下拉框数据
const loadDropdownData = async () => {
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
		console.error('加载下拉框数据失败:', error)
	}
}

// 获取产品类型名称
const getProductTypeName = (id: number) => {
	const type = productTypes.value.find(t => t.id === id)
	return type ? type.name : `未知类型 (${id})`
}

// 获取模板名称
const getTemplateName = (id: number) => {
	const template = templates.value.find(t => t.id === id)
	return template ? template.name : `未知模板 (${id})`
}

const editForm = ref<Partial<ZdProject>>({
	id: project.value.id,
	name: project.value.name,
	description: project.value.description,
	productTypeId: project.value.productTypeId,
	templateId: project.value.templateId,
	quantity: project.value.quantity,
	model: project.value.model,
	attention: project.value.attention,
	company: project.value.company,
	tel: project.value.tel,
	mob: project.value.mob,
	fax: project.value.fax,
	email: project.value.email,
	number: project.value.number,
	date: project.value.date,
	valid: project.value.valid,
	price: project.value.price
})

// 配置相关状态
const configurations = ref<ZdConfiguration[]>([])
const selectedConfigId = ref<number | null>(null)
const selectedConfig = computed(() => 
	configurations.value.find(c => c.id === selectedConfigId.value) || null
)

// 对话框状态
const showConfigDialog = ref(false)
const editingConfig = ref<ZdConfiguration | undefined>(undefined)
const showDeleteConfirm = ref(false)

// 获取所有配置
const loadConfigurations = async () => {
	try {
		if (!project.value || !project.value.id || !project.value.templateId) return

		// 使用toApiId转换项目ID为纯数字
		const projectNumericId = toApiId(project.value.id)
		if (projectNumericId === null) {
			console.error('无法将项目ID转换为有效的数字ID')
			toast({
				title: '错误',
				description: '项目ID格式无效',
				variant: 'destructive'
			})
			return
		}
		
		const response = await entityApis.configuration.getByTemplateId(
			project.value.templateId,
			projectNumericId
		)

		if (response && response.list && response.list.length > 0) {
			configurations.value = response.list
			// 默认选择第一个配置
			if (!selectedConfigId.value && response.list.length > 0) {
				selectedConfigId.value = response.list[0].id
			}
			
			// 加载当前节点的参数
			if (selectedConfigId.value && currentNode.value) {
				console.log('配置加载完成，开始加载参数:', selectedConfigId.value, currentNode.value)
				await loadNodeArguments()
			}
		} else {
			configurations.value = []
			selectedConfigId.value = null
			objectArgument.value = null
		}
	} catch (error) {
		console.error('加载配置列表失败:', error)
		toast({
			title: '错误',
			description: '加载配置列表失败',
			variant: 'destructive'
		})
	}
}

// 处理新增配置
const handleAddConfig = () => {
	editingConfig.value = undefined // 确保不是编辑模式
	showConfigDialog.value = true
}

// 处理编辑配置
const handleEditConfig = () => {
	if (!selectedConfig.value) return
	editingConfig.value = selectedConfig.value
	showConfigDialog.value = true
}

// 处理删除配置
const handleDeleteConfig = () => {
	if (!selectedConfig.value) return
	showDeleteConfirm.value = true
}

// 确认删除
const confirmDelete = async () => {
	if (!selectedConfig.value) return

	try {
		await entityApis.configuration.delete(selectedConfig.value.id)
		toast({
			title: '成功',
			description: '配置已删除'
		})
		
		// 重新加载配置列表
		await loadConfigurations()
		showDeleteConfirm.value = false
	} catch (error) {
		console.error('删除配置失败:', error)
		toast({
			title: '错误',
			description: '删除配置失败',
			variant: 'destructive'
		})
	}
}

// 配置对话框提交处理
const onConfigSubmit = async (config: ZdConfiguration) => {
	try {
		if (editingConfig.value) {
			// 更新
			await entityApis.configuration.update(config)
			toast({
				title: '成功',
				description: '配置已更新'
			})
		} else {
			// 创建
			// 确保使用纯数字ID
			const projectNumericId = toApiId(project.value.id)
			if (projectNumericId === null) {
				throw new Error('无法将项目ID转换为有效的数字ID')
			}
			
			const newConfig = await entityApis.configuration.create({
				...config,
				projectId: projectNumericId,
				templateId: project.value.templateId
			})
			toast({
				title: '成功',
				description: '配置已创建'
			})
		}
		
		// 重新加载配置列表
		await loadConfigurations()
		showConfigDialog.value = false
	} catch (error) {
		console.error('保存配置失败:', error)
		toast({
			title: '错误',
			description: '保存配置失败',
			variant: 'destructive'
		})
	}
}

// 获取选中配置名称
const getSelectedConfigName = () => {
	if (!selectedConfig.value) return '请选择配置'
	return `配置 #${selectedConfig.value.id}`
}

// 格式化配置JSON
const formatConfig = (config: string) => {
	if (!config) return '{}' 
	try {
		return JSON.stringify(JSON.parse(config), null, 2)
	} catch (e) {
		return config
	}
}

// 监听项目变化，更新表单
watch(() => props.project, (newProject) => {
	if (newProject) {
		editForm.value = {
			id: newProject.id,
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
		// 加载配置列表
		loadConfigurations()
	}
}, { immediate: true })

// 处理表单提交
const handleSubmit = () => {
	// 创建更新数据对象，包含 id 但不包含 isDeleted
	const updatedData = {
		id: editForm.value.id,
		name: editForm.value.name,
		description: editForm.value.description,
		productTypeId: editForm.value.productTypeId,
		templateId: editForm.value.templateId,
		quantity: editForm.value.quantity,
		model: editForm.value.model,
		attention: editForm.value.attention,
		company: editForm.value.company,
		tel: editForm.value.tel,
		mob: editForm.value.mob,
		fax: editForm.value.fax,
		email: editForm.value.email,
		number: editForm.value.number,
		date: editForm.value.date,
		valid: editForm.value.valid,
		price: editForm.value.price
	}
	
	// 使用 JSON 序列化再解析创建普通对象深拷贝，移除 Proxy
	const plainData = JSON.parse(JSON.stringify(updatedData))
	
	// 触发保存事件
	emit('save', plainData)
}

// 组件挂载时加载数据
onMounted(() => {
	loadConfigurations()
	loadDropdownData()
})

// 报价相关状态
const isPriceDialogOpen = ref(false)
const priceConfigId = ref<number | null>(null)
const priceLoading = ref(false)
const priceData = ref<ZdPrice | null>(null)
const priceItems = ref<ZdPriceItem[]>([])

// 规格书生成相关状态
const specLoading = ref(false)

// 规格书生成处理函数
const generateSpecification = async () => {
	if (!project.value || !project.value.templateId) {
		toast({
			title: '错误',
			description: '项目信息不完整',
			variant: 'destructive'
		})
		return
	}

	try {
		specLoading.value = true

		// 1. 获取模板信息
		const template = templates.value.find(t => t.id === project.value.templateId)
		if (!template || !template.specId) {
			toast({
				title: '错误',
				description: '未找到模板规格书配置',
				variant: 'destructive'
			})
			return
		}

		// 2. 获取规格书配置
		console.log('template.specId:', template.specId)
		const specConfig = await entityApis.specification.getAll(template.specId)
		if (!specConfig) {
			toast({
				title: '错误',
				description: '未找到规格书配置',
				variant: 'destructive'
			})
			return
		}

		// 清理specConfig中的null值
		const cleanSpecConfig = (obj: any): any => {
			if (obj === null || obj === undefined) {
				return undefined
			}
			if (Array.isArray(obj)) {
				return obj.map(item => cleanSpecConfig(item)).filter(item => item !== undefined)
			}
			if (typeof obj === 'object') {
				const cleaned: any = {}
				for (const [key, value] of Object.entries(obj)) {
					// 对于texts、bools和imgs属性，保留对象但清理内部null值
					if (key === 'texts' || key === 'bools' || key === 'imgs') {
						if (value && typeof value === 'object') {
							const cleanedValue: any = {}
							for (const [k, v] of Object.entries(value)) {
								if (v !== null) {
									cleanedValue[k] = v
								}
							}
							cleaned[key] = cleanedValue
						} else {
							cleaned[key] = {}
						}
						continue
					}
					const cleanedValue = cleanSpecConfig(value)
					if (cleanedValue !== undefined) {
						cleaned[key] = cleanedValue
					}
				}
				return Object.keys(cleaned).length > 0 ? cleaned : undefined
			}
			return obj
		}

		const cleanedSpecConfig = cleanSpecConfig(specConfig)

		// 3. 创建规格书查询对象
		// const specQuery = {
		// 	projectId: project.value.id,
		// 	templateId: project.value.templateId,
		// 	specId: template.specId,
		// 	configId: selectedConfigId.value || undefined
		// }

		// 4. 渲染规格书
		console.log('selectedConfigId.value:', selectedConfigId.value, cleanedSpecConfig)
		const renderUrl = await entityApis.specification.render(selectedConfigId.value, cleanedSpecConfig)
		if (!renderUrl) {
			toast({
				title: '错误',
				description: '规格书渲染失败',
				variant: 'destructive'
			})
			return
		}

		// 5. 下载文件
		console.log('renderUrl:', renderUrl)
		const blob = await entityApis.system.download(renderUrl)
		console.log('blob:', blob)
		// 创建下载链接
		const url = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `规格书_${project.value.name}_${new Date().toISOString().split('T')[0]}.docx`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)

		toast({
			title: '成功',
			description: '规格书生成成功'
		})
	} catch (error) {
		console.error('生成规格书失败:', error)
		toast({
			title: '错误',
			description: '生成规格书失败',
			variant: 'destructive'
		})
	} finally {
		specLoading.value = false
	}
}

// 价格项表格列定义
const priceColumns = ref([
	{
		accessorKey: 'name',
		header: '名称',
	},
	{
		accessorKey: 'totalPrice',
		header: '价格',
		cell: ({ row }: { row: any }) => {
			return formatPrice(row.original.totalPrice)
		}
	},
	{
		accessorKey: 'remark',
		header: '备注',
		cell: ({ row }: { row: any }) => {
			return row.original.remark || '-'
		}
	}
])

// 加载价格数据
const loadPriceData = async () => {
	if (!priceConfigId.value) return

	try {
		priceLoading.value = true
		const response = await entityApis.price.get(priceConfigId.value)

		if (response) {
			priceData.value = response
			// 提取价格项数据
			if (response.priceItems && Array.isArray(response.priceItems)) {
				priceItems.value = flattenPriceItems(response.priceItems)
			} else {
				priceItems.value = []
			}
		} else {
			toast({
				title: '警告',
				description: '未找到价格数据'
			})
			priceData.value = null
			priceItems.value = []
		}
	} catch (error) {
		console.error('加载价格数据失败:', error)
		toast({
			title: '错误',
			description: '加载价格数据失败',
			variant: 'destructive'
		})
		priceData.value = null
		priceItems.value = []
	} finally {
		priceLoading.value = false
	}
}

// 将嵌套的价格项列表扁平化
const flattenPriceItems = (items: ZdPriceItem[], level = 0): ZdPriceItem[] => {
	let result: ZdPriceItem[] = []

	items.forEach(item => {
		// 添加当前项
		const flatItem = {
			...item,
			// 添加显示级别信息，用于前端缩进显示
			level,
			// 为每个项生成一个唯一ID，避免key重复
			_id: `price_${Math.random().toString(36).substring(2, 9)}`
		}

		result.push(flatItem)

		// 递归处理子项
		if (item.children && item.children.length > 0) {
			result = [...result, ...flattenPriceItems(item.children, level + 1)]
		}
	})

	return result
}

// 打开报价结果对话框
const openPriceDialog = () => {
	isPriceDialogOpen.value = true

	// 默认选择当前配置
	if (selectedConfig.value && !priceConfigId.value) {
		priceConfigId.value = selectedConfig.value.id
		loadPriceData()
	}
}

// 格式化价格
const formatPrice = (price: number) => {
	if (typeof price !== 'number') return '¥0.00'
	return `¥${price.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// 参数相关状态
const objectArgument = ref<ZdObjectArgument | null>(null)
const isEditingArgument = ref(false)
const editingArgument = ref<ZdParameterArgument>({
	id: 0,
	name: '',
	type: 'string',
	value: ''
})
const showDeleteArgConfirm = ref(false)
const argumentToDelete = ref<ZdParameterArgument | null>(null)

// 当前选中的节点
const currentNode = computed(() => props.data || null)

// 当前节点的名称
const currentNodeName = computed(() => {
	if (!currentNode.value) return '';
	return `${currentNode.value.type || '节点'}: ${currentNode.value.label || currentNode.value.id}`
})

// 当前节点的类型和ID
const currentNodeTypeAndId = computed(() => {
	if (!currentNode.value) return { objectType: '', objectId: '' };

	const nodeId = currentNode.value.id?.toString() || '';

	// 检查是否为复合ID
	if (nodeId.includes(':')) {
		const [type, ...rest] = nodeId.split(':');
		return {
			objectType: type,
			objectId: rest.join(':')
		};
	}

	// 如果不是复合ID，则使用节点的type属性和原始ID
	return {
		objectType: currentNode.value.type || 'PROJECT',
		objectId: nodeId
	};
})

// 加载节点参数
const loadNodeArguments = async () => {
	if (!selectedConfigId.value || !currentNodeTypeAndId.value.objectType || !currentNodeTypeAndId.value.objectId) {
		console.log('缺少加载参数必要信息:', {
			configId: selectedConfigId.value,
			objectType: currentNodeTypeAndId.value.objectType,
			objectId: currentNodeTypeAndId.value.objectId
		})
		objectArgument.value = null
		return
	}

	try {
		const { objectType, objectId } = currentNodeTypeAndId.value
		
		console.log('加载节点参数:', {
			configId: selectedConfigId.value,
			objectType,
			objectId
		})

		const response = await entityApis.argument.get(
			selectedConfigId.value,
			objectType,
			objectId
		)

		console.log('参数加载结果:', response)

		if (response) {
			objectArgument.value = response
		} else {
			console.log('未找到现有参数，创建空参数对象')
			// 如果没有现有参数，创建一个空的参数对象
			objectArgument.value = {
				objectType,
				objectId,
				arguments: [],
				children: []
			}
		}
	} catch (error) {
		console.error('加载节点参数失败:', error)
		toast({
			title: '警告',
			description: '加载节点参数失败',
			variant: 'default'
		})

		// 创建一个空的参数对象用于新增
		objectArgument.value = {
			objectType: currentNodeTypeAndId.value.objectType,
			objectId: currentNodeTypeAndId.value.objectId,
			arguments: [],
			children: []
		}
	}
}

// 处理新增参数
const handleAddArgument = () => {
	// 如果还没有初始化对象参数，先创建一个空的
	if (!objectArgument.value && currentNodeTypeAndId.value.objectType && currentNodeTypeAndId.value.objectId) {
		objectArgument.value = {
			objectType: currentNodeTypeAndId.value.objectType,
			objectId: currentNodeTypeAndId.value.objectId,
			arguments: [],
			children: []
		}
	}
	
	// 如果没有可用的对象参数，显示错误并返回
	if (!objectArgument.value) {
		toast({
			title: '错误',
			description: '请先选择一个节点',
			variant: 'destructive'
		})
		return
	}
	
	editingArgument.value = {
		id: 0, // 新参数的ID为0
		name: '',
		type: 'string',
		value: ''
	}
	isEditingArgument.value = true
}

// 处理编辑参数
const handleEditArgument = (arg: ZdParameterArgument) => {
	editingArgument.value = { ...arg }
	isEditingArgument.value = true
}

// 处理删除参数
const handleDeleteArgument = (arg: ZdParameterArgument) => {
	argumentToDelete.value = arg
	showDeleteArgConfirm.value = true
}

// 确认删除参数
const confirmDeleteArgument = async () => {
	if (!argumentToDelete.value || !objectArgument.value || !selectedConfigId.value) return

	try {
		// 从参数列表中移除要删除的参数
		const updatedArguments = objectArgument.value.arguments.filter(
			arg => arg.id !== argumentToDelete.value?.id
		)

		// 更新对象参数
		const updatedObjectArgument: ZdObjectArgument = {
			...objectArgument.value,
			arguments: updatedArguments
		}

		// 保存到服务器
		await entityApis.argument.update(selectedConfigId.value, updatedObjectArgument)

		// 更新本地状态
		objectArgument.value = updatedObjectArgument

		toast({
			title: '成功',
			description: '参数已删除'
		})

		// 关闭确认对话框
		showDeleteArgConfirm.value = false
		argumentToDelete.value = null
	} catch (error) {
		console.error('删除参数失败:', error)
		toast({
			title: '错误',
			description: '删除参数失败',
			variant: 'destructive'
		})
	}
}

// 取消编辑参数
const cancelEditArgument = () => {
	isEditingArgument.value = false
	editingArgument.value = {
		id: 0,
		name: '',
		type: 'string',
		value: ''
	}
}

// 保存参数
const saveArgument = async () => {
	if (!selectedConfigId.value || !objectArgument.value) return

	try {
		// 验证参数
		if (!editingArgument.value.name.trim()) {
			toast({
				title: '错误',
				description: '参数名称不能为空',
				variant: 'destructive'
			})
			return
		}

		let updatedArguments: ZdParameterArgument[] = []

		if (editingArgument.value.id === 0) {
			// 新增参数
			// 生成临时ID（前端生成，后端会替换）
			const tempId = Date.now()

			// 添加到参数列表
			updatedArguments = [
				...objectArgument.value.arguments,
				{
					...editingArgument.value,
					id: tempId
				}
			]
		} else {
			// 更新现有参数
			updatedArguments = objectArgument.value.arguments.map(arg =>
				arg.id === editingArgument.value.id ? editingArgument.value : arg
			)
		}

		// 更新对象参数
		const updatedObjectArgument: ZdObjectArgument = {
			...objectArgument.value,
			arguments: updatedArguments
		}

		console.log('保存参数:', selectedConfigId.value, updatedObjectArgument)

		// 保存到服务器
		if (objectArgument.value.arguments.length === 0 && editingArgument.value.id === 0) {
			// 如果是首次添加参数，使用create方法
			await entityApis.argument.create(selectedConfigId.value, updatedObjectArgument)
			toast({
				title: '成功',
				description: '参数已创建'
			})
		} else {
			// 否则使用update方法
			await entityApis.argument.update(selectedConfigId.value, updatedObjectArgument)
			toast({
				title: '成功',
				description: '参数已更新'
			})
		}

		// 更新本地状态
		objectArgument.value = updatedObjectArgument

		// 关闭编辑表单
		isEditingArgument.value = false
		editingArgument.value = {
			id: 0,
			name: '',
			type: 'string',
			value: ''
		}
	} catch (error) {
		console.error('保存参数失败:', error)
		toast({
			title: '错误',
			description: '保存参数失败',
			variant: 'destructive'
		})
	}
}

// 监听当前节点变化，重新加载参数
watch([currentNode, selectedConfigId], () => {
	if (currentNode.value && selectedConfigId.value) {
		loadNodeArguments()
	} else {
		objectArgument.value = null
	}
})
</script> 