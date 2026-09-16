/**
 * Study-set scope: which slice of the roster the active modes pull
 * from. One shared setting so narrowing down to "just what we're
 * tested on" applies across Gallery/Flashcards/Learn/Test/Match/List
 * at once, instead of mode by mode. Persisted per-browser.
 *
 * To add another named range later, add an entry here (id range is
 * inclusive) and a matching <option> in index.html's #scope-select.
 */

const Scope = (() => {
  const RANGES = {
    all: { label: "Everyone (72)", from: null, to: null },
    test36: { label: "Sanders → Whitefield (36) — test range", from: 1, to: 36 },
  };

  const KEY = "byx-scope";
  let current = localStorage.getItem(KEY);
  if (!RANGES[current]) current = "all";

  const listeners = [];

  function getPeople() {
    const r = RANGES[current];
    if (r.from == null) return PEOPLE;
    return PEOPLE.filter((p) => p.id >= r.from && p.id <= r.to);
  }

  function get() {
    return current;
  }

  function set(key) {
    if (!RANGES[key] || key === current) return;
    current = key;
    localStorage.setItem(KEY, key);
    listeners.forEach((fn) => fn());
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function ranges() {
    return RANGES;
  }

  return { getPeople, get, set, onChange, ranges };
})();
