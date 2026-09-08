/**
 * Test mode: shows a face, then quizzes first name, last name, major,
 * housing, and hometown (one at a time, multiple choice) before moving
 * to the next person. Tracks a running score and shows a summary.
 */

const Quiz = (() => {
  const QUESTIONS = [
    { field: "firstName", prompt: () => "What is this person's first name?", revealName: false },
    { field: "lastName", prompt: () => "What is this person's last name?", revealName: false },
    { field: "major", prompt: (p) => `What is ${Utils.fullName(p)}'s major?`, revealName: true },
    { field: "housing", prompt: (p) => `Where does ${Utils.fullName(p)} live?`, revealName: true },
    { field: "hometown", prompt: (p) => `Where is ${Utils.fullName(p)} from?`, revealName: true },
  ];

  let setupEl, playEl, summaryEl;
  let queue = []; // list of { person, question }
  let qIndex = 0;
  let score = 0;
  let missed = [];
  let locked = false;

  function init() {
    setupEl = document.getElementById("quiz-setup");
    playEl = document.getElementById("quiz-play");
    summaryEl = document.getElementById("quiz-summary");

    document.getElementById("quiz-start").addEventListener("click", start);
    document.getElementById("quiz-restart").addEventListener("click", showSetup);
    document.getElementById("quiz-restart-2").addEventListener("click", showSetup);

    showSetup();
  }

  function showSetup() {
    setupEl.hidden = false;
    playEl.hidden = true;
    summaryEl.hidden = true;
  }

  function start() {
    const sizeChoice = document.querySelector('input[name="quiz-size"]:checked').value;
    let people = Utils.shuffle(PEOPLE);
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

    const correct = person[question.field];
    const options = Utils.shuffle([correct, ...Utils.distractors(PEOPLE, question.field, correct, 3)]);

    const optionsEl = document.getElementById("quiz-options");
    optionsEl.innerHTML = "";
    for (const option of options) {
      const btn = Utils.el("button", "quiz-option", option);
      btn.type = "button";
      btn.addEventListener("click", () => answer(btn, option, correct, person, question));
      optionsEl.appendChild(btn);
    }
  }

  function answer(btn, chosen, correct, person, question) {
    if (locked) return;
    locked = true;

    const allButtons = document.querySelectorAll("#quiz-options .quiz-option");
    allButtons.forEach((b) => (b.disabled = true));

    if (chosen === correct) {
      btn.classList.add("correct");
      score++;
    } else {
      btn.classList.add("incorrect");
      missed.push({ person, field: question.field, correct, chosen });
      allButtons.forEach((b) => {
        if (b.textContent === correct) b.classList.add("correct");
      });
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
          `${Utils.fullName(m.person)} — ${m.field}: ${m.correct} (you picked ${m.chosen})`
        );
        missedList.appendChild(line);
      }
    }
  }

  return { init };
})();
