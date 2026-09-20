/**
 * Test mode: shows a face, then quizzes first name, last name, major,
 * housing, and hometown (one at a time) before moving to the next
 * person. Answered either as multiple choice or typed, per the
 * setup screen's choice. Tracks a running score and shows a summary.
 */

const Quiz = (() => {
  const QUESTIONS = [
    { field: "firstName", prompt: () => "What is this person's first name?", revealName: false, placeholder: "Type their first name…" },
    { field: "lastName", prompt: () => "What is this person's last name?", revealName: false, placeholder: "Type their last name…" },
    { field: "major", prompt: (p) => `What is ${Utils.fullName(p)}'s major?`, revealName: true, placeholder: "Type their major…" },
    { field: "housing", prompt: (p) => `Where does ${Utils.fullName(p)} live?`, revealName: true, placeholder: "Type where they live…" },
    { field: "hometown", prompt: (p) => `Where is ${Utils.fullName(p)} from?`, revealName: true, placeholder: "Type their hometown…" },
  ];

  let setupEl, playEl, summaryEl;
  let optionsEl, typeForm, typeInput, feedbackEl;
  let answerMode = "mc";
  let queue = []; // list of { person, question }
  let qIndex = 0;
  let score = 0;
  let missed = [];
  let locked = false;

  function init() {
    setupEl = document.getElementById("quiz-setup");
    playEl = document.getElementById("quiz-play");
    summaryEl = document.getElementById("quiz-summary");
    optionsEl = document.getElementById("quiz-options");
    typeForm = document.getElementById("quiz-type-form");
    typeInput = document.getElementById("quiz-type-input");
    feedbackEl = document.getElementById("quiz-feedback");

    document.getElementById("quiz-start").addEventListener("click", start);
    document.getElementById("quiz-restart").addEventListener("click", showSetup);
    document.getElementById("quiz-restart-2").addEventListener("click", showSetup);
    typeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitTyped();
    });

    showSetup();
  }

  function showSetup() {
    setupEl.hidden = false;
    playEl.hidden = true;
    summaryEl.hidden = true;
  }

  function start() {
    const sizeChoice = document.querySelector('input[name="quiz-size"]:checked').value;
    answerMode = document.querySelector('input[name="quiz-answer-mode"]:checked').value;
    let people = Utils.shuffle(Scope.getPeople());
    if (sizeChoice !== "all") {
      people = people.slice(0, Math.min(parseInt(sizeChoice, 10), people.length));
    }

    queue = [];
    for (const person of people) {
      for (const question of QUESTIONS) {
        queue.push({ person, question });
      }
    }

    qIndex = 0;
    score = 0;
    missed = [];
    setupEl.hidden = true;
    summaryEl.hidden = true;
    playEl.hidden = false;
    renderQuestion();
  }

  function normalize(s) {
    return s.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function renderQuestion() {
    locked = false;
    const { person, question } = queue[qIndex];
    const total = queue.length;

    document.getElementById("quiz-progress-bar").style.width = `${(qIndex / total) * 100}%`;
    document.getElementById("quiz-progress-label").textContent = `Question ${qIndex + 1} of ${total} — Score ${score}`;

    const faceHolder = document.getElementById("quiz-face");
    faceHolder.innerHTML = "";
    faceHolder.appendChild(Utils.buildFace(person, { size: "xl" }));

    const nameHolder = document.getElementById("quiz-name-reveal");
    nameHolder.textContent = question.revealName ? Utils.fullName(person) : "";

    document.getElementById("quiz-prompt").textContent = question.prompt(person);

    feedbackEl.hidden = true;
    feedbackEl.textContent = "";

    const correct = person[question.field];

    if (answerMode === "typed") {
      optionsEl.hidden = true;
      typeForm.hidden = false;
      typeInput.value = "";
      typeInput.classList.remove("correct", "incorrect");
      typeInput.disabled = false;
      typeInput.placeholder = question.placeholder;
      typeInput.focus();
    } else {
      typeForm.hidden = true;
      optionsEl.hidden = false;
      optionsEl.innerHTML = "";
      const options = Utils.shuffle([correct, ...Utils.distractors(Scope.getPeople(), question.field, correct, 3)]);
      for (const option of options) {
        const btn = Utils.el("button", "quiz-option", option);
        btn.type = "button";
        btn.addEventListener("click", () => answerMc(btn, option, correct, person, question));
        optionsEl.appendChild(btn);
      }
    }
  }

  function answerMc(btn, chosen, correct, person, question) {
    if (locked) return;
    locked = true;

    const allButtons = optionsEl.querySelectorAll(".quiz-option");
    allButtons.forEach((b) => (b.disabled = true));

    const isCorrect = chosen === correct;
    btn.classList.add(isCorrect ? "correct" : "incorrect");
    if (!isCorrect) {
      allButtons.forEach((b) => {
        if (b.textContent === correct) b.classList.add("correct");
      });
    }

    recordAndAdvance(isCorrect, person, question, correct, chosen);
  }

  function submitTyped() {
    if (locked) return;
    const raw = typeInput.value.trim();
    if (!raw) return;
    locked = true;

    const { person, question } = queue[qIndex];
    const correct = person[question.field];
    const isCorrect = normalize(raw) === normalize(correct);

    typeInput.disabled = true;
    typeInput.classList.add(isCorrect ? "correct" : "incorrect");
    feedbackEl.hidden = false;
    feedbackEl.textContent = isCorrect ? "Correct!" : `Correct answer: ${correct}`;

    recordAndAdvance(isCorrect, person, question, correct, raw);
  }

  function recordAndAdvance(isCorrect, person, question, correct, chosen) {
    if (isCorrect) {
      score++;
    } else {
      missed.push({ person, field: question.field, correct, chosen });
    }

    setTimeout(() => {
      qIndex++;
      if (qIndex >= queue.length) {
        finish();
      } else {
        renderQuestion();
      }
    }, 900);
  }

  function finish() {
    playEl.hidden = true;
    summaryEl.hidden = false;

    const total = queue.length;
    const pct = Math.round((score / total) * 100);
    document.getElementById("quiz-score-headline").textContent = `${score} / ${total} (${pct}%)`;

    const missedList = document.getElementById("quiz-missed-list");
    missedList.innerHTML = "";
    if (missed.length === 0) {
      missedList.appendChild(Utils.el("p", "empty-state", "Perfect score! 🎉"));
    } else {
      const heading = Utils.el("p", "quiz-missed-heading", "Review these:");
      missedList.appendChild(heading);
      for (const m of missed) {
        const line = Utils.el(
          "p",
          "quiz-missed-line",
          `${Utils.fullName(m.person)} — ${m.field}: ${m.correct} (you said ${m.chosen})`
        );
        missedList.appendChild(line);
      }
    }
  }

  return { init };
})();
