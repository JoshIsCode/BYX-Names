/**
 * Match mode: a matching game. Click a face, then click the info you
 * think belongs to it — name, major, housing, or hometown. Correct
 * pairs lock in green; wrong guesses flash red and reset. A fresh
 * round can be started at any time.
 */

const Match = (() => {
  const FIELD_LABELS = { name: "name", major: "major", housing: "housing", hometown: "hometown" };

  let container, facesCol, namesCol, statusEl, hintEl;
  let roundPeople = [];
  let matchField = "name";
  let selectedFace = null; // { id, el }
  let matchedCount = 0;
  let attempts = 0;

  function init() {
    container = document.getElementById("mode-match");
    facesCol = document.getElementById("match-faces");
    namesCol = document.getElementById("match-names");
    statusEl = document.getElementById("match-status");
    hintEl = document.getElementById("match-hint");

    document.getElementById("match-new-round").addEventListener("click", newRound);
    newRound();
  }

  function roundSize() {
    const input = document.querySelector('input[name="match-size"]:checked');
    return input ? parseInt(input.value, 10) : 8;
  }

  function selectedField() {
    const input = document.querySelector('input[name="match-field"]:checked');
    return input ? input.value : "name";
  }

  function tileText(person) {
    return matchField === "name" ? Utils.fullName(person) : person[matchField];
  }

  // For anything other than name, several people can share the same
  // value (same major, housing hall, or hometown) — pick at most one
  // person per distinct value so no two tiles ever show the same text.
  function poolForField(field) {
    const all = Scope.getPeople();
    if (field === "name") return all;
    const byValue = new Map();
    for (const p of Utils.shuffle(all)) {
      if (!byValue.has(p[field])) byValue.set(p[field], p);
    }
    return [...byValue.values()];
  }

  function newRound() {
    matchField = selectedField();
    hintEl.textContent = `Tap a face, then tap the ${FIELD_LABELS[matchField]} you think matches.`;

    const pool = poolForField(matchField);
    const size = Math.min(roundSize(), pool.length);
    roundPeople = Utils.shuffle(pool).slice(0, size);
    selectedFace = null;
    matchedCount = 0;
    attempts = 0;
    render();
  }

  function render() {
    facesCol.innerHTML = "";
    namesCol.innerHTML = "";

    const faceOrder = Utils.shuffle(roundPeople);
    const nameOrder = Utils.shuffle(roundPeople);

    for (const person of faceOrder) {
      const card = Utils.el("button", "match-tile match-face-tile");
      card.type = "button";
      card.dataset.id = person.id;
      card.appendChild(Utils.buildFace(person, { size: "fill" }));
      card.addEventListener("click", () => selectFace(card, person));
      facesCol.appendChild(card);
    }

    for (const person of nameOrder) {
      const card = Utils.el("button", "match-tile match-name-tile", tileText(person));
      card.type = "button";
      card.dataset.id = person.id;
      card.addEventListener("click", () => selectName(card, person));
      namesCol.appendChild(card);
    }

    updateStatus();
  }

  function selectFace(card, person) {
    if (card.classList.contains("matched")) return;
    document.querySelectorAll(".match-face-tile").forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedFace = { id: person.id, el: card };
  }

  function selectName(card, person) {
    if (card.classList.contains("matched") || !selectedFace) return;
    attempts++;

    if (selectedFace.id === person.id) {
      selectedFace.el.classList.remove("selected");
      selectedFace.el.classList.add("matched");
      card.classList.add("matched");
      selectedFace = null;
      matchedCount++;
      updateStatus();
      if (matchedCount === roundPeople.length) {
        statusEl.textContent = `Round complete! ${roundPeople.length} matched in ${attempts} attempts. 🎉`;
      }
    } else {
      updateStatus();
      card.classList.add("wrong");
      selectedFace.el.classList.add("wrong");
      setTimeout(() => {
        card.classList.remove("wrong");
        selectedFace?.el.classList.remove("wrong");
      }, 500);
    }
  }

  function updateStatus() {
    statusEl.textContent = `Matched ${matchedCount} / ${roundPeople.length} — Attempts: ${attempts}`;
  }

  return { init, refresh: newRound };
})();
