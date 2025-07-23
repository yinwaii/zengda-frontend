# 前端文档
### 技术架构
- 高级框架：nuxt3 负责自动导入依赖配置、网页渲染加速
- 前端框架：vue3 负责页面交互、数据绑定
- 组件库：elementplus 按钮、表单、表格等原型
- 与后端通信：ofetch(nuxt自带的)
- 编程语言：typescript javascript升级版

### 项目结构
- 页面管理：pages/
- 组件管理：components/
- API接口：composables/use-entity-apis.ts 负责与后端通信
- 数据类型：models/ 负责定义数据类型
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

### 打包流程
- 确保开发环境的每一步已执行没问题
- 编译：npm run build
- 打包：npm run package

### 部署环境
- 连接服务器：ssh ubuntu@111.229.109.11
- 在服务器上打开文件夹：cd ~/zengda-frontend/
- 停止之前的服务：docker compose down
- 更新前端镜像最新版本：docker compose pull
- 启动：docker compose up -d
