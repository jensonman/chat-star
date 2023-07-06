# 使用Node.js作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到容器
COPY package*.json ./

# 安装应用程序的依赖项
RUN npm install

# 复制应用程序代码到容器
COPY . .

# 暴露应用程序监听的端口（如果需要）
EXPOSE 3000

# 运行应用程序
CMD [ "npm", "run", "start:dev" ]
