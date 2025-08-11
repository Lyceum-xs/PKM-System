const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;

// 检查端口是否被占用
function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true); // 端口可用
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false); // 端口被占用
    });
  });
}

// 启动后端服务器
async function startServer() {
  const serverPath = path.join(__dirname, '../server/dist/index.js');
  const isPortAvailable = await checkPort(3001);
  
  if (!isPortAvailable) {
    console.log('端口 3001 已被占用，跳过启动服务器');
    return;
  }
  
  if (fs.existsSync(serverPath)) {
    console.log('启动后端服务器...');
    serverProcess = spawn('node', [serverPath], {
      cwd: path.join(__dirname, '../server'),
      stdio: 'pipe'
    });
    
    serverProcess.stdout.on('data', (data) => {
      console.log(`服务器: ${data}`);
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(`服务器错误: ${data}`);
    });
  }
}

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, 'assets/icon.png'), // 可选：应用图标
    titleBarStyle: 'default',
    show: false // 先隐藏，等加载完成再显示
  });

  // 加载前端应用
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // 开发环境：加载本地开发服务器
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境：加载打包后的静态文件
    const indexPath = path.join(__dirname, '../client/dist/index.html');
    mainWindow.loadFile(indexPath);
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // 检查服务器是否启动成功
    setTimeout(() => {
      fetch('http://localhost:3001/api/health')
        .then(() => console.log('服务器连接成功'))
        .catch(() => console.log('服务器连接失败，请检查'));
    }, 2000);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 创建菜单
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '查看',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'close', label: '关闭' }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: '关于' },
        { type: 'separator' },
        { role: 'services', label: '服务' },
        { type: 'separator' },
        { role: 'hide', label: '隐藏' },
        { role: 'hideothers', label: '隐藏其他' },
        { role: 'unhide', label: '显示全部' },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 应用程序事件
app.whenReady().then(async () => {
  await startServer();
  createWindow();
  createMenu();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // 关闭服务器进程
  if (serverProcess) {
    serverProcess.kill();
  }
});

// 处理应用程序协议 (可选，用于深度链接)
app.setAsDefaultProtocolClient('knowledge-base');
