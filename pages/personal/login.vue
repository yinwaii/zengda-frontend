<template>
	<el-container class="login-container">
      <el-col class="welcome-section"   :xs="0" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="system-name">
          <img src="@/assets/imgs/logo.png" alt="Logo" style="align-self: center; width: 3rem; height: 100%;" />
          <el-text size="large">产品设计系统</el-text>
        </div>
        <img src="@/assets/imgs/login.svg" alt="Welcome" style="width: 50%;" />
        <h1>欢迎来到产品设计系统</h1>
        <p>请登录以继续使用</p>
      </el-col>
      <el-col class="login-section" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <Transition appear mode="out-in">
          <login />
        </Transition>
      </el-col>
  </el-container>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'personal' });
</script>

<style scoped>


.el-container{
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
}

.login-container {
  margin: 0;
  padding: 0;
}

.welcome-section {
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.system-name {
  display: flex;
  position: absolute;
  align-items: center;
  top: 0px;
  left: 0px;
  margin-top: 10px;
  margin-left: 10px;

}

.login-section {
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
