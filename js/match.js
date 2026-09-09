/**
 * Match mode: a matching game. Click a face, then click the name you
 * think belongs to it. Correct pairs lock in green; wrong guesses
 * flash red and reset. A fresh round can be started at any time.
 */

const Match = (() => {
  let container, facesCol, namesCol, statusEl;
  let roundPeople = [];
  let selectedFace = null; // { id, el }
  let matchedCount = 0;
  let attempts = 0;

  function init() {
    container = document.getElementById("mode-match");
    facesCol = document.getElementById("match-faces");
    namesCol = document.getElementById("match-names");
    statusEl = document.getElementById("match-status");

    document.getElementById("match-new-round").addEventListener("click", newRound);
    newRound();
  }

  function roundSize() {
    const input = document.querySelector('input[name="match-size"]:checked');
    return input ? parseInt(input.value, 10) : 8;
  }

  function newRound() {
    const size = Math.min(roundSize(), PEOPLE.length);
    roundPeople = Utils.shuffle(PEOPLE).slice(0, size);
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
      const card = Utils.el("button", "match-tile match-name-tile", Utils.fullName(person));
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

  return { init };
})();
