# ConceptCards 專案 AI 開發指南 (Academic Edition)

## 專案目的
這是一個專屬的「學科卡關與知識點整理」知識庫。
目的在於將日常讀書、準備考試或寫作業時遇到的盲點、錯題與觀念釐清，透過 AI 系統化地萃取並分類，轉化為未來複習的高效筆記與互動式翻卡測驗。

## 檔案與目錄結構
專案採用「單一學科、單一資料夾」的扁平管理方式（避免多層子資料夾破壞相對路徑）。
所有首頁的單元摺疊分組、期中／期末篩選、即時搜尋與翻卡測驗，皆以 `flashcards-data.js` 為單一資料來源（Single Source of Truth）自動渲染。

```text
/ (根目錄)
├── AGENTS.md                   # AI 協作與擴充規範
├── index.html                  # 網站首頁（自動讀取 flashcards-data.js 渲染）
├── style.css                   # 全域深色主題樣式表
├── flashcards-data.js          # 全站筆記索引與翻卡測驗題庫（唯一需更新的索引檔）
├── app.js                      # 首頁單元分組、搜尋、期中期末篩選與翻卡測驗邏輯
├── Operations_Research/        # 作業研究
│   └── 20261116-shadow-price.html
├── Discrete_Mathematics/       # 離散數學
│   └── 20261116-generating-function.html
└── Operating_Systems/          # 作業系統
    └── 20261116-process-vs-thread.html
```

## AI 協作規則與新增內容流程 (Core Workflow)

當使用者輸入一段讀書卡關的敘述，或丟出一個作業遇到的問題時，AI 必須嚴格遵守以下步驟處理：

### 步驟一：資訊分析與歸納
從使用者的描述中，分析並歸納出以下核心欄位：
1. **科目 (Subject)**：判斷這屬於哪個學科（如：`Operations_Research`、`Discrete_Mathematics`、`Operating_Systems`、`Data_Structures`）。若無法判斷，需主動詢問使用者。
2. **考試範圍 (Exam Scope)**：判斷屬於 `midterm`（期中）或 `final`（期末）。若使用者未說明，預設為 `midterm` 或主動確認。
3. **單元 / 章節 (Unit)**：歸納這筆筆記所屬的單元名稱（例如：`線性規劃與敏感度分析`、`生成函數 (Generating Functions)`、`行程與執行緒 (Process & Thread)`），以便首頁與測驗自動依單元分組。若該科目已有相同單元名稱，請沿用完全一致的字串。
4. **核心概念 (Concept)**：用一句話總結這個問題的知識點。
5. **卡關盲點 (Hurdle)**：總結使用者原本「不懂的地方」、「作業卡住的點」或「常見迷思」（限制在 50 字內）。
6. **突破與解析 (Breakthrough)**：條列式整理正確的觀念、推導過程或解題關鍵（若有數學式，請使用 MathJax `$...$` 或 `$$...$$` 語法）。

### 步驟二：檔案命名與存放
確認科目後，AI 需在對應的科目資料夾下新建或修改 HTML 檔案（維持扁平結構，不要在科目資料夾下再建單元子資料夾）。
- **命名規則**：`YYYYMMDD-[核心概念英文小寫與連字號].html`
- **範例**：`Operating_Systems/20261116-process-vs-thread.html`

### 步驟三：套用固定版型 (Template)
請將歸納好的內容，套用以下 HTML 模板生成檔案。不得隨意更改 CSS class 名稱，以確保全站風格一致。

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>[核心概念] - [科目資料夾名稱]</title>
    <link rel="stylesheet" href="../style.css">
    <script>
        window.MathJax = {
            tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] }
        };
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</head>
<body>
    <div class="card-container">
        <div class="breadcrumb">
            <a href="../index.html">首頁</a> > <span>[科目資料夾名稱]</span>
        </div>
        
        <h1 class="concept-title">[核心概念]</h1>
        
        <div class="section hurdle-section">
            <h2>🤔 當時卡在哪裡？（盲點 / 作業問題）</h2>
            <p>[填入卡關盲點描述]</p>
        </div>

        <div class="section breakthrough-section">
            <h2>💡 觀念解析與突破點</h2>
            <ul>
                <li>[重點解析 1]</li>
                <li>[重點解析 2]</li>
            </ul>
        </div>
    </div>
</body>
</html>
```

### 步驟四：註冊卡片至 `flashcards-data.js`（不需手動修改 `index.html`）
每次新增完卡片 HTML 檔案後，**只需更新根目錄的 `flashcards-data.js`**，`index.html` 與翻卡測驗視窗會自動完成渲染與單元分組：

1. **新增筆記至既有科目**：在 `window.FLASHCARD_DATA[科目Key].cards` 陣列中新增一筆物件：
```javascript
{
    id: "or-duality-theorem",           // 全站唯一 ID（建議格式：科目縮寫-slug）
    exam: "final",                      // "midterm"（期中）或 "final"（期末）
    unit: "對偶理論 (Duality Theory)",   // 單元名稱（相同單元會自動摺疊成同一組）
    title: "對偶問題與強對偶定理",         // 顯示於首頁與翻卡正面的標題
    url: "Operations_Research/20261201-duality.html",
    hurdle: "限制在 50 字內的卡關盲點描述。",
    breakthrough: [
        "<strong>重點 1：</strong>支援 HTML 標籤與 MathJax 數學式（JS 字串內反斜線需雙寫，例如 \\\\frac{1}{1-x}）。",
        "<strong>重點 2：</strong>第二條突破點。"
    ]
}
```

2. **若要新增全新科目**：直接在 `window.FLASHCARD_DATA` 新增一個科目 Key 即可，首頁會自動生成新的科目卡片與專屬翻卡測驗按鈕：
```javascript
"Information_Security": {
    nameZh: "資訊安全",
    nameEn: "Information Security",
    tagClass: "tag-go",                 // 可選：tag-os (琥珀)、tag-data-structures (紫)、tag-go (藍)
    cards: [ /* 填入卡片物件 */ ]
}
```