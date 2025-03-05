
<script setup>
import { ref, reactive, watch, computed, onMounted, defineProps, defineEmits } from 'vue'
import { Search } from '@element-plus/icons-vue'
import SearchOptionItem from './searchOptionItem.vue'
import { getFormattedTime } from '@/utils/validate'

//changeRemoteParams  用于更新远程搜索的字段
const emit = defineEmits(['search', 'changeRemoteParams'])
const props = defineProps({
  searchOptions: {
    default: [
      {
        label: '搜索',
        prop: 'search',
        inputType: 'String',
        optionType: 'input',
        placeHolder: '请输入关键字'
      },
      // {
      //   label: '中心名称',
      //   prop: 'center_name',
      //   inputType: 'Array',//组件绑定值的类型
      //   optionType: 'select', //组件类型
      //   multiple: true, //是否多选
      //   span: 6, // 占据宽度
      //   isRemote: true,
      //   remoteSelectUrl: '', //远程搜索的接口
      //   remoteParams: {
      //     search: '',
      //     disease_id: ''  //接口传参
      //   },
      //   disabled: false,
      //   searchField: '', //搜索时传的字段名
      //   placeHolder: '请选择中心',
      //   selectLabel: 'center_name',  //option的Label
      //   selectValue: 'center_id',
      //   selectAll: false,  //是否能全选，自定义的功能
      //   selectOptions: [  //搜索选项
      //     { label: '筛选中', value: 1 },
      //     { label: '在组', value: 2 },
      //     { label: '已出组', value: 3 }
      //   ]
      // },
      // {
      //   label: '时间范围',
      //   prop: 'create_at',
      //   inputType: 'Array',
      //   optionType: 'datePicker',
      //   placeHolder: '',
      //   isDefaultTime: true, //显示默认时间,默认是最近7天
      //   timeRangeDays: 180, //时间选择范围，不能超过180天
      //   disabledTime: '2023-06-20' //在此日期之前的时间禁止选中
      // }
    ],
    type: Array
  },
  showButton: {
    default: false,
    type: Boolean
  },
  btnLoading: {
    default: true,
    type: Boolean
  },
  buttonName: { default: '导出', type: String },
  labelPosition: {
    default: 'right',
    type: String
  },
  //新参数
  nowRemoteParams: {  // 远程搜索的新参数，适配不同业务需要
    default: null,
    type: Object
  },
  //按钮组占据的宽度
  buttonsSpan: {
    default: 6,
    type: Number
  },
  // 用于初始化搜索框的值
  searchFormValue: {
    default: null,
    type: Object
  }
})

const isExpanded = ref(false)
//搜索选项form数据
const searchForm = ref({})
const firstFormOptions = ref([]) //第一行选项框
const secondFormOptions = ref([]) //折叠的选项框

onMounted(() => {
  //初始化搜索选项的值
  props.searchFormValue ? (searchForm.value = props.searchFormValue) : ''

  //根据数组的长度，判断显示的字段，前三个和后面折叠的多个
  const searchOptions = props.searchOptions || [];
  firstFormOptions.value = JSON.parse(JSON.stringify(props.searchOptions)).splice(0, 3) || props.searchOptions
  secondFormOptions.value = JSON.parse(JSON.stringify(props.searchOptions)).splice(3) || props.searchOptions
})

const searchFormRef = ref(null)
const timeRanges = ref([])

//处理数据
const getValue = (value, prop, optionType, ifParamsChange) => {
  //删除没有数据的选项字段
  if (optionType == 'datePickesr') {  //时间选择器，这里的数据处理是根据业务需求写的
    if (value === null) {
      deleteDate()
    } else {
      searchForm.value.start_time = getFormattedTime(value[0]) //格式化时间
      searchForm.value.end_time = getFormattedTime(value[1])
    }
  } else if (!value && value !== 0) {  //如果数据为空就删掉这个属性
    delete searchForm.value[prop]
  } else {
    searchForm.value[prop] = value
  }
  if (ifParamsChange) { //如果数据改变了，就更新一下index.vue里的值
    emit('changeRemoteParams', searchForm.value[prop])
  }
}

const search = (download) => {
  console.log(searchForm.value)
  emit('search', searchForm.value, 0)
}

const clickButton = () => {
  emit('search', searchForm.value, 1)
}

const resetForm = (formEl) => {
  searchForm.value = {}
  deleteDate()
}

const deleteDate = () => {
  delete searchForm.value.start_time
  delete searchForm.value.end_time
  //清空项目名称的值，找到为时间选择器的值，全部清空
  props.searchOptions.forEach((item) => {
    if (item.optionType == 'datePicker') {
      searchForm.value[item.prop] = []
    }
  })
}
const toggle = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="search-component">
    <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="demo-form-inline" label-position="left" @submit.prevent="search">
      <!-- 一行分为四部分，可以换行，控制折叠的选项 -->
      <el-row class="first-row">
        <el-col
            :span="option.span ? option.span : option.optionType === 'input' ? 6 : option.optionType === 'select' ? 5 : 7"
            v-for="(option, index) in firstFormOptions.splice(0, 3)"
            :key="index"
        >
          <el-form-item :label="option.label" :prop="option.prop" style="width: 100%; margin-right: 10px">
            <SearchOptionItem
                :placeHolder="option.placeHolder"
                :prop="option.prop"
                :inputType="option.inputType"
                :optionType="option.optionType"
                :isDefaultTime="option.isDefaultTime"
                :timeRangeDays="option.timeRangeDays"
                :disabledTime="option.disabledTime"
                :multiple="option.multiple"
                :disabled="option.disabled"
                :isRemote="option.isRemote"
                :remoteSelectUrl="option.remoteSelectUrl"
                :remoteParams="option.remoteParams"
                :searchField="option.searchField"
                :ifParamsChange="option.ifParamsChange"
                :nowRemoteParams="props.nowRemoteParams"
                :selectOptions="option.selectOptions"
                :selectAll="option.selectAll"
                :selectLabel="option.selectLabel"
                :selectValue="option.selectValue"
                :value="searchForm[option.prop]"
                @returnValue="getValue"
                style="margin-right: 10px"
            />
          </el-form-item>
        </el-col>

        <el-col :span="searchOptions.length === 2 ? 12 : props.buttonsSpan">
          <el-form-item style="width: 100%">
            <div class="button-container">
              <div>
                <el-button class="ml-1" type="primary" :icon="Search" @click="search">查询</el-button>
                <el-button @click="resetForm(searchFormRef)">重置</el-button>
                <el-button v-if="searchOptions.length > 3 && !isExpanded" link type="primary" @click="toggle">
                  展开&nbsp;
                  <el-icon><ArrowDown /></el-icon>
                </el-button>
                <el-button v-else-if="searchOptions.length > 3" link type="primary" @click="toggle">
                  收起&nbsp;
                  <el-icon><ArrowUp /></el-icon>
                </el-button>
              </div>

              <el-button v-if="showButton" :loading="btnLoading" @click="clickButton" type="primary">
                {{ buttonName }}
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isExpanded && searchOptions.length > 3" class="second-row">
        <el-col
            :span="option.span || option.optionType == 'input' ? 6 : option.optionType == 'select' ? 5 : 7"
            v-for="(option, index) in secondFormOptions"
            :key="index"
        >
          <el-form-item :label="option.label" :prop="option.prop" style="width: 100%">
            <SearchOptionItem
                :placeHolder="option.placeHolder"
                :prop="option.prop"
                :inputType="option.inputType"
                :optionType="option.optionType"
                :isDefaultTime="option.isDefaultTime"
                :timeRangeDays="option.timeRangeDays"
                :disabledTime="option.disabledTime"
                :multiple="option.multiple"
                :disabled="option.disabled"
                :isRemote="option.isRemote"
                :remoteSelectUrl="option.remoteSelectUrl"
                :remoteParams="option.remoteParams"
                :searchField="option.searchField"
                :ifParamsChange="option.ifParamsChange"
                :nowRemoteParams="props.nowRemoteParams"
                :selectOptions="option.selectOptions"
                :selectAll="option.selectAll"
                :selectLabel="option.selectLabel"
                :selectValue="option.selectValue"
                :value="searchForm[option.prop]"
                @returnValue="getValue"
                style="margin-right: 10px"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.search-component {
  width: 100%;
  .el-form--inline .el-form-item {
    margin-bottom: 10px;
  }
  :deep(.el-form-item__label) {
    font-weight: bold !important;
  }
  .first-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    .el-col {
      height: 32px !important;
    }
  }
  .second-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-top: 10px;
    .el-col {
      height: 32px !important;
    }
  }

  .option-container {
    width: 25%;
  }
  .button-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .el-button + .el-button {
    margin-left: 10px;
  }
}

.select-item {
  .el-select .el-select-tags-wrapper.has-prefix {
    display: flex;
    max-width: 70% !important;
    flex-wrap: nowrap;
  }
  .el-tag.is-closable {
    width: 45%;
    max-width: 70px;
  }
  .el-select__tags .el-tag:last-child {
    width: 45%;
    max-width: 70px;
  }
  .el-tag__content {
    width: 100%;
  }
  .el-select .el-select__tags-text {
    max-width: 45px !important;
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
    text-overflow: ellipsis;
  }
  .el-select__input {
    margin-left: 5px;
  }
}
</style>
