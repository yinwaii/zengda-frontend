#1. 使用node:18.19.0作为基础镜像版本（这里选自己使用的node版本就行，以免版本不兼容）。
FROM node:22.15.0
#2. 设置环境变量NODE_ENV为production，表示将使用生产环境配置）。
ENV NODE_ENV=production
#3. 设置环境变量HOST为0.0.0.0（这个host不是指你的云服务器ip，不需要更改）。
ENV PORT=3010
#4. 容器内创建目录/nuxt3
RUN mkdir -p /nuxt3
#5. 复制当前的内容到容器内容部目录/nuxt3
COPY ./.output/ /nuxt3
#6. 切换工作目录到/nuxt3
WORKDIR /nuxt3
#7. 暴露端口3010（这个端口指的是dorker容器内端口，可自行设置）
EXPOSE 3010
#8. 运行node命令，执行./server/index.mjs文件。
CMD ["node", "./server/index.mjs"]