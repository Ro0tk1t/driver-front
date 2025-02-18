# 网盘前端

### 使用 Vue 3 + Vite + element-plus 技术. 采用前后端分离架构

## 已实现功能：
1. 登录注册
2. 文件(批量)上传下载
3. 文件/目录(批量)管理
4. 文件分享 (可设置访问密码, 分享链接登录可见)
5. 文件详情展示
6. 分享转存

## 配置环境

1. 安装npm： `sudo apt install npm`

2. 安装pnpm： `curl -fsSL https://get.pnpm.io/install.sh | sh -` 或者 `npm install -g pnpm`

3. 配置npm淘宝源： `pnpm config set registry https://registry.npmmirror.com/`

4. 安装相关库： `pnpm install`

## 运行

在 `config.ts` 里配置后端地址

启动前端项目： `pnpm run dev`

启动后端项目： [https://github.com/Ro0tk1t/driver-back](https://github.com/Ro0tk1t/driver-back)