/**
 * Gallery mode: a grid of faces. Click a face to expand it in place
 * into a flashcard-style panel showing name + details. Any number of
 * cards can be expanded at once ("all next to each other"). Column
 * count is user-adjustable and remembered.
 */

const Gallery = (() => {
  let container, grid, colSlider, colLabel, search;

  function init() {
    container = document.getElementById("mode-gallery");
    grid = document.getElementById("gallery-grid");
    colSlider = document.getElementById("gallery-columns");
    colLabel = document.getElementById("gallery-columns-label");
    search = document.getElementById("gallery-search");

    const savedCols = parseInt(localStorage.getItem("byx-gallery-cols"), 10);
    colSlider.value = Number.isFinite(savedCols) ? savedCols : 5;
    applyColumns();

    colSlider.addEventListener("input", () => {
      applyColumns();
      localStorage.setItem("byx-gallery-cols", colSlider.value);
    });

    search.addEventListener("input", render);

    render();
  }

  function applyColumns() {
    const n = colSlider.value;
    colLabel.textContent = n;
    grid.style.setProperty("--gallery-cols", n);
  }

  function render() {
    grid.innerHTML = "";
    const q = search.value.trim().toLowerCase();
    const people = PEOPLE.filter((p) => {
      if (!q) return true;
      return (
        Utils.fullName(p).toLowerCase().includes(q) ||
        p.major.toLowerCase().includes(q) ||
        p.housing.toLowerCase().includes(q) ||
        p.hometown.toLowerCase().includes(q)
      );
    });

    if (people.length === 0) {
      grid.appendChild(Utils.el("p", "empty-state", "No one matches that search."));
      return;
    }

    for (const person of people) {
      grid.appendChild(buildCard(person));
    }
  }

  function buildCard(person) {
    const card = Utils.el("button", "gallery-card");
    card.type = "button";
    card.setAttribute("aria-expanded", "false");
    card.appendChild(Utils.buildFace(person, { size: "lg" }));

    const label = Utils.el("div", "gallery-card-label", Utils.fullName(person));
    card.appendChild(label);

    const details = Utils.el("div", "gallery-card-details");
    details.hidden = true;
    details.appendChild(detailRow("Major", person.major));
    details.appendChild(detailRow("Housing", person.housing));
    details.appendChild(detailRow("Hometown", person.hometown));
    card.appendChild(details);

    card.addEventListener("click", () => {
      const expanded = card.classList.toggle("expanded");
      details.hidden = !expanded;
      card.setAttribute("aria-expanded", String(expanded));
    });

    return card;
  }

  function detailRow(label, value) {
    const row = Utils.el("div", "detail-row");
    row.appendChild(Utils.el("span", "detail-label", label));
    row.appendChild(Utils.el("span", "detail-value", value));
    return row;
  }

  return { init, render };
})();
