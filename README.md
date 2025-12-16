# 商业POI地图（Leaflet + 多数据源）

一个零依赖静态页面，支持输入地点与半径圈选商业相关 POI。可切换数据源（OSM/高德/百度），支持两种图标模式与多种底图样式。

## 功能
 - 地点搜索与自动补全（随数据源切换）
 - 半径圈选并标注商业 POI（购物/餐饮/服务）
 - 图标按类型着色或统一颜色
 - 底图样式：OSM 标准 / Carto Light / Carto Dark
 - 可选后端代理隐藏密钥（Vercel 无服务器函数）

## 一键部署（Vercel）

1. 将本仓库导入到你自己的 GitHub（或直接使用你提供的 repo）。
2. 在 Vercel 新建项目，选择该仓库。
3. 在项目 Settings → Environment Variables 配置：
   - `AMAP_KEY` = 你的高德 key
   - `BAIDU_AK` = 你的百度 ak
4. 部署完成后得到域名，例如 `https://map-around.vercel.app`。

前端无需密钥，访问：

```
https://map-around.vercel.app/?backend=https://map-around.vercel.app
```

> 说明：`?backend=` 告诉前端走你自己的后端代理（同域），所有密钥由后端注入；也可不带该参数，代码会在非 localhost 环境自动使用同域 `/api`。

## 本地运行

```bash
python3 -m http.server 5173
# 打开 http://localhost:5173/
```

本地可直接使用 OSM（无需密钥）。若要使用高德/百度，可在 URL 注入临时密钥：

```
http://localhost:5173/?amap_key=你的key
http://localhost:5173/?baidu_ak=你的ak
```

## 目录结构

- `index.html`: 单页应用入口
- `api/`: Vercel 无服务器函数，转发高德/百度请求并注入服务端密钥
- `vercel.json`: Vercel 配置（静态 + Node 函数）

## 桌面应用（可选）

如需离线分发给无代码基础用户，可用 Tauri/Electron：

1. 用本项目 `index.html` 作为前端入口。
2. 首次运行弹窗让用户输入密钥，保存在系统安全存储（Keychain/Credential Manager）。
3. 所有第三方请求由桌面端主进程代理转发，不向页面暴露密钥。

> 安全性：桌面应用密钥在本机，理论可被提取；服务端代理（Vercel）更安全，推荐优先使用。

## 许可证

MIT

