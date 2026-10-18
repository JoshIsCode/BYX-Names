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

  // Study-set scope: one dropdown, shared across every mode. Options
  // come from Scope.ranges() so the counts can't drift from the data.
  const scopeSelect = document.getElementById("scope-select");
  for (const [key, range] of Object.entries(Scope.ranges())) {
    const option = Utils.el("option", null, `${range.label} (${Scope.peopleIn(key).length})`);
    option.value = key;
    scopeSelect.appendChild(option);
  }
  scopeSelect.value = Scope.get();
  scopeSelect.addEventListener("change", () => Scope.set(scopeSelect.value));

  Scope.onChange(() => {
    applyScopeCopy();
    // Gallery/Flashcards/Match/List show a live view as soon as their
    // tab is opened, so re-render them now if they've been visited.
    // Quiz only reads the scope when you press Start, so it doesn't
    // need an explicit refresh — the next round just picks it up.
    // Learn is the same, except for the mastery count on its setup
    // screen, which is per-scope and would otherwise read stale.
    if (initialized.has("gallery")) Gallery.render();
    if (initialized.has("flashcards")) Flashcards.refresh();
    if (initialized.has("match")) Match.refresh();
    if (initialized.has("list")) ListView.render();
    if (initialized.has("learn")) Learn.refresh();
  });

  applyScopeCopy();

  const saved = localStorage.getItem("byx-mode");
  activate(saved && modules[saved] ? saved : "gallery");
}

/**
 * Keeps the wording honest for the scope on screen: the actives are
 * face-to-name only, so nothing should promise majors or hometowns
 * when they're the ones being studied.
 */
function applyScopeCopy() {
  const namesOnly = Scope.namesOnly();
  const fields = Scope.scopeFields();
  const fieldList = fields.map((f) => f.label.toLowerCase()).join(", ");

  document.getElementById("roster-count").textContent = Scope.getPeople().length;
  document.getElementById("roster-blurb").textContent = namesOnly
    ? "learn faces and names"
    : `learn names, ${joinList(fields.map((f) => f.plural), "&")}`;

  const searchPlaceholder = namesOnly ? "Search names…" : `Search name, ${fieldList}…`;
  document.getElementById("gallery-search").placeholder = searchPlaceholder;
  document.getElementById("list-search").placeholder = searchPlaceholder;

  document.getElementById("gallery-hint").textContent = namesOnly
    ? "Photo and name only for the actives — there's nothing more to open."
    : "Tap a card to open it — tap again to close. Multiple can stay open at once.";

  document.getElementById("list-swipe-hint").hidden = namesOnly;

  document.getElementById("learn-setup-hint").textContent = namesOnly
    ? "See a photo and name whose face it is — sometimes multiple choice, sometimes typed. " +
      "Cards you miss come back around until you've got them (typed answers need a correct " +
      "retype to move on) — then it's on to the next set. Anything you get right on the first " +
      "try is remembered, so it won't come back around next time you study."
    : "See a photo, then answer questions about their name, major, housing, or hometown — " +
      "sometimes multiple choice, sometimes typed. Cards you miss come back around until " +
      "you've got them (typed answers need a correct retype to move on) — then it's on to the " +
      "next set. Anything you get right on the first try is remembered, so it won't come back " +
      "around next time you study.";

  document.getElementById("quiz-setup-hint").textContent = namesOnly
    ? "For each person you'll be asked their first name and last name — as multiple choice, or typed out yourself."
    : `For each person you'll be asked their first name, last name, ${joinList(
        fields.map((f) => f.label.toLowerCase()),
        "and"
      )} — as multiple choice, or typed out yourself.`;

  // Matching on a detail nobody in this scope has would deal an empty
  // board, so those choices are only offered when they'd work.
  document.querySelectorAll('input[name="match-field"]').forEach((input) => {
    const usable = input.value === "name" || fields.some((f) => f.field === input.value);
    input.disabled = !usable;
    input.closest("label").classList.toggle("choice-disabled", !usable);
    if (!usable && input.checked) {
      document.querySelector('input[name="match-field"][value="name"]').checked = true;
    }
  });
}

/** ["a", "b", "c"] -> "a, b & c" (or "a, b and c"). */
function joinList(items, conjunction) {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1]}`;
}

initApp();
