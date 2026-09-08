/**
 * Shared helpers used across all modes.
 */

const Utils = (() => {
  const AVATAR_COLORS = [
    "#4f6df5", "#f5734f", "#2fb787", "#c34fd6",
    "#e0a52c", "#3fa9d8", "#e35b7a", "#7a63e6",
    "#4fb3a9", "#d8783f", "#5c9e2f", "#c74f8e",
  ];

  function fullName(person) {
    return `${person.firstName} ${person.lastName}`;
  }

  function initials(person) {
    return `${person.firstName[0] ?? ""}${person.lastName[0] ?? ""}`.toUpperCase();
  }

  // Deterministic color per person so the same avatar always looks the same.
  function colorFor(person) {
    const str = fullName(person);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
  }

  /**
   * Builds a face element for a person: a real photo if `photo` is set
   * and loads successfully, otherwise a colored initials avatar.
   */
  function buildFace(person, { size = "md" } = {}) {
    const wrap = document.createElement("div");
    wrap.className = `face face-${size}`;
    wrap.style.setProperty("--face-color", colorFor(person));

    if (person.photo) {
      const img = document.createElement("img");
      img.src = person.photo;
      img.alt = "";
      img.loading = "lazy";
      img.onerror = () => {
        img.remove();
        wrap.appendChild(initialsSpan(person));
        wrap.classList.add("face-fallback");
      };
      wrap.appendChild(img);
    } else {
      wrap.appendChild(initialsSpan(person));
      wrap.classList.add("face-fallback");
    }
    return wrap;
  }

  function initialsSpan(person) {
    const span = document.createElement("span");
    span.textContent = initials(person);
    return span;
  }

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Pick `count` random unique wrong values for a field, excluding correct value.
  function distractors(people, field, correctValue, count) {
    const pool = [...new Set(people.map((p) => p[field]).filter((v) => v !== correctValue))];
    return shuffle(pool).slice(0, count);
  }

  function el(tag, className, text) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  return { fullName, initials, colorFor, buildFace, shuffle, distractors, el };
})();
