window.FLASHCARD_DATA = {
    "Operations_Research": {
        nameZh: "作業研究",
        nameEn: "Operations Research",
        tagClass: "tag-os",
        cards: [
            {
                id: "or-shadow-price",
                exam: "midterm",
                unit: "線性規劃與敏感度分析",
                title: "影子價格 (Shadow Price)",
                url: "Operations_Research/20261116-shadow-price.html",
                hurdle: "複習線性規劃敏感度分析時，不理解影子價格（Shadow Price）的實務意義與適用限制。",
                breakthrough: [
                    "<strong>核心定義：</strong>影子價格代表在線性規劃中，當某項資源限制式（RHS）<strong>增加 1 單位</strong>時，目標函數（如總利潤）所能增加的幅度。",
                    "<strong>有效區間限制：</strong>影子價格僅在<strong>允許增加／減少量（Allowable Increase / Decrease）</strong>的範圍內有效；一旦資源變動超出此區間，最佳基解結構會改變，影子價格也須重新計算。",
                    "<strong>非緊繃限制式（Slack &gt; 0）：</strong>若某項資源尚有剩餘未被用完，其影子價格必為 0，因為再增加該資源也無法進一步提高總利潤。"
                ]
            }
        ]
    },
    "Discrete_Mathematics": {
        nameZh: "離散數學",
        nameEn: "Discrete Mathematics",
        tagClass: "tag-data-structures",
        cards: [
            {
                id: "dm-generating-function",
                exam: "midterm",
                unit: "生成函數 (Generating Functions)",
                title: "生成函數求解帶限制的組合分配問題 (Generating Function)",
                url: "Discrete_Mathematics/20261116-generating-function.html",
                hurdle: "不了解如何將組合分配的數量限制轉化為生成函數因子並提取目標係數。",
                breakthrough: [
                    "<strong>核心概念：</strong>將離散的組合問題轉化為多項式（或冪級數）的乘法運算，透過尋找展開式中特定次方項 $x^n$ 的係數來求得方法數。",
                    "<strong>步驟 1 — 設定變數的指數上下限：</strong>根據每個變數 $x_i$ 的數量限制（例如「至少取 $a$ 個」、「至多取 $b$ 個」或「只能取偶數個」），寫出對應的生成函數因子，如 $(x^a + x^{a+1} + \\dots + x^b)$ 或 $(1 + x^2 + x^4 + \\dots)$。",
                    "<strong>步驟 2 — 將各因子相乘與化簡：</strong>把所有變數的多項式相乘，並利用等比級數公式（如 $\\frac{1}{1-x} = \\sum_{k=0}^{\\infty} x^k$）化簡為封閉形式（Closed Form）。",
                    "<strong>步驟 3 — 展開並提取係數：</strong>利用二項式定理 $\\binom{-n}{k} = (-1)^k \\binom{n+k-1}{k}$ 展開化簡後的式子，找出目標總數 $x^n$ 的係數即為答案。"
                ]
            },
            {
                id: "dm-inclusion-exclusion",
                exam: "midterm",
                unit: "排容原理 (Inclusion-Exclusion)",
                title: "排容原理與錯排問題 (Inclusion-Exclusion & Derangement)",
                url: "Discrete_Mathematics/20261116-inclusion-exclusion-derangement.html",
                hurdle: "不了解如何利用排容原理扣除違規排列，以及推導錯排數公式的邏輯。",
                breakthrough: [
                    "<strong>核心概念：</strong>當直接計算滿足所有條件的排列數較困難時，改以「全部可能的方法數」扣除「違反至少一個條件的方法數」，並透過交集加減修正重複扣除的部分。",
                    "<strong>排容原理公式：</strong>設全集為 $U$，集合 $A_i$ 代表違反第 $i$ 個限制條件（性質 $P_i$）的集合，則滿足所有限制條件的方法數為：$$|\\overline{A_1} \\cap \\overline{A_2} \\cap \\dots \\cap \\overline{A_n}| = |U| - \\sum |A_i| + \\sum |A_i \\cap A_j| - \\dots + (-1)^n |A_1 \\cap \\dots \\cap A_n|$$",
                    "<strong>經典特例（錯排問題 $D_n$）：</strong>要求 $n$ 個元素全部都不在原本的位置上，透過上述公式推導可得錯排數公式為 $D_n = n! \\sum_{k=0}^{n} \\frac{(-1)^k}{k!}$。"
                ]
            }
        ]
    },
    "Operating_Systems": {
        nameZh: "作業系統",
        nameEn: "Operating Systems",
        tagClass: "tag-go",
        cards: [
            {
                id: "os-process-vs-thread",
                exam: "midterm",
                unit: "行程與執行緒 (Process & Thread)",
                title: "Process 與 Thread 核心差異與資源共享機制",
                url: "Operating_Systems/20261116-process-vs-thread.html",
                hurdle: "不了解 Process 與 Thread 在資源分配、共享內容與切換成本上的核心差異。",
                breakthrough: [
                    "<strong>資源分配與獨立性：</strong>Process 是作業系統分配資源（如記憶體空間、檔案描述符）的基本單位，各行程擁有獨立的位址空間；Thread 則是 CPU 排程與執行的基本單位，隸屬於某個 Process 之下。",
                    "<strong>共享與獨立內容：</strong>同一個 Process 下的多個 Threads 會共享 Code section、Data section 以及作業系統資源（如開啟的檔案），但每個 Thread 各自擁有獨立的 Program Counter (PC)、Registers 與 Stack。",
                    "<strong>切換成本（Context Switch）：</strong>由於不需切換記憶體位址空間與頁表（Page Table），Thread 之間的 Context Switch 成本遠低於 Process。"
                ]
            },
            {
                id: "os-system-call-trap",
                exam: "midterm",
                unit: "作業系統架構與系統呼叫",
                title: "System Call 與中斷狀態切換機制 (Dual-Mode Operation)",
                url: "Operating_Systems/20261116-system-call-trap.html",
                hurdle: "不了解 System Call 如何透過 Trap 中斷機制完成 User Mode 與 Kernel Mode 切換。",
                breakthrough: [
                    "<strong>雙重模式保護（Dual-Mode Operation）：</strong>為了保護硬體與核心資料，CPU 分為 User Mode（使用者模式）與 Kernel Mode（核心模式）。當使用者程式需要存取硬體或執行特權指令（如 I/O 操作、建立行程）時，必須透過 System Call 請求作業系統協助。",
                    "<strong>步驟 1 — 呼叫介面與傳遞編號：</strong>應用程式呼叫系統呼叫介面（或透過 API 封裝），將對應的 System Call Number 存入暫存器。",
                    "<strong>步驟 2 — 觸發 Trap 與模式切換：</strong>觸發軟體中斷（Trap / Exception），硬體自動將 Mode Bit 從 1（User Mode）切換為 0（Kernel Mode），並保存當前執行狀態。",
                    "<strong>步驟 3 — 執行核心服務常式：</strong>CPU 依據中斷向量表（Interrupt Vector）跳轉至核心對應的 System Call Handler 執行服務常式。",
                    "<strong>步驟 4 — 恢復狀態並返回：</strong>執行完畢後，恢復原本的暫存器狀態並將 Mode Bit 切回 1，把控制權交還給使用者程式。"
                ]
            }
        ]
    }
};
