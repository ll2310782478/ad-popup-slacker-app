# 🎁 Ad Popup Slacker · 弹窗广告摸鱼神器

[English](README.md) | **简体中文** | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

> 把任意网页伪装成一个"弹窗广告"：无边框、永远置顶、满屏牛皮癣，真实网页悄悄藏在广告里。老板路过，一键隐藏。

基于 [Electron](https://www.electronjs.org/) 开发。网页被嵌在一个"广告视频区"里，周围是红包横幅、商品卡片、"立即领取"大按钮，上面再盖一层"广告 AD"水印和 HOT / 限时秒杀贴纸。远看就是一个流氓弹窗，没人会多看一眼。

<!-- 在这里放一张截图，例如：
![screenshot](docs/screenshot.png)
-->
![screenshot](docs/screenshot.png)
## ✨ 功能

- **伪装成广告**：红橙斜纹大标题、飘落红包、闪烁商品卡、抖动的"立即领取"按钮、假"关闭"倒计时，窗口标题为"限时特惠"。
- **无边框 + 置顶**：无系统标题栏和边框，使用最高置顶层级，不在任务栏显示，每次启动出现在屏幕随机位置，顶部灰条可拖动。
- **全局老板键**：任何软件里按 `Alt+Q` 立即隐藏 / 再按显示，另有两个备用键，防止被其他软件占用。
- **真实网页混在广告里**：网页嵌在伪装的"视频区"，上面盖有水印、贴纸和假播放条，但鼠标点击和滚动照常穿透到网页。
- **缩放自适应**：网页缩放比例随窗口宽度自动调整，拖大拖小窗口，排版始终像在一个桌面浏览器里。
- **假播放条是真遥控器**：▶ 暂停/播放，‹ 上一个，"跳过 ›"下一个视频，适合刷短视频。
- **自动播放**：已放开自动播放限制，切到下一个视频无需手动点击。
- **拦截唤起 App**：自动丢弃 `bytedance://` 等自定义协议跳转，不会弹出"获取打开此链接的应用"系统对话框。
- **桌面版 / 手机版 UA 一键切换**。

## 🚀 快速开始

### 方式一：下载安装包

到 [Releases](../../releases) 页面下载对应系统的安装包（Windows `.exe`、macOS `.dmg`、Linux `.AppImage`）。

> 安装包未做代码签名：Windows 可能出现 SmartScreen 提示，点"更多信息 → 仍要运行"；macOS 首次打开请右键 → 打开，或执行 `xattr -cr "/Applications/Ad Popup Slacker.app"`。

### 方式二：从源码运行

需要 [Node.js](https://nodejs.org/) 18 或更高版本。

```bash
git clone https://github.com/ll2310782478/ad-popup-slacker-app.git
cd ad-popup-slacker
npm install
npm start
```

也可以带上网址直接启动：

```bash
npm start -- https://www.douyin.com
```

窗口出现后，在底部伪装成"🎁 优惠码"的输入框里输入网址（或搜索词），回车加载。

### 自行打包

```bash
npm run dist     # 产物在 dist/ 目录
```

推送 `v*` 标签即可由 GitHub Actions 自动构建 Windows / macOS / Linux 三个平台并发布 Release：

```bash
git tag v1.0.0 && git push --tags
```

## ⌨️ 快捷键

| 快捷键 | 作用 | 范围 |
| --- | --- | --- |
| `Alt+Q` | 隐藏 / 显示窗口（老板键） | 全局 |
| `Ctrl+Alt+Q`、`Ctrl+Shift+Z` | 备用老板键 | 全局 |
| `Esc` | 隐藏窗口 | 窗口内 |
| 点击右上角"关闭 ✕" | 隐藏窗口（倒计时 5 秒后可点） | 窗口内 |
| `↑` / `↓` | 上一个 / 下一个视频 | 窗口内 |
| `Ctrl+L` | 聚焦网址输入框 | 窗口内 |
| `Ctrl+U` | 切换桌面版 / 手机版网页 | 窗口内 |
| `Ctrl+=` / `Ctrl+-` | 网页内容放大 / 缩小 | 窗口内 |
| `Ctrl+0` | 恢复默认缩放 | 窗口内 |

### 修改老板键

通过环境变量 `BOSSKEY` 指定主快捷键（格式见 [Electron Accelerator](https://www.electronjs.org/docs/latest/api/accelerator)）：

```bash
# macOS / Linux
BOSSKEY="Control+Shift+X" npm start

# Windows PowerShell
$env:BOSSKEY="Control+Shift+X"; npm start
```

启动后终端会打印实际注册成功的快捷键。如果显示"注册失败"，说明备用键也被占用了，请换一个组合。

## 🔧 工作原理

| 文件 | 说明 |
| --- | --- |
| `main.js` | 主进程：创建无边框置顶窗口、注册全局快捷键、拦截自定义协议跳转、转发网页内的按键 |
| `preload.js` | 通过 `contextBridge` 向界面暴露 `hide()` 和快捷键回调 |
| `index.html` | 广告界面与逻辑：伪装样式、`<webview>`、缩放自适应、假播放条 |
| `.github/workflows/` | `build.yml` 打标签自动打包发布，`ci.yml` 语法检查 |

**缩放自适应**：缩放比例 = 视频区宽度 ÷ 目标视口宽度（默认 700），限制在 0.25 到 2 之间，用 `ResizeObserver` 监听窗口变化实时重算。`Ctrl+=` / `Ctrl+-` 调整的是目标视口宽度。

## ⚠️ 已知限制

- 独占全屏的游戏无法被覆盖。
- 以管理员权限运行的程序在前台时，普通权限的本程序可能收不到全局快捷键，需要用管理员身份运行终端再 `npm start`。
- macOS 上 `Option+Q` 可能被系统占用，建议用 `BOSSKEY` 换成 `Control+Shift+Z` 之类的组合。
- 主要在 Windows 上开发和测试，macOS / Linux 未充分测试。
- 部分网站可能检测并限制内嵌浏览器，或需要登录后才能正常使用。

## 🗺️ 想法 / TODO

- [ ] 窗口右下角加一个伪装成广告角标的缩放手柄
- [ ] 定时自动下一个视频（可设间隔）
- [ ] 可自定义广告文案和主题（红包 / 游戏 / 电商）
- [ ] 定时弹出第二个假广告窗口

欢迎提 Issue 和 PR。

## 📜 免责声明

本项目仅用于技术学习和个人娱乐。请在遵守所在公司、学校的规章制度和相关法律法规的前提下使用，**不建议在需要专注的工作、课堂、考试等场景中使用**，因使用本工具产生的任何后果由使用者自行承担。

项目内通过 `<webview>` 加载的第三方网站（如抖音）其内容、商标及版权归各自所有者所有，本项目与这些网站及其运营方无任何关联。界面中的"红包""优惠码"等均为装饰性假内容，不具有任何实际功能。

## 📄 许可证

[MIT](./LICENSE)
