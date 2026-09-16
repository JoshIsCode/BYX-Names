/**
 * Learn mode: Quizlet-style self-paced learning in small batches.
 * See a photo, try to recall who it is, reveal to check, then say
 * whether you knew it. Missed cards come back around later in the
 * same set; once every card in a set has been gotten right at least
 * once, move on to the next set.
 */

const Learn = (() => {
  let setupEl, playEl, roundDoneEl, summaryEl;
  let sets = []; // array of arrays of person ids, chunked from the scoped pool
  let setIndex = 0;
  let queue = []; // ids remaining in the current set (FIFO; misses go to the back)
  let current = null;
  let missedCounts = {}; // id -> times marked "still learning", across the whole session

  function init() {
    setupEl = document.getElementById("learn-setup");
    playEl = document.getElementById("learn-play");
    roundDoneEl = document.getElementById("learn-round-done");
    summaryEl = document.getElementById("learn-summary");

    document.getElementById("learn-start").addEventListener("click", start);
    document.getElementById("learn-reveal").addEventListener("click", reveal);
    document.getElementById("learn-again").addEventListener("click", () => grade(false));
    document.getElementById("learn-know").addEventListener("click", () => grade(true));
    document.getElementById("learn-next-round").addEventListener("click", nextSet);
    document.getElementById("learn-restart").addEventListener("click", showSetup);
    document.getElementById("learn-abandon").addEventListener("click", showSetup);

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
    updateProgress();

    const faceHolder = document.getElementById("learn-face");
    faceHolder.innerHTML = "";
    faceHolder.appendChild(Utils.buildFace(current, { size: "xl" }));

    document.getElementById("learn-details").hidden = true;
    document.getElementById("learn-reveal").hidden = false;
    document.getElementById("learn-grade").hidden = true;
  }

  function updateProgress() {
    const setSize = sets[setIndex].length;
    const remaining = queue.length;
    document.getElementById("learn-progress-bar").style.width = `${((setSize - remaining) / setSize) * 100}%`;
    document.getElementById("learn-progress-label").textContent =
      `Set ${setIndex + 1} of ${sets.length} — ${remaining} card${remaining === 1 ? "" : "s"} left`;
  }

  function reveal() {
    const detailsEl = document.getElementById("learn-details");
    detailsEl.innerHTML = "";
    detailsEl.appendChild(Utils.el("h3", "flashcard-name", Utils.fullName(current)));
    detailsEl.appendChild(detailLine("Major", current.major));
    detailsEl.appendChild(detailLine("Housing", current.housing));
    detailsEl.appendChild(detailLine("Hometown", current.hometown));
    detailsEl.hidden = false;

    document.getElementById("learn-reveal").hidden = true;
    document.getElementById("learn-grade").hidden = false;
  }

  function grade(knewIt) {
    queue.shift();
    if (!knewIt) {
      missedCounts[current.id] = (missedCounts[current.id] || 0) + 1;
      queue.push(current.id); // comes back around later in this same set
    }
    nextCard();
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

  function detailLine(label, value) {
    const line = Utils.el("p", "flashcard-detail-line");
    line.appendChild(Utils.el("span", "detail-label", label));
    line.appendChild(Utils.el("span", "detail-value", value));
    return line;
  }

  return { init };
})();
