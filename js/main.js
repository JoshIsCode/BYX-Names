/**
 * App shell: wires up the mode tabs, the study-set scope selector, and
 * initializes each mode module once, on first visit, to keep things
 * fast and simple.
 */

function initApp() {
  const tabs = document.querySelectorAll(".mode-tab");
  const panels = document.querySelectorAll(".mode-panel");
  const initialized = new Set();

  const modules = {
    gallery: Gallery,
    flashcards: Flashcards,
    learn: Learn,
    quiz: Quiz,
    match: Match,
    list: ListView,
  };

  function updateRosterCount() {
    document.getElementById("roster-count").textContent = Scope.getPeople().length;
  }

  function activate(mode) {
    tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.mode === mode));
    panels.forEach((panel) => (panel.hidden = panel.id !== `mode-${mode}`));

    if (!initialized.has(mode)) {
      modules[mode]?.init();
      initialized.add(mode);
    }

    localStorage.setItem("byx-mode", mode);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab.dataset.mode));
  });

  // Study-set scope: one dropdown, shared across every mode.
  const scopeSelect = document.getElementById("scope-select");
  scopeSelect.value = Scope.get();
  scopeSelect.addEventListener("change", () => Scope.set(scopeSelect.value));

  Scope.onChange(() => {
    updateRosterCount();
    // Gallery/Flashcards/Match/List show a live view as soon as their
    // tab is opened, so re-render them now if they've been visited.
    // Quiz and Learn only read the scope when you press Start, so they
    // don't need an explicit refresh — the next round just picks it up.
    if (initialized.has("gallery")) Gallery.render();
    if (initialized.has("flashcards")) Flashcards.refresh();
    if (initialized.has("match")) Match.refresh();
    if (initialized.has("list")) ListView.render();
  });

  updateRosterCount();

  const saved = localStorage.getItem("byx-mode");
  activate(saved && modules[saved] ? saved : "gallery");
}

initApp();
