/**
 * Which set of people the app is currently studying, and which detail
 * fields that set actually has.
 *
 * There are two rosters: the pledge class (js/data.js — full details)
 * and the actives (js/data-actives.js — face-to-name only). Every mode
 * reads its people from Roster.people() instead of a global array, and
 * re-renders through its own reset() when the group changes.
 *
 * Detail fields are optional per person, not per group, so "Everyone"
 * can mix a pledge with a major and an active without one. Ask
 * Roster.detailFields(person) for the fields one person has, or
 * Roster.groupDetailFields() for the ones worth showing a column or a
 * quiz question for across the whole current group.
 */

const Roster = (() => {
  const STORAGE_KEY = "byx-group";

  const FIELDS = [
    { field: "major", label: "Major" },
    { field: "housing", label: "Housing" },
    { field: "hometown", label: "Hometown" },
  ];

  const GROUPS = [
    { key: "pledges", label: "Pledge Class", people: PEOPLE },
    { key: "actives", label: "Actives", people: ACTIVES },
    { key: "everyone", label: "Everyone", people: [...PEOPLE, ...ACTIVES] },
  ];

  const listeners = [];
  let current =
    GROUPS.find((g) => g.key === localStorage.getItem(STORAGE_KEY)) || GROUPS[0];

  function groups() {
    return GROUPS;
  }

  function group() {
    return current;
  }

  function people() {
    return current.people;
  }

  function setGroup(key) {
    const next = GROUPS.find((g) => g.key === key);
    if (!next || next === current) return;
    current = next;
    localStorage.setItem(STORAGE_KEY, key);
    listeners.forEach((fn) => fn(current));
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function detailFields(person) {
    return FIELDS.filter((f) => person[f.field]);
  }

  function groupDetailFields(list = people()) {
    return FIELDS.filter((f) => list.some((p) => p[f.field]));
  }

  /** True when nobody in the current group has any details to study. */
  function namesOnly() {
    return groupDetailFields().length === 0;
  }

  function matches(person, query) {
    if (!query) return true;
    if (Utils.fullName(person).toLowerCase().includes(query)) return true;
    return FIELDS.some((f) => (person[f.field] || "").toLowerCase().includes(query));
  }

  return {
    FIELDS,
    groups,
    group,
    people,
    setGroup,
    onChange,
    detailFields,
    groupDetailFields,
    namesOnly,
    matches,
  };
})();
