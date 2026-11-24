# 🎁 Ad Popup Slacker · 彈窗廣告摸魚神器

[English](README.en.md) | [简体中文](README.md) | **繁體中文** | [日本語](README.ja.md) | [한국어](README.ko.md)

> 把任意網頁偽裝成一個「彈窗廣告」：無邊框、永遠置頂、滿屏牛皮癬，真實網頁悄悄藏在廣告裡。老闆路過，一鍵隱藏。

基於 [Electron](https://www.electronjs.org/) 開發。網頁被嵌在一個「廣告影片區」裡，周圍是紅包橫幅、商品卡片、「立即領取」大按鈕，上面再蓋一層「廣告 AD」浮水印和 HOT／限時秒殺貼紙。遠看就是一個流氓彈窗，沒人會多看一眼。

<p align="center"><img src="docs/screenshot.png" width="320" alt="screenshot"></p>

## ✨ 功能

- **偽裝成廣告**：紅橙斜紋大標題、飄落紅包、閃爍商品卡、抖動的「立即領取」按鈕、假「關閉」倒數，視窗標題為「限時特惠」。
- **無邊框＋置頂**：無系統標題列和邊框，使用最高置頂層級，不在工作列顯示，每次啟動出現在螢幕隨機位置，頂部灰條可拖曳。
- **全域老闆鍵**：任何軟體裡按 `Alt+Q` 立即隱藏／再按顯示，另有兩個備用鍵，防止被其他軟體佔用。
- **真實網頁混在廣告裡**：網頁嵌在偽裝的「影片區」，上面蓋有浮水印、貼紙和假播放列，但滑鼠點擊和捲動照常穿透到網頁。
- **縮放自適應**：網頁縮放比例隨視窗寬度自動調整，拖大拖小視窗，排版始終像在一個桌面瀏覽器裡。
- **假播放列是真遙控器**：▶ 暫停／播放，‹ 上一個，「跳過 ›」下一個影片，適合刷短影片。
- **自動播放**：已放開自動播放限制，切到下一個影片無需手動點擊。
- **攔截喚起 App**：自動丟棄 `bytedance://` 等自訂協定跳轉，不會彈出「取得開啟此連結的應用程式」系統對話框。
- **桌面版／手機版 UA 一鍵切換**。

## 🚀 快速開始

### 方式一：下載安裝包

到 [Releases](https://github.com/ll2310782478/ad-popup-slacker-app/releases) 頁面下載對應系統的安裝包（Windows `.exe`、macOS `.dmg`、Linux `.AppImage`）。

> 安裝包未做程式碼簽署：Windows 可能出現 SmartScreen 提示，點「更多資訊 → 仍要執行」；macOS 首次開啟請右鍵 → 開啟，或執行 `xattr -cr "/Applications/Ad Popup Slacker.app"`。

### 方式二：從原始碼執行

需要 [Node.js](https://nodejs.org/) 18 或更高版本。

```bash
git clone https://github.com/ll2310782478/ad-popup-slacker-app.git
cd ad-popup-slacker-app
npm install
npm start
```

也可以帶上網址直接啟動：

```bash
npm start -- https://www.douyin.com
```

視窗出現後，在底部偽裝成「🎁 優惠碼」的輸入框裡輸入網址（或搜尋詞），按 Enter 載入。

### 自行打包

```bash
npm run dist     # 產物在 dist/ 目錄
```

推送 `v*` 標籤即可由 GitHub Actions 自動建置 Windows / macOS / Linux 三個平台並發布 Release：

```bash
git tag v1.0.0 && git push --tags
```

## ⌨️ 快捷鍵

| 快捷鍵 | 作用 | 範圍 |
| --- | --- | --- |
| `Alt+Q` | 隱藏／顯示視窗（老闆鍵） | 全域 |
| `Ctrl+Alt+Q`、`Ctrl+Shift+Z` | 備用老闆鍵 | 全域 |
| `Esc` | 隱藏視窗 | 視窗內 |
| 點擊右上角「關閉 ✕」（倒數 5 秒後可點） | 隱藏視窗 | 視窗內 |
| `↑` / `↓` | 上一個／下一個影片 | 視窗內 |
| `Ctrl+L` | 聚焦網址輸入框 | 視窗內 |
| `Ctrl+U` | 切換桌面版／手機版網頁 | 視窗內 |
| `Ctrl+=` / `Ctrl+-` | 網頁內容放大／縮小 | 視窗內 |
| `Ctrl+0` | 恢復預設縮放 | 視窗內 |

### 修改老闆鍵

透過環境變數 `BOSSKEY` 指定主快捷鍵（格式見 [Electron Accelerator](https://www.electronjs.org/docs/latest/api/accelerator)）：

```bash
# macOS / Linux
BOSSKEY="Control+Shift+X" npm start

# Windows PowerShell
$env:BOSSKEY="Control+Shift+X"; npm start
```

啟動後終端機會印出實際註冊成功的快捷鍵。如果顯示「註冊失敗」，說明備用鍵也被佔用了，請換一個組合。

## 🔧 運作原理

| 檔案 | 說明 |
| --- | --- |
| `main.js` | 主程序：建立無邊框置頂視窗、註冊全域快捷鍵、攔截自訂協定跳轉、轉發網頁內的按鍵 |
| `preload.js` | 透過 `contextBridge` 向介面暴露 `hide()` 和快捷鍵回呼 |
| `index.html` | 廣告介面與邏輯：偽裝樣式、`<webview>`、縮放自適應、假播放列 |
| `.github/workflows/` | `build.yml` 打標籤自動打包發布，`ci.yml` 語法檢查 |

**縮放自適應**：縮放比例 = 影片區寬度 ÷ 目標視口寬度（預設 700），限制在 0.25 到 2 之間，用 `ResizeObserver` 監聽視窗變化即時重算。`Ctrl+=` / `Ctrl+-` 調整的是目標視口寬度。

## ⚠️ 已知限制

- 獨佔全螢幕的遊戲無法被覆蓋。
- 以系統管理員權限執行的程式在前景時，一般權限的本程式可能收不到全域快捷鍵，需要用系統管理員身分執行終端機再 `npm start`。
- macOS 上 `Option+Q` 可能被系統佔用，建議用 `BOSSKEY` 換成 `Control+Shift+Z` 之類的組合。
- 主要在 Windows 上開發和測試，macOS / Linux 未充分測試。
- 部分網站可能偵測並限制內嵌瀏覽器，或需要登入後才能正常使用。

## 🗺️ 想法 / TODO

- [ ] 視窗右下角加一個偽裝成廣告角標的縮放控點
- [ ] 定時自動下一個影片（可設間隔）
- [ ] 可自訂廣告文案和主題（紅包 / 遊戲 / 電商）
- [ ] 定時彈出第二個假廣告視窗

歡迎提 Issue 和 PR。

## 📜 免責聲明

本專案僅用於技術學習和個人娛樂。請在遵守所在公司、學校的規章制度和相關法律法規的前提下使用，**不建議在需要專注的工作、課堂、考試等場景中使用**，因使用本工具產生的任何後果由使用者自行承擔。

專案內透過 `<webview>` 載入的第三方網站（如抖音）其內容、商標及著作權歸各自所有者所有，本專案與這些網站及其營運方無任何關聯。介面中的「紅包」「優惠碼」等均為裝飾性假內容，不具有任何實際功能。

## 📄 授權條款

[MIT](./LICENSE)
