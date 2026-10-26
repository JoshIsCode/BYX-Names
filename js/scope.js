/**
 * Study-set scope: which slice of the roster the active modes pull
 * from. One shared setting so narrowing down to "just what we're
 * tested on" applies across Gallery/Flashcards/Learn/Test/Match/List
 * at once, instead of mode by mode. Persisted per-browser.
 *
 * Two rosters feed it: the pledge class (js/data.js — full details)
 * and the actives (js/data-actives.js — face-to-name only). A scope
 * is a source array plus an optional inclusive id range.
 *
 * To add another named range later, add an entry to RANGES; the
 * dropdown in index.html is built from it, counts and all.
 *
 * Detail fields (major/housing/hometown) are optional per person, so
 * a scope can hold people who have them and people who don't. Ask
 * detailFields(person) for one person's fields, or scopeFields() for
 * the ones worth showing a column, a question, or a hint about in the
 * current scope.
 */

const Scope = (() => {
  const ALL = [...PEOPLE, ...ACTIVES];

  const RANGES = {
    all: { label: "Everyone", source: () => ALL },
    pledges: { label: "Pledge class", source: () => PEOPLE },
    test36: { label: "Sanders → Whitefield — test range", source: () => PEOPLE, from: 1, to: 36 },
    back36: { label: "Hernandez → Priebe — the other 36", source: () => PEOPLE, from: 37, to: 72 },
    actives: { label: "Actives", source: () => ACTIVES },
    activesA: { label: "Actives: Ty Boatright → Jake Boatright", source: () => ACTIVES, from: 1001, to: 1065 },
    activesB: { label: "Actives: Braden → Zapoli — the rest", source: () => ACTIVES, from: 1066, to: 1116 },
  };

  const FIELDS = [
    { field: "major", label: "Major", plural: "majors" },
    { field: "housing", label: "Housing", plural: "housing" },
    { field: "hometown", label: "Hometown", plural: "hometowns" },
  ];

  const KEY = "byx-scope";
  let current = localStorage.getItem(KEY);
  if (!RANGES[current]) current = "all";

  const listeners = [];

  function peopleIn(key) {
    const r = RANGES[key];
    const people = r.source();
    if (r.from == null) return people;
    return people.filter((p) => p.id >= r.from && p.id <= r.to);
  }

  function getPeople() {
    return peopleIn(current);
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

  /** Anyone on either roster, by id — for modes that store ids, not people. */
  function findById(id) {
    return ALL.find((p) => p.id === id);
  }

  function detailFields(person) {
    return FIELDS.filter((f) => person[f.field]);
  }

  function scopeFields(people = getPeople()) {
    return FIELDS.filter((f) => people.some((p) => p[f.field]));
  }

  /** True when nobody in the current scope has details to study. */
  function namesOnly() {
    return scopeFields().length === 0;
  }

  function matches(person, query) {
    if (!query) return true;
    if (Utils.fullName(person).toLowerCase().includes(query)) return true;
    return FIELDS.some((f) => (person[f.field] || "").toLowerCase().includes(query));
  }

  return {
    FIELDS,
    getPeople,
    peopleIn,
    get,
    set,
    onChange,
    ranges,
    findById,
    detailFields,
    scopeFields,
    namesOnly,
    matches,
  };
})();
