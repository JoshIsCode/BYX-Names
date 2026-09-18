/**
 * Learn mode: Quizlet-style self-paced learning in small batches.
 * See a photo, then answer a question about who they are, their
 * major, their housing, or their hometown — a random mix of multiple
 * choice and typed-answer questions, auto-graded. A missed typed
 * question requires correctly retyping the answer before it will move
 * on. Missed questions come back around later in the same set; once
 * every question in a set has been answered correctly, move on to
 * the next set.
 *
 * Progress persists per-browser (localStorage), like Quizlet's Learn
 * mode:
 *   - Mastery: a question you've answered right on the first try
 *     (no requeue, no remediation needed) is remembered as mastered
 *     and won't come up again in future sessions, until reset.
 *   - Resume: the in-progress set/run is saved after every question,
 *     so closing the tab mid-set and coming back offers to pick up
 *     right where it left off instead of starting over.
 */

const Learn = (() => {
  const FIELDS = {
    name: { prompt: () => "Who is this?", revealName: false, answer: (p) => Utils.fullName(p) },
    major: { prompt: (p) => `What is ${Utils.fullName(p)}'s major?`, revealName: true, answer: (p) => p.major },
    housing: { prompt: (p) => `Where does ${Utils.fullName(p)} live?`, revealName: true, answer: (p) => p.housing },
    hometown: { prompt: (p) => `Where is ${Utils.fullName(p)} from?`, revealName: true, answer: (p) => p.hometown },
  };
  const FIELD_KEYS = Object.keys(FIELDS);

  const MASTERY_KEY = "byx-learn-mastery";
  const SESSION_KEY = "byx-learn-session";

  let mastery = loadJSON(MASTERY_KEY, {});

  let setupEl, playEl, roundDoneEl, summaryEl;
  let faceHolder, nameRevealEl, promptEl, mcContainer, typeForm, typeInput, feedbackEl;
  let masteryStatEl, resumeBtn, resetBtn;
  let sets = []; // array of arrays of { id, field } entries, chunked from the scoped pool
  let setIndex = 0;
  let queue = []; // entries remaining in the current set (FIFO; misses go to the back)
  let current = null; // person for the active question
  let currentField = null; // FIELDS key for the active question
  let missedCounts = {}; // id -> times missed, across the whole session
  let locked = false;
  let remediating = false; // typed question was wrong; waiting for a correct retype

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage unavailable (private mode, quota, etc.) — progress
      // just won't persist across visits; the session still works.
    }
  }

  function masteryKey(id, field) {
    return `${id}:${field}`;
  }

  function isMastered(id, field) {
    return !!mastery[masteryKey(id, field)];
  }

  function markMastered(id, field) {
    mastery[masteryKey(id, field)] = true;
    saveJSON(MASTERY_KEY, mastery);
  }

  function resetMastery() {
    mastery = {};
    saveJSON(MASTERY_KEY, mastery);
    saveJSON(SESSION_KEY, null);
  }

  function saveSession() {
    saveJSON(SESSION_KEY, { sets, setIndex, queue, missedCounts });
  }

  function loadSession() {
    const saved = loadJSON(SESSION_KEY, null);
    if (!saved || !Array.isArray(saved.sets) || !Array.isArray(saved.queue)) return null;
    return saved;
  }

  function clearSession() {
    saveJSON(SESSION_KEY, null);
  }

  function init() {
    setupEl = document.getElementById("learn-setup");
    playEl = document.getElementById("learn-play");
    roundDoneEl = document.getElementById("learn-round-done");
    summaryEl = document.getElementById("learn-summary");

    faceHolder = document.getElementById("learn-face");
    nameRevealEl = document.getElementById("learn-name-reveal");
    promptEl = document.getElementById("learn-prompt");
    mcContainer = document.getElementById("learn-mc");
    typeForm = document.getElementById("learn-type-form");
    typeInput = document.getElementById("learn-type-input");
    feedbackEl = document.getElementById("learn-feedback");
    masteryStatEl = document.getElementById("learn-mastery-stat");
    resumeBtn = document.getElementById("learn-resume");
    resetBtn = document.getElementById("learn-reset-progress");

    document.getElementById("learn-start").addEventListener("click", start);
    document.getElementById("learn-next-round").addEventListener("click", nextSet);
    document.getElementById("learn-restart").addEventListener("click", showSetup);
    document.getElementById("learn-abandon").addEventListener("click", showSetup);
    resumeBtn.addEventListener("click", resumeSession);
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset all Learn mode progress? This can't be undone.")) {
        resetMastery();
        updateSetupStats();
      }
    });
    typeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitTyped();
    });

    showSetup();
  }

  function updateSetupStats() {
    const people = Scope.getPeople();
    const total = people.length * FIELD_KEYS.length;
    const masteredCount = people.reduce(
      (sum, p) => sum + FIELD_KEYS.filter((f) => isMastered(p.id, f)).length,
      0
    );

    masteryStatEl.textContent =
      masteredCount === 0
        ? ""
        : masteredCount >= total
          ? "Everything in this study set is already mastered! Reset progress to practice it again."
          : `${masteredCount} of ${total} questions mastered in this study set.`;

    resetBtn.hidden = masteredCount === 0;

    const saved = loadSession();
    resumeBtn.hidden = !saved || saved.queue.length === 0;
  }

  function showSetup() {
    setupEl.hidden = false;
    playEl.hidden = true;
    roundDoneEl.hidden = true;
    summaryEl.hidden = true;
    updateSetupStats();
  }

  function resumeSession() {
    const saved = loadSession();
    if (!saved) return;
    sets = saved.sets;
    setIndex = saved.setIndex;
    queue = saved.queue;
    missedCounts = saved.missedCounts || {};

    setupEl.hidden = true;
    summaryEl.hidden = true;
    roundDoneEl.hidden = true;
    playEl.hidden = false;
    nextCard();
  }

  function start() {
    const sizeInput = document.querySelector('input[name="learn-size"]:checked');
    const size = sizeInput ? parseInt(sizeInput.value, 10) : 5;

    const people = Utils.shuffle(Scope.getPeople());
    sets = [];
    for (let i = 0; i < people.length; i += size) {
      const chunk = people.slice(i, i + size);
      const entries = chunk
        .flatMap((p) => FIELD_KEYS.map((field) => ({ id: p.id, field })))
        .filter((e) => !isMastered(e.id, e.field));
      if (entries.length > 0) sets.push(Utils.shuffle(entries));
    }

    if (sets.length === 0) {
      updateSetupStats();
      return;
    }

    setIndex = 0;
    missedCounts = {};
    setupEl.hidden = true;
    summaryEl.hidden = true;
    roundDoneEl.hidden = true;
    playEl.hidden = false;
    startSet();
  }

  function startSet() {
    queue = [...sets[setIndex]];
    nextCard();
  }

  function nextSet() {
    setIndex++;
    if (setIndex >= sets.length) {
      finishAll();
      return;
    }
    roundDoneEl.hidden = true;
    playEl.hidden = false;
    startSet();
  }

  function nextCard() {
    saveSession();

    if (queue.length === 0) {
      finishSet();
      return;
    }

    const entry = queue[0];
    current = PEOPLE.find((p) => p.id === entry.id);
    currentField = FIELDS[entry.field];
    locked = false;
    remediating = false;
    updateProgress();

    faceHolder.innerHTML = "";
    faceHolder.appendChild(Utils.buildFace(current, { size: "xl" }));

    nameRevealEl.textContent = currentField.revealName ? Utils.fullName(current) : "";
    promptEl.textContent = currentField.prompt(current);

    feedbackEl.hidden = true;
    feedbackEl.classList.remove("remediation");
    feedbackEl.textContent = "";
    typeInput.value = "";
    typeInput.classList.remove("correct", "incorrect");
    typeInput.disabled = false;
    typeInput.placeholder =
      entry.field === "name" ? "Type their first and last name…" : `Type their ${entry.field}…`;

    if (Math.random() < 0.5) {
      renderMultipleChoice(entry.field);
    } else {
      renderTyped();
    }
  }

  function renderMultipleChoice(field) {
    typeForm.hidden = true;
    mcContainer.hidden = false;
    mcContainer.innerHTML = "";

    const correct = currentField.answer(current);
    let distractors;
    if (field === "name") {
      const others = Scope.getPeople().filter((p) => p.id !== current.id);
      const names = [...new Set(others.map(Utils.fullName))].filter((n) => n !== correct);
      distractors = Utils.shuffle(names).slice(0, 3);
    } else {
      distractors = Utils.distractors(Scope.getPeople(), field, correct, 3);
    }
    const options = Utils.shuffle([correct, ...distractors]);

    for (const value of options) {
      const btn = Utils.el("button", "quiz-option", value);
      btn.type = "button";
      btn.addEventListener("click", () => gradeChoice(btn, value, correct));
      mcContainer.appendChild(btn);
    }
  }

  function renderTyped() {
    mcContainer.hidden = true;
    typeForm.hidden = false;
    typeInput.focus();
  }

  function normalize(s) {
    return s.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function gradeChoice(btn, chosen, correct) {
    if (locked) return;
    locked = true;

    const allButtons = mcContainer.querySelectorAll(".quiz-option");
    allButtons.forEach((b) => (b.disabled = true));

    const isCorrect = chosen === correct;
    btn.classList.add(isCorrect ? "correct" : "incorrect");
    if (!isCorrect) {
      allButtons.forEach((b) => {
        if (b.textContent === correct) b.classList.add("correct");
      });
    }

    setTimeout(() => grade(isCorrect), 900);
  }

  function submitTyped() {
    const raw = typeInput.value.trim();
    if (!raw) return;

    const correct = currentField.answer(current);

    if (remediating) {
      // Must retype the correct answer, exactly, to move on. This was
      // already counted as a miss when it first went wrong below, so
      // just move on now — no further miss, and no requeue (it would
      // never leave the queue otherwise), and no mastery credit either.
      if (normalize(raw) === normalize(correct)) {
        typeInput.disabled = true;
        typeInput.classList.remove("incorrect");
        typeInput.classList.add("correct");
        feedbackEl.classList.remove("remediation");
        feedbackEl.textContent = "Correct!";
        setTimeout(advance, 700);
      } else {
        typeInput.classList.add("incorrect");
        typeInput.select();
      }
      return;
    }

    if (locked) return;
    locked = true;

    const isCorrect = normalize(raw) === normalize(correct);
    typeInput.classList.add(isCorrect ? "correct" : "incorrect");
    feedbackEl.hidden = false;

    if (isCorrect) {
      typeInput.disabled = true;
      feedbackEl.textContent = "Correct!";
      setTimeout(() => grade(true), 900);
    } else {
      // Stay on this question — retype the correct answer to continue.
      missedCounts[current.id] = (missedCounts[current.id] || 0) + 1;
      remediating = true;
      locked = false;
      feedbackEl.classList.add("remediation");
      feedbackEl.textContent = `Correct answer: ${correct} — type it to continue`;
      typeInput.value = "";
      typeInput.focus();
    }
  }

  // Removes the current entry and moves on, without touching missedCounts,
  // mastery, or requeueing — used once a remediation retype succeeds.
  function advance() {
    queue.shift();
    nextCard();
  }

  function grade(isCorrect) {
    const entry = queue.shift();
    if (isCorrect) {
      markMastered(entry.id, entry.field);
    } else {
      missedCounts[entry.id] = (missedCounts[entry.id] || 0) + 1;
      queue.push(entry); // comes back around later in this same set
    }
    nextCard();
  }

  function updateProgress() {
    const setSize = sets[setIndex].length;
    const remaining = queue.length;
    document.getElementById("learn-progress-bar").style.width = `${((setSize - remaining) / setSize) * 100}%`;
    document.getElementById("learn-progress-label").textContent =
      `Set ${setIndex + 1} of ${sets.length} — ${remaining} card${remaining === 1 ? "" : "s"} left`;
  }

  function finishSet() {
    playEl.hidden = true;
    roundDoneEl.hidden = false;

    const remainingSets = sets.length - setIndex - 1;
    const isLast = remainingSets === 0;
    document.getElementById("learn-round-heading").textContent = isLast ? "Last set complete!" : "Set complete!";
    document.getElementById("learn-round-sub").textContent = isLast
      ? "That's everyone in this study set."
      : `${remainingSets} set${remainingSets === 1 ? "" : "s"} to go.`;
    document.getElementById("learn-next-round").textContent = isLast ? "Finish" : "Next Set";
  }

  function finishAll() {
    clearSession();
    roundDoneEl.hidden = true;
    summaryEl.hidden = false;

    const totalPeople = new Set(sets.flat().map((e) => e.id)).size;
    document.getElementById("learn-summary-sub").textContent =
      `You went through all ${totalPeople} ${totalPeople === 1 ? "person" : "people"} in this study set.`;

    const extra = document.getElementById("learn-extra-practice");
    extra.innerHTML = "";
    const struggled = Object.entries(missedCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);

    if (struggled.length === 0) {
      extra.appendChild(Utils.el("p", "empty-state", "Nailed every one on the first try! \u{1F389}"));
    } else {
      extra.appendChild(Utils.el("p", "quiz-missed-heading", "Took more than one try:"));
      for (const [id, count] of struggled) {
        const person = PEOPLE.find((p) => p.id === Number(id));
        extra.appendChild(
          Utils.el("p", "quiz-missed-line", `${Utils.fullName(person)} — missed ${count} time${count === 1 ? "" : "s"}`)
        );
      }
    }
  }

  return { init };
})();
