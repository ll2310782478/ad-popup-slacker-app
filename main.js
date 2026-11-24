const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');

// 全局老板键，可用环境变量改：BOSSKEY="Control+Shift+Z" npm start
const BOSSKEY = process.env.BOSSKEY || 'Alt+Q';
let win;

if (!app.requestSingleInstanceLock()) app.quit();

function toggle() {
  if (!win) return;
  if (win.isVisible()) win.hide();
  else { win.show(); win.setAlwaysOnTop(true, 'screen-saver'); win.focus(); }
}

function create() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const W = 420, H = 660;
  win = new BrowserWindow({
    width: W, height: H,
    x: 40 + Math.floor(Math.random() * Math.max(1, width - W - 80)),
    y: 20 + Math.floor(Math.random() * Math.max(1, height - H - 40)),
    frame: false,            // 无边框
    alwaysOnTop: true,       // 置顶
    skipTaskbar: true,       // 任务栏不显示
    resizable: true,
    title: '限时特惠',
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      contextIsolation: true,
    },
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  const startUrl = process.argv.find((a) => /^https?:\/\//.test(a)) || '';
  win.loadFile('index.html', { query: { url: startUrl } });

  // 注册全局老板键；被其他软件占用时自动尝试备用键，并在终端打印结果
  const keys = [BOSSKEY, 'Control+Alt+Q', 'Control+Shift+Z'];
  const ok = [];
  for (const k of [...new Set(keys)]) {
    try { if (globalShortcut.register(k, toggle)) ok.push(k); } catch (e) {}
  }
  console.log(ok.length ? '[老板键已注册] ' + ok.join('  /  ') : '[老板键注册失败] 都被占用了，请用 BOSSKEY 环境变量换一个');
  ipcMain.on('hide', () => win.hide());
}

// 网页里的 target=_blank 链接都在原窗口内打开
const WEB_OK = /^(https?|about|blob|data):/i;
app.on('web-contents-created', (_e, c) => {
  if (c.getType() === 'webview') {
    c.setWindowOpenHandler(({ url }) => {
      if (WEB_OK.test(url)) c.loadURL(url);
      return { action: 'deny' };
    });
    // 拦截网页尝试唤起本地 App 的自定义协议（bytedance://、snssdk:// 等），避免弹出系统对话框
    const block = (e, url) => {
      const u = typeof url === 'string' ? url : e.url;
      if (u && !WEB_OK.test(u)) e.preventDefault();
    };
    c.on('will-navigate', block);
    c.on('will-redirect', block);
    c.on('will-frame-navigate', block);
    // 网页获得焦点时，按键不会传到外层窗口，所以在这里拦截：Esc 隐藏窗口，Ctrl+U/L/+/-/0 转发给界面
    c.on('before-input-event', (e, input) => {
      if (input.type !== 'keyDown') return;
      if (input.key === 'Escape') { e.preventDefault(); if (win) win.hide(); return; }
      const k = (input.key || '').toLowerCase();
      if (input.control && ['u', 'l', '=', '+', '-', '0'].includes(k)) {
        e.preventDefault();
        if (win) win.webContents.send('hotkey', k);
      }
    });
  }
});

app.whenReady().then(create);
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => app.quit());
