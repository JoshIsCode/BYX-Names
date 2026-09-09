/**
 * App shell: wires up the mode tabs and initializes each mode module
 * once, on first visit, to keep things fast and simple.
 *
 * Called by js/auth.js once the password gate is passed and every
 * script has loaded — not on DOMContentLoaded, since that has
 * already fired by the time this file is dynamically loaded.
 */

function initApp() {
  document.getElementById("roster-count").textContent = PEOPLE.length;

  const tabs = document.querySelectorAll(".mode-tab");
  const panels = document.querySelectorAll(".mode-panel");
  const initialized = new Set();

  const modules = {
    gallery: Gallery,
    flashcards: Flashcards,
    quiz: Quiz,
    match: Match,
    list: ListView,
  };

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

  const saved = localStorage.getItem("byx-mode");
  activate(saved && modules[saved] ? saved : "gallery");
}
