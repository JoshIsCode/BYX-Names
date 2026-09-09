/**
 * Flashcard mode: one person at a time. Tap/click the card (or press
 * space/enter) to flip between face and full details. Prev/Next to
 * move through the deck, shuffle to randomize order.
 */

const Flashcards = (() => {
  let container, cardEl, faceSlot, detailsSlot, progressEl, flipHint;
  let order = [];
  let index = 0;
  let flipped = false;

  function init() {
    container = document.getElementById("mode-flashcards");
    cardEl = document.getElementById("flashcard");
    faceSlot = document.getElementById("flashcard-face");
    detailsSlot = document.getElementById("flashcard-details");
    progressEl = document.getElementById("flashcard-progress");

    document.getElementById("flashcard-prev").addEventListener("click", () => step(-1));
    document.getElementById("flashcard-next").addEventListener("click", () => step(1));
    document.getElementById("flashcard-shuffle").addEventListener("click", shuffleDeck);
    cardEl.addEventListener("click", flip);
    cardEl.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
      }
    });

    order = PEOPLE.map((p) => p.id);
    index = 0;
    render();
  }

  function shuffleDeck() {
    order = Utils.shuffle(order);
    index = 0;
    flipped = false;
    render();
  }

  function step(delta) {
    index = (index + delta + order.length) % order.length;
    flipped = false;
    render();
  }

  function flip() {
    flipped = !flipped;
    render();
  }

  function render() {
    const person = PEOPLE.find((p) => p.id === order[index]);
    faceSlot.innerHTML = "";
    detailsSlot.innerHTML = "";
    cardEl.classList.toggle("flipped", flipped);

    if (!flipped) {
      faceSlot.appendChild(Utils.buildFace(person, { size: "fill" }));
      const caption = Utils.el("div", "flashcard-face-caption");
      caption.appendChild(Utils.el("p", "flashcard-name", Utils.fullName(person)));
      faceSlot.appendChild(caption);
      faceSlot.hidden = false;
      detailsSlot.hidden = true;
    } else {
      detailsSlot.appendChild(Utils.el("h3", "flashcard-name", Utils.fullName(person)));
      detailsSlot.appendChild(detailLine("Major", person.major));
      detailsSlot.appendChild(detailLine("Housing", person.housing));
      detailsSlot.appendChild(detailLine("Hometown", person.hometown));
      faceSlot.hidden = true;
      detailsSlot.hidden = false;
    }

    progressEl.textContent = `${index + 1} / ${order.length} — tap card to flip`;
  }

  function detailLine(label, value) {
    const line = Utils.el("p", "flashcard-detail-line");
    line.appendChild(Utils.el("span", "detail-label", label));
    line.appendChild(Utils.el("span", "detail-value", value));
    return line;
  }

  return { init };
})();
