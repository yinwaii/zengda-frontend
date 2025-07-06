# 前端文档
### 技术架构
- 高级框架：nuxt3 负责自动导入依赖配置、网页渲染加速
- 前端框架：vue3 负责页面交互、数据绑定
- 组件库（新）：elementplus 按钮、表单、表格等原型
- 组件库（旧）：shadcn/vue 按钮、表单、表格等原型
- 与后端通信：ofetch(nuxt自带的)
- 编程语言：typescript javascript升级版

### 项目结构
- 页面管理：pages/ 其中pages/design为老版页面 pages/new为新版页面
- 组件管理：components/ 其中components/design为老版组件 components/xxx.vue为新版组件
- API接口：composables/use-entity-apis.ts 负责与后端通信
- 数据类型：models/entity/* 负责定义数据类型
- 整体布局：layouts/
- 项目配置：nuxt.config.ts
- 依赖配置：package.json 管理外部库、运行脚本等

### 开发环境
- 安装node：https://www.runoob.com/nodejs/nodejs-install-setup.html
- 下载项目：git clone https://github.com/yinwaii/zengda-frontend.git
- 在vscode中打开文件夹
- 点击上方终端-新建终端
- 安装依赖的外部库：npm install
- 启动：npm run dev

### 部署环境
- 拷贝项目：scp -r zengda-frontend/ ubuntu@111.229.109.11:~
- 连接服务器：ssh ubuntu@111.229.109.11
- 在服务器上打开文件夹：cd ~/zengda-frontend/
- 安装依赖的外部库：npm install
- 编译代码&性能优化分析：npm run build
- 启动：npm run start &