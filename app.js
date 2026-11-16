(() => {
    const data = window.FLASHCARD_DATA || {};
    const subjectsGrid = document.getElementById("subjects-grid");
    const searchInput = document.getElementById("search-input");
    const indexFilterBtns = document.querySelectorAll(".index-scope-btn");
    const toggleAllBtn = document.getElementById("toggle-all-units");

    const modal = document.getElementById("quiz-modal");
    const modalSubject = document.getElementById("quiz-subject-title");
    const scopeButtons = document.querySelectorAll(".scope-btn");
    const unitSelect = document.getElementById("quiz-unit-select");
    const cardInner = document.getElementById("flashcard-inner");
    const flashcardEl = document.getElementById("flashcard");
    const emptyStateEl = document.getElementById("quiz-empty");
    const frontExamBadge = document.getElementById("card-exam-badge");
    const frontUnitBadge = document.getElementById("card-unit-badge");
    const frontTitle = document.getElementById("card-front-title");
    const frontHurdle = document.getElementById("card-front-hurdle");
    const backList = document.getElementById("card-back-list");
    const backLink = document.getElementById("card-detail-link");
    const progressText = document.getElementById("quiz-progress-text");
    const progressFill = document.getElementById("quiz-progress-fill");
    const prevBtn = document.getElementById("quiz-prev");
    const flipBtn = document.getElementById("quiz-flip");
    const nextBtn = document.getElementById("quiz-next");
    const shuffleBtn = document.getElementById("quiz-shuffle");
    const closeBtn = document.getElementById("quiz-close");

    let indexScope = "all";
    let searchQuery = "";
    let unitsExpanded = true;

    let currentSubjectKey = null;
    let currentQuizScope = "midterm";
    let currentQuizUnit = "all";
    let activeCards = [];
    let currentIndex = 0;
    let isFlipped = false;

    const examLabels = {
        midterm: "期中",
        final: "期末"
    };

    const quizExamLabels = {
        midterm: "期中範圍",
        final: "期末範圍"
    };

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function renderSubjectsGrid() {
        const query = searchQuery.trim().toLowerCase();
        subjectsGrid.innerHTML = "";

        Object.entries(data).forEach(([subjectKey, subject]) => {
            const filteredCards = (subject.cards || []).filter((card) => {
                const scopeMatch = indexScope === "all" || card.exam === indexScope;
                if (!scopeMatch) return false;
                if (!query) return true;
                const haystack = `${card.title} ${card.unit || ""} ${card.hurdle || ""}`.toLowerCase();
                return haystack.includes(query);
            });

            if (query && filteredCards.length === 0) {
                return;
            }

            const groupedByUnit = new Map();
            filteredCards.forEach((card) => {
                const unitName = card.unit || "未分類單元";
                if (!groupedByUnit.has(unitName)) groupedByUnit.set(unitName, []);
                groupedByUnit.get(unitName).push(card);
            });

            const article = document.createElement("article");
            article.className = "knowledge-card";

            let bodyHtml = "";
            if (groupedByUnit.size === 0) {
                bodyHtml = `<p class="unit-empty">此範圍目前尚無筆記卡片</p>`;
            } else {
                const openAttr = unitsExpanded || query ? "open" : "";
                groupedByUnit.forEach((cards, unitName) => {
                    const itemsHtml = cards
                        .map(
                            (card) => `
                        <li class="note-item" data-exam="${escapeHtml(card.exam)}">
                            <a href="${escapeHtml(card.url)}">
                                <span class="note-title">${escapeHtml(card.title)}</span>
                                <span class="exam-badge exam-${escapeHtml(card.exam)}">${examLabels[card.exam] || escapeHtml(card.exam)}</span>
                            </a>
                        </li>`
                        )
                        .join("");

                    bodyHtml += `
                    <details class="unit-group" ${openAttr}>
                        <summary class="unit-summary">
                            <span class="unit-name">${escapeHtml(unitName)}</span>
                            <span class="unit-count">${cards.length} 題</span>
                        </summary>
                        <ul class="unit-list">${itemsHtml}</ul>
                    </details>`;
                });
            }

            article.innerHTML = `
                <div class="card-header">
                    <div class="card-header-top">
                        <span class="tag ${escapeHtml(subject.tagClass || "tag-go")}">${escapeHtml(subject.nameZh)}</span>
                        <button class="quiz-launch-btn" type="button" data-subject="${escapeHtml(subjectKey)}">⚡ 翻卡測驗</button>
                    </div>
                    <h3 class="card-title">${escapeHtml(subject.nameEn)}</h3>
                </div>
                <div class="card-body">${bodyHtml}</div>
            `;

            subjectsGrid.appendChild(article);
        });

        if (subjectsGrid.children.length === 0) {
            subjectsGrid.innerHTML = `<div class="grid-empty">找不到符合「${escapeHtml(searchQuery)}」的筆記卡片。</div>`;
        }

        document.querySelectorAll(".quiz-launch-btn").forEach((btn) => {
            btn.addEventListener("click", () => openQuiz(btn.dataset.subject));
        });
    }

    indexFilterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            indexFilterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            indexScope = btn.dataset.scope;
            renderSubjectsGrid();
        });
    });

    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderSubjectsGrid();
    });

    toggleAllBtn.addEventListener("click", () => {
        unitsExpanded = !unitsExpanded;
        toggleAllBtn.textContent = unitsExpanded ? "收合全部單元" : "展開全部單元";
        document.querySelectorAll(".unit-group").forEach((details) => {
            details.open = unitsExpanded;
        });
    });

    function openQuiz(subjectKey) {
        const subject = data[subjectKey];
        if (!subject) return;
        currentSubjectKey = subjectKey;
        currentQuizScope = "midterm";
        currentQuizUnit = "all";
        modalSubject.textContent = `${subject.nameZh} · ${subject.nameEn}`;
        updateScopeButtons();
        populateUnitSelect();
        loadCards();
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeQuiz() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function updateScopeButtons() {
        scopeButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.scope === currentQuizScope);
        });
    }

    function populateUnitSelect() {
        const subject = data[currentSubjectKey];
        const scopedCards = (subject.cards || []).filter(
            (c) => currentQuizScope === "all" || c.exam === currentQuizScope
        );
        const units = [...new Set(scopedCards.map((c) => c.unit || "未分類單元"))];

        unitSelect.innerHTML = `<option value="all">全部單元 (${scopedCards.length})</option>`;
        units.forEach((unit) => {
            const count = scopedCards.filter((c) => (c.unit || "未分類單元") === unit).length;
            const opt = document.createElement("option");
            opt.value = unit;
            opt.textContent = `${unit} (${count})`;
            unitSelect.appendChild(opt);
        });

        if (!units.includes(currentQuizUnit)) {
            currentQuizUnit = "all";
        }
        unitSelect.value = currentQuizUnit;
    }

    function loadCards() {
        const subject = data[currentSubjectKey];
        activeCards = (subject.cards || []).filter((c) => {
            const scopeMatch = currentQuizScope === "all" || c.exam === currentQuizScope;
            const unitMatch = currentQuizUnit === "all" || (c.unit || "未分類單元") === currentQuizUnit;
            return scopeMatch && unitMatch;
        });
        currentIndex = 0;
        isFlipped = false;
        renderCard();
    }

    function renderCard() {
        cardInner.classList.remove("flipped");
        isFlipped = false;

        if (activeCards.length === 0) {
            flashcardEl.style.display = "none";
            emptyStateEl.style.display = "block";
            progressText.textContent = "0 / 0";
            progressFill.style.width = "0%";
            prevBtn.disabled = true;
            flipBtn.disabled = true;
            nextBtn.disabled = true;
            shuffleBtn.disabled = true;
            return;
        }

        flashcardEl.style.display = "block";
        emptyStateEl.style.display = "none";
        prevBtn.disabled = false;
        flipBtn.disabled = false;
        nextBtn.disabled = false;
        shuffleBtn.disabled = activeCards.length < 2;

        const card = activeCards[currentIndex];
        frontExamBadge.textContent = quizExamLabels[card.exam] || card.exam;
        frontExamBadge.className = `exam-badge exam-${card.exam}`;
        frontUnitBadge.textContent = card.unit || "未分類單元";
        frontTitle.textContent = card.title;
        frontHurdle.textContent = card.hurdle;
        backList.innerHTML = card.breakthrough.map((item) => `<li>${item}</li>`).join("");
        backLink.href = card.url;

        const total = activeCards.length;
        progressText.textContent = `第 ${currentIndex + 1} / ${total} 題`;
        progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;

        if (window.MathJax?.typesetPromise) {
            window.MathJax.typesetPromise([modal]).catch(() => {});
        }
    }

    function toggleFlip() {
        if (activeCards.length === 0) return;
        isFlipped = !isFlipped;
        cardInner.classList.toggle("flipped", isFlipped);
    }

    function nextCard() {
        if (activeCards.length === 0) return;
        currentIndex = (currentIndex + 1) % activeCards.length;
        renderCard();
    }

    function prevCard() {
        if (activeCards.length === 0) return;
        currentIndex = (currentIndex - 1 + activeCards.length) % activeCards.length;
        renderCard();
    }

    function shuffleCards() {
        if (activeCards.length < 2) return;
        for (let i = activeCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [activeCards[i], activeCards[j]] = [activeCards[j], activeCards[i]];
        }
        currentIndex = 0;
        renderCard();
    }

    scopeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            currentQuizScope = btn.dataset.scope;
            updateScopeButtons();
            populateUnitSelect();
            loadCards();
        });
    });

    unitSelect.addEventListener("change", (e) => {
        currentQuizUnit = e.target.value;
        loadCards();
    });

    flashcardEl.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        toggleFlip();
    });

    flipBtn.addEventListener("click", toggleFlip);
    nextBtn.addEventListener("click", nextCard);
    prevBtn.addEventListener("click", prevCard);
    shuffleBtn.addEventListener("click", shuffleCards);
    closeBtn.addEventListener("click", closeQuiz);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeQuiz();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && !modal.classList.contains("open") && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
            return;
        }
        if (!modal.classList.contains("open")) return;
        if (e.key === "Escape") closeQuiz();
        else if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggleFlip();
        } else if (e.key === "ArrowRight") nextCard();
        else if (e.key === "ArrowLeft") prevCard();
    });

    renderSubjectsGrid();
})();
