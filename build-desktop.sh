#!/bin/bash

echo "🚀 开始构建双维度知识库桌面应用..."

# 检查 Node.js 版本
node_version=$(node -v)
echo "当前 Node.js 版本: $node_version"

# 安装依赖
echo "📦 安装依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 构建前后端
echo "🔨 构建应用..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 构建 Electron 应用
echo "📱 打包桌面应用..."
npm run dist
if [ $? -ne 0 ]; then
    echo "❌ 打包失败"
    exit 1
fi

echo "✅ 构建完成！"
echo "📁 安装包位置: ./dist-electron/"
echo ""
echo "🎉 你可以在 dist-electron 文件夹中找到可安装的应用程序"

# 根据操作系统提示用户
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 macOS: 查找 .dmg 或 .zip 文件"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo "🪟 Windows: 查找 .exe 安装程序"
else
    echo "🐧 Linux: 查找 .AppImage 或 .deb 文件"
fi
