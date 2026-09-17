/**
 * Learn mode: Quizlet-style self-paced learning in small batches.
 * See a photo, then answer a question about who they are, their
 * major, their housing, or their hometown — a random mix of multiple
 * choice and typed-answer questions, auto-graded. A missed typed
 * question requires correctly retyping the answer before it will move
 * on. Missed questions come back around later in the same set; once
 * every question in a set has been answered correctly, move on to
 * the next set.
 */

const Learn = (() => {
  const FIELDS = {
    name: { prompt: () => "Who is this?", revealName: false, answer: (p) => Utils.fullName(p) },
    major: { prompt: (p) => `What is ${Utils.fullName(p)}'s major?`, revealName: true, answer: (p) => p.major },
    housing: { prompt: (p) => `Where does ${Utils.fullName(p)} live?`, revealName: true, answer: (p) => p.housing },
    hometown: { prompt: (p) => `Where is ${Utils.fullName(p)} from?`, revealName: true, answer: (p) => p.hometown },
  };
  const FIELD_KEYS = Object.keys(FIELDS);

  let setupEl, playEl, roundDoneEl, summaryEl;
  let faceHolder, nameRevealEl, promptEl, mcContainer, typeForm, typeInput, feedbackEl;
  let sets = []; // array of arrays of { id, field } entries, chunked from the scoped pool
  let setIndex = 0;
  let queue = []; // entries remaining in the current set (FIFO; misses go to the back)
  let current = null; // person for the active question
  let currentField = null; // FIELDS key for the active question
  let missedCounts = {}; // id -> times missed, across the whole session
  let locked = false;
  let remediating = false; // typed question was wrong; waiting for a correct retype

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

    document.getElementById("learn-start").addEventListener("click", start);
    document.getElementById("learn-next-round").addEventListener("click", nextSet);
    document.getElementById("learn-restart").addEventListener("click", showSetup);
    document.getElementById("learn-abandon").addEventListener("click", showSetup);
    typeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitTyped();
    });

    showSetup();
  }

  function showSetup() {
    setupEl.hidden = false;
    playEl.hidden = true;
    roundDoneEl.hidden = true;
    summaryEl.hidden = true;
  }

  function start() {
    const sizeInput = document.querySelector('input[name="learn-size"]:checked');
    const size = sizeInput ? parseInt(sizeInput.value, 10) : 5;

    const people = Utils.shuffle(Scope.getPeople());
    sets = [];
    for (let i = 0; i < people.length; i += size) {
      const chunk = people.slice(i, i + size);
      const entries = chunk.flatMap((p) => FIELD_KEYS.map((field) => ({ id: p.id, field })));
      sets.push(Utils.shuffle(entries));
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
      // never leave the queue otherwise).
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

  // Removes the current entry and moves on, without touching missedCounts
  // or requeueing — used once a remediation retype succeeds.
  function advance() {
    queue.shift();
    nextCard();
  }

  function grade(isCorrect) {
    const entry = queue.shift();
    if (!isCorrect) {
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
