<script setup lang="ts">
  import { ref, reactive } from "vue";
  const api = useApi();
  const props = defineProps({
    queryMaterials: Function
  })
  const searchOptions = ref([
    {
      label: '关键字',
      prop: 'str',
      inputType: 'String',
      optionType: 'input',
      placeholder: '输入物料名称',
    },
  ]);

  let searchParams = reactive({});

  const searchData = (searchForm: Object) => {
    // params.page = 1;
    searchParams = JSON.parse(JSON.stringify(searchForm));  ///深拷贝
    console.log(searchParams);
    if (props.queryMaterials) {
      props.queryMaterials(searchParams);
    }
  }

</script>

<template>
  <abstract-search-options-box :search-options="searchOptions" @search="searchData" />
</template>

<style scoped lang="scss">

</style>
