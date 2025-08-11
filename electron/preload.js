const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取应用版本
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // 打开外部链接
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // 显示消息框
  showMessage: (message) => ipcRenderer.invoke('show-message', message)
});
