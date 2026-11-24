const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('ad', { hide: () => ipcRenderer.send('hide'), onHotkey: (cb) => ipcRenderer.on('hotkey', (_e, k) => cb(k)) });
