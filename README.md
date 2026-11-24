# 🎁 Ad Popup Slacker

**English** | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

> Disguise any web page as an annoying pop-up ad: frameless, always on top, covered in banner clutter, with the real page quietly hidden inside. When the boss walks by, hide it with one key.

Built with [Electron](https://www.electronjs.org/). The page is embedded in a fake "ad video area" surrounded by red-packet banners, product cards and a big "Claim now" button, overlaid with "AD" watermarks and HOT / Flash Sale stickers. From a distance it looks like obnoxious adware nobody wants to look at.

<!-- Add a screenshot here, e.g.:
![screenshot](docs/screenshot.png)
-->
![screenshot](docs/screenshot.png)
## ✨ Features

- **Looks like an ad**: striped banner, falling red packets, flashing product cards, a shaking "Claim now" button, a fake close countdown, window title "Limited-time offer".
- **Frameless + always on top**: no OS title bar or border, top-most window level, hidden from the taskbar, random position on every launch, draggable by the grey top strip.
- **Global boss key**: press `Alt+Q` in any app to hide / show instantly, with two backup keys in case another program has taken it.
- **Real page hidden in the ad**: the page sits inside the fake video area under watermarks, stickers and a fake player bar, while clicks and scrolling still pass through to the page.
- **Auto-fit zoom**: page zoom follows the window width, so resizing the window always keeps a desktop-like layout.
- **The fake player bar is a real remote**: ▶ play/pause, ‹ previous, "Skip ›" next video, handy for short-video sites.
- **Autoplay**: the autoplay restriction is lifted, so the next video starts without a click.
- **App-launch blocking**: custom-protocol jumps such as `bytedance://` are dropped, so no "Get an app to open this link" system dialog.
- **Desktop / mobile UA toggle** with one key.

## 🚀 Quick start

### Option 1: download an installer

Grab the installer for your OS from the [Releases](../../releases) page (Windows `.exe`, macOS `.dmg`, Linux `.AppImage`).

> Installers are not code-signed. On Windows, SmartScreen may warn you: click "More info → Run anyway". On macOS, right-click → Open the first time, or run `xattr -cr "/Applications/Ad Popup Slacker.app"`.

### Option 2: run from source

Requires [Node.js](https://nodejs.org/) 18 or later.

```bash
git clone https://github.com/ll2310782478/ad-popup-slacker-app.git
cd ad-popup-slacker
npm install
npm start
```

Or launch with a URL:

```bash
npm start -- https://www.douyin.com
```

Once the window appears, type a URL (or a search term) into the input box at the bottom, disguised as a "🎁 Coupon code" field, and press Enter.

### Build it yourself

```bash
npm run dist     # output goes to dist/
```

Push a `v*` tag and GitHub Actions builds Windows / macOS / Linux packages and publishes a Release:

```bash
git tag v1.0.0 && git push --tags
```

## ⌨️ Shortcuts

| Shortcut | Action | Scope |
| --- | --- | --- |
| `Alt+Q` | Hide / show the window (boss key) | Global |
| `Ctrl+Alt+Q`, `Ctrl+Shift+Z` | Backup boss keys | Global |
| `Esc` | Hide the window | In window |
| Click "Close ✕" (after the 5 s countdown) | Hide the window | In window |
| `↑` / `↓` | Previous / next video | In window |
| `Ctrl+L` | Focus the URL box | In window |
| `Ctrl+U` | Toggle desktop / mobile page | In window |
| `Ctrl+=` / `Ctrl+-` | Zoom page content in / out | In window |
| `Ctrl+0` | Reset zoom | In window |

### Change the boss key

Set the primary shortcut with the `BOSSKEY` environment variable (see [Electron Accelerator](https://www.electronjs.org/docs/latest/api/accelerator) for the format):

```bash
# macOS / Linux
BOSSKEY="Control+Shift+X" npm start

# Windows PowerShell
$env:BOSSKEY="Control+Shift+X"; npm start
```

The terminal prints which shortcuts were actually registered. If it reports a failure, all candidates are taken by other programs: pick a different combination.

## 🔧 How it works

| File | Description |
| --- | --- |
| `main.js` | Main process: frameless always-on-top window, global shortcuts, custom-protocol blocking, key forwarding from the page |
| `preload.js` | Exposes `hide()` and a hotkey callback to the UI via `contextBridge` |
| `index.html` | Ad UI and logic: disguise styling, `<webview>`, auto-fit zoom, fake player bar |
| `.github/workflows/` | `build.yml` packages and releases on tags, `ci.yml` syntax check |

**Auto-fit zoom**: zoom = video-area width ÷ target viewport width (default 700), clamped to 0.25–2 and recomputed on every resize with a `ResizeObserver`. `Ctrl+=` / `Ctrl+-` change the target viewport width.

## ⚠️ Known limitations

- Exclusive-fullscreen games cannot be covered.
- When a program running as administrator is in the foreground, this app (running unelevated) may not receive global shortcuts. Run your terminal as administrator before `npm start`.
- On macOS, `Option+Q` may be taken by the system. Use `BOSSKEY` to switch to something like `Control+Shift+Z`.
- Developed and tested mainly on Windows; macOS / Linux are not thoroughly tested.
- Some sites may detect or restrict embedded browsers, or require login.

## 🗺️ Ideas / TODO

- [ ] A resize handle disguised as an ad corner badge
- [ ] Timed auto-advance to the next video (configurable interval)
- [ ] Customizable ad copy and themes (red packet / game / e-commerce)
- [ ] Periodically spawn a second fake ad window

Issues and PRs are welcome.

## 📜 Disclaimer

This project is for learning and personal entertainment only. Use it in accordance with the rules of your company or school and applicable laws. **It is not recommended for situations that need your attention, such as work, class or exams.** You are solely responsible for any consequences of using this tool.

Third-party sites loaded through `<webview>` (such as Douyin) and their content, trademarks and copyrights belong to their respective owners. This project is not affiliated with those sites or their operators. The "red packets" and "coupon codes" in the UI are decorative fakes with no real function.

## 📄 License

[MIT](./LICENSE)
