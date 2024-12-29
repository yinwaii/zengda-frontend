<template>

    <h1>基本信息</h1>
    <el-form>
        <el-form-item label="项目名称">
            <el-input v-model="projectName" />
        </el-form-item>
    </el-form>

    <el-divider />

    <h1>产品信息</h1>

    

</template>

<script lang="ts" setup name="Form">
const projectId = defineProps<{
    projectId: string
}>()

const projectName = ref('')
</script>

<style scoped></style>