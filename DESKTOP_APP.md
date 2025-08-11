# Electron 桌面应用使用指南

## 🎯 什么是桌面应用模式？

将你的双维度知识库打包成桌面应用，双击即可运行，无需手动启动服务器！

## 🚀 快速使用

### 1. 安装额外依赖
```bash
npm install electron electron-builder wait-on --save-dev
```

### 2. 一键构建桌面应用
```bash
./build-desktop.sh
```

或者手动执行：
```bash
npm run build
npm run dist
```

### 3. 找到安装包
构建完成后，在 `dist-electron/` 文件夹中找到对应你操作系统的安装包：

- **macOS**: `.dmg` 或 `.zip` 文件
- **Windows**: `.exe` 安装程序
- **Linux**: `.AppImage` 或 `.deb` 文件

### 4. 安装并运行
双击安装包，按提示安装后，双击应用图标即可使用！

## ✨ 桌面应用的优势

1. **一键启动**: 无需手动启动服务器，双击即用
2. **独立运行**: 不依赖浏览器，有独立的窗口和菜单
3. **系统集成**: 可以固定到任务栏/Dock，像原生应用一样使用
4. **离线工作**: 所有数据本地存储，无需网络连接
5. **跨平台**: 一套代码，支持 Windows、macOS、Linux

## 🛠️ 开发模式

如果你要开发或调试桌面应用：

```bash
# 启动开发模式
npm run electron:dev
```

这会同时启动后端服务器和 Electron 窗口，支持热重载。

## 📁 应用数据位置

桌面应用的数据文件位置：
- **macOS**: `~/Library/Application Support/双维度知识库/`
- **Windows**: `%APPDATA%/双维度知识库/`
- **Linux**: `~/.config/双维度知识库/`

## 🔧 自定义配置

你可以在 `package.json` 的 `build` 部分自定义：
- 应用图标
- 安装包名称
- 支持的操作系统
- 应用签名（发布时需要）

## 🐛 常见问题

**Q: 构建失败怎么办？**
A: 确保 Node.js 版本 >= 16，并且网络连接正常

**Q: 应用启动后显示错误？**
A: 检查 `server/dist/` 目录是否存在，确保先运行了 `npm run build`

**Q: 想修改应用图标？**
A: 将图标文件放在 `electron/assets/icon.png`，重新构建即可
