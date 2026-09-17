/**
 * Learn mode: Quizlet-style self-paced learning in small batches.
 * See a photo, then answer who it is — a random mix of multiple
 * choice and typed-answer questions, auto-graded. Missed cards come
 * back around later in the same set; once every card in a set has
 * been answered correctly at least once, move on to the next set.
 */

const Learn = (() => {
  let setupEl, playEl, roundDoneEl, summaryEl;
  let faceHolder, mcContainer, typeForm, typeInput, feedbackEl;
  let sets = []; // array of arrays of person ids, chunked from the scoped pool
  let setIndex = 0;
  let queue = []; // ids remaining in the current set (FIFO; misses go to the back)
  let current = null;
  let missedCounts = {}; // id -> times missed, across the whole session
  let locked = false;

  function init() {
    setupEl = document.getElementById("learn-setup");
    playEl = document.getElementById("learn-play");
    roundDoneEl = document.getElementById("learn-round-done");
    summaryEl = document.getElementById("learn-summary");

    faceHolder = document.getElementById("learn-face");
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
      sets.push(people.slice(i, i + size).map((p) => p.id));
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

    current = PEOPLE.find((p) => p.id === queue[0]);
    locked = false;
    updateProgress();

    faceHolder.innerHTML = "";
    faceHolder.appendChild(Utils.buildFace(current, { size: "xl" }));

    feedbackEl.hidden = true;
    feedbackEl.textContent = "";
    typeInput.value = "";
    typeInput.classList.remove("correct", "incorrect");
    typeInput.disabled = false;

    if (Math.random() < 0.5) {
      renderMultipleChoice();
    } else {
      renderTyped();
    }
  }

  function renderMultipleChoice() {
    typeForm.hidden = true;
    mcContainer.hidden = false;
    mcContainer.innerHTML = "";

    const correct = Utils.fullName(current);
    const pool = Scope.getPeople().filter((p) => p.id !== current.id);
    const distractorNames = [...new Set(Utils.shuffle(pool).map(Utils.fullName))]
      .filter((n) => n !== correct)
      .slice(0, 3);
    const options = Utils.shuffle([correct, ...distractorNames]);

    for (const name of options) {
      const btn = Utils.el("button", "quiz-option", name);
      btn.type = "button";
      btn.addEventListener("click", () => gradeChoice(btn, name, correct));
      mcContainer.appendChild(btn);
    }
  }

  function renderTyped() {
    mcContainer.hidden = true;
    typeForm.hidden = false;
    typeInput.focus();
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
    if (locked) return;
    const raw = typeInput.value.trim();
    if (!raw) return;
    locked = true;

    const normalized = raw.toLowerCase().replace(/\s+/g, " ");
    const isCorrect = normalized === Utils.fullName(current).toLowerCase();

    typeInput.disabled = true;
    typeInput.classList.add(isCorrect ? "correct" : "incorrect");
    feedbackEl.hidden = false;
    feedbackEl.textContent = isCorrect ? "Correct!" : `Correct answer: ${Utils.fullName(current)}`;

    setTimeout(() => grade(isCorrect), 1300);
  }

  function grade(isCorrect) {
    queue.shift();
    if (!isCorrect) {
      missedCounts[current.id] = (missedCounts[current.id] || 0) + 1;
      queue.push(current.id); // comes back around later in this same set
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

    const totalPeople = sets.reduce((sum, s) => sum + s.length, 0);
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
