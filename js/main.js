/**
 * App shell: wires up the roster-group switch and the mode tabs, and
 * initializes each mode module once, on first visit, to keep things
 * fast and simple.
 *
 * Called by js/auth.js once the password gate is passed and every
 * script has loaded — not on DOMContentLoaded, since that has
 * already fired by the time this file is dynamically loaded.
 */

function initApp() {
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

  buildGroupTabs();
  applyGroupCopy();

  Roster.onChange(() => {
    applyGroupCopy();
    // Modes that have never been opened pick the new group up in init().
    initialized.forEach((mode) => modules[mode].reset());
  });

  const saved = localStorage.getItem("byx-mode");
  activate(saved && modules[saved] ? saved : "gallery");
}

function buildGroupTabs() {
  const nav = document.getElementById("group-tabs");
  for (const group of Roster.groups()) {
    const btn = Utils.el("button", "group-tab");
    btn.type = "button";
    btn.dataset.group = group.key;
    btn.appendChild(Utils.el("span", "group-tab-label", group.label));
    btn.appendChild(Utils.el("span", "group-tab-count", String(group.people.length)));
    btn.addEventListener("click", () => Roster.setGroup(group.key));
    nav.appendChild(btn);
  }
}

/**
 * Keeps the wording honest for the group on screen: the actives roster
 * is face-to-name only, so nothing should promise majors or hometowns.
 */
function applyGroupCopy() {
  const group = Roster.group();
  const namesOnly = Roster.namesOnly();
  const fields = Roster.groupDetailFields();

  document.querySelectorAll(".group-tab").forEach((tab) => {
    const active = tab.dataset.group === group.key;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });

  document.getElementById("roster-count").textContent = group.people.length;
  document.getElementById("roster-blurb").textContent = namesOnly
    ? "learn faces and names"
    : "learn names, majors, housing & hometowns";

  const searchPlaceholder = namesOnly
    ? "Search names…"
    : `Search name, ${fields.map((f) => f.label.toLowerCase()).join(", ")}…`;
  document.getElementById("gallery-search").placeholder = searchPlaceholder;
  document.getElementById("list-search").placeholder = searchPlaceholder;

  document.getElementById("gallery-hint").textContent = namesOnly
    ? "Photo and name only for the actives — there's nothing more to open."
    : "Tap a card to open it — tap again to close. Multiple can stay open at once.";

  document.getElementById("quiz-setup-hint").textContent = namesOnly
    ? "For each person you'll be asked their first name and last name."
    : `For each person you'll be asked their first name, last name, ${fields
        .map((f) => f.label.toLowerCase())
        .join(", ")}.`;
}
