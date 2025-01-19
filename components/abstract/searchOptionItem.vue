<template>
  <div class="item-container">
    <div v-if="optionType === 'input'" class="input-item">
      <el-input v-model="inputValue" :placeholder="placeHolder" clearable @change="returnValue" @clear="returnValue" />
    </div>
    <div v-if="optionType === 'datePicker'" class="date-picker-item">
      <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          :default-time="defaultTime"
          placeholder="请选择日期"
          format="YYYY-MM-DD HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="chooseData"
          @clear="chooseData"
          style="width: 100%"
      />
    </div>
    <div v-if="optionType === 'select'" class="select-item">
      <el-select
          v-model="inputValue"
          :placeholder="placeHolder"
          style="width: 100%"
          clearable
          :filterable="isRemote"
          :remote="isRemote"
          :remote-method="selectRemoteMethod"
          :loading="selectLoading"
          :multiple="multiple"
          :collapse-tags="multiple"
          :disabled="disabled"
          @clear="returnValue"
          @change="returnValue"
          @visible-change="openChange"
      >
        <el-option v-if="selectAll" key="all" label="全选" value="all" />
        <el-option
            v-for="item in newSelectOptions"
            :key="item[props.selectValue]"
            :label="item[props.selectLabel]"
            :value="item[props.selectValue]"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import {defineEmits, defineProps, onMounted, reactive, ref, watch} from 'vue'
import {ElMessage} from 'element-plus'
import axios from "axios"


const emit = defineEmits(['returnValue'])
const props = defineProps({
  prop: {
    default: '',
    type: String
  },
  placeHolder: {
    default: '',
    type: String
  },
  inputType: {
    // 字段类型，String，Array
    default: 'String',
    type: String
  },
  optionType: {
    //选择的类型：input，select，datePicker
    default: 'input',
    type: String
  },
  //多选框的选项
  selectOptions: {
    default: [{ label: '是', value: 1 }],
    type: Array
  },
  // 多选框是否多选
  multiple: {
    default: true,
    type: Boolean
  },
  disabled: { //是否禁用
    default: false,
    type: Boolean
  },
  //选择器是否远程搜索
  isRemote: {
    default: false,
    type: Boolean
  },
  //远程搜索的地址
  remoteSelectUrl: {
    default: '',
    type: String
  },
  //远程搜索需要的参数
  remoteParams: {
    default: { search: '', disease_id: '' },
    type: Object
  },
  //远程搜索需要的参数是否会发生改变，比如审核任务效率统计的页面里研究者中的项目id
  ifParamsChange: {
    default: false,
    type: Boolean
  },
  //新参数，需要替换
  nowRemoteParams: {
    default: { search: '', disease_id: [] },
    type: Object
  },
  //远程搜索时的字段，默认是search
  searchField: {
    default: 'search',
    type: String
  },
  //远程搜索获取的列表的label和value
  selectLabel: {
    default: 'label',
    type: String
  },
  selectValue: {
    default: 'value',
    type: String
  },
  //是否显示全选
  selectAll: {
    default: false,
    type: Boolean
  },
  //是否显示默认时间，默认是最近7天,进入页面时，请求时参数未传入，只是显示
  isDefaultTime: {
    default: false,
    type: Boolean
  },
  //时间选择范围，不能超过180天
  timeRangeDays: {
    default: null,
    type: Number
  },
  //在此日期之前的时间禁止选中
  disabledTime: {
    default: '',
    type: String
  },
  //绑定的值
  value: {}
})

watch(
    () => props.value,
    (newValue, oldValue) => {
      inputValue.value = props.value
      timeRange.value = props.value
    },
    () => props.selectOptions,
    (newValue, oldValue) => {
      newSelectOptions.value = props.selectOptions
    },
    () => props.nowRemoteParams, // 自定义的功能，可以不看
    (newValue, oldValue) => {
      if (props.prop === 'researcher') {
        params = { ...tempParams, ...props.nowRemoteParams }
      } else {
        params = { ...tempParams, ...props.remoteParams }
      }
    }
)

const inputValue = ref(null)
const timeRange = ref([])
const newSelectOptions = ref(null) //新的选项配置
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  },
  {
    text: '最近半年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
      return [start, end]
    }
  }
]

const defaultTime = reactive([new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)])

onMounted(() => {
  inputValue.value = props.value
  newSelectOptions.value = props.selectOptions
  if (props.isRemote) {
    getOptions('') //先默认获取选项列表
  }
  //设置默认时间为最近七天
  if (props.optionType === 'datePicker') {
    timeRange.value = props.isDefaultTime ? [getStartDate(), getEndDate()] : props.value
  }
})
const getStartDate = () => {
  const endDate = new Date() // 当前日期
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 6) // 最近七天的开始日期
  return startDate
}

const getEndDate = () => new Date();


const selectLoading = ref(false)
const selectRemoteMethod = (value) => {//远程搜
  getOptions(value)
}

//这是为了处理，多选远程搜索时，输入框聚焦就能显示选项
const openChange = (open, value) => {
  let valueLength = inputValue.value ? inputValue.value.length : 0
  if (open && valueLength === 0 && props.isRemote) {
    getOptions('')
  }
}
let params = reactive({})
const getOptions = async (value) => {
  // 搜索的字段，可更改，根据业务需求来的

  let tempParams = {}
  tempParams[props.searchField] = value

  if (props.prop === 'researcher') {
    params = { ...tempParams, ...props.nowRemoteParams }
  } else {
    params = { ...tempParams, ...props.remoteParams }
  }
  selectLoading.value = true
  newSelectOptions.value = []
  let res = (
      await axios.get(props.remoteSelectUrl, {
        params: params
      })
  ).data
  if (res.code === 200) {
    if (res.data.length > 0) {
      newSelectOptions.value = res.data
    }
    selectLoading.value = false
  } else {
    ElMessage.error(res.message || '搜索失败！')
  }
}

//往上个页面emit数据
const returnValue = (val) => {
  // 若全选
  if (props.selectAll && val.some((el) => el === 'all')) {
    inputValue.value = newSelectOptions.value.map((item) => item[props.selectValue])
  }
  emit('returnValue', inputValue.value, props.prop, props.optionType, props.ifParamsChange)
}

//emit 时间
const returnData = () => {
  emit('returnValue', timeRange.value, props.prop, props.optionType)
}

/*
 *@target: 设置禁止选中的时间
 *@description: time不能在设置的默认日期前，如2023-06-20，该功能有些占性能，缺点之一

 */
const disabledDate = (time) => {
  const selectedTime = time.getTime() // 选中时间
  // 限制日期范围在 disabledTime之前不能选
  if (props.disabledTime) {
    const minDate = new Date(props.disabledTime).getTime()
    return selectedTime < minDate
  } else {
    true
  }
}

/*
 *@target: 限制时间段范围
 *@description: time 不能与现在的时间间隔超过特定天数，如180天
 *
 */
// 进入页面的时候，时间显示但是搜索值里没有
const chooseData = () => {
  // 设置时间
  if (timeRange.value) {
    const startDate = timeRange.value[0] || ''
    const endDate = timeRange.value[1] || ''
    // 限制时间段在 180 天以内
    const intervalDays = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000))
    if (props.timeRangeDays && intervalDays > props.timeRangeDays) {
      // 超过特定天数，进行处理，重置日期范围并提示用户
      timeRange.value = null
      ElMessage.warning('时间范围不能超过180天，请重新选择')
    } else if (props.disabledTime && startDate < new Date(props.disabledTime)) {
      //在时间结构表里选择时间时，不能选择特定限制日期前的时间
      timeRange.value = null
      ElMessage.warning(`不支持选择${props.disabledTime}前的时间，请重新选择`)
    }
  }
  returnData()
}

</script>
