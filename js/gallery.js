/**
 * Gallery mode: a grid of photo cards (photo, then name, then
 * major/housing/hometown). Click a card to expand it in place and
 * reveal the details below the name. Any number of cards can be
 * expanded at once ("all next to each other"). Column count is
 * user-adjustable (1-4) and remembered.
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
    colSlider.value = Number.isFinite(savedCols) ? savedCols : 3;
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
    const people = Scope.getPeople().filter((p) => Scope.matches(p, q));

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

    const photo = Utils.el("div", "gallery-card-photo");
    photo.appendChild(Utils.buildFace(person, { size: "fill" }));
    card.appendChild(photo);

    const body = Utils.el("div", "gallery-card-body");
    card.appendChild(body);

    const label = Utils.el("div", "gallery-card-label", Utils.fullName(person));
    body.appendChild(label);

    // Actives are face-to-name only, so there may be nothing to expand.
    const fields = Scope.detailFields(person);
    if (fields.length === 0) {
      card.classList.add("no-details");
      card.removeAttribute("aria-expanded");
      return card;
    }

    const details = Utils.el("div", "gallery-card-details");
    details.hidden = true;
    for (const { field, label } of fields) {
      details.appendChild(detailRow(label, person[field]));
    }
    body.appendChild(details);

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
