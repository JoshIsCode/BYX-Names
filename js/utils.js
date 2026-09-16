/**
 * Shared helpers used across all modes.
 */

const Utils = (() => {
  function fullName(person) {
    return `${person.firstName} ${person.lastName}`;
  }

  function initials(person) {
    return `${person.firstName[0] ?? ""}${person.lastName[0] ?? ""}`.toUpperCase();
  }

  /**
   * Builds a face element for a person: a real photo if `photo` is set
   * and loads successfully, otherwise a plain initials avatar.
   */
  function buildFace(person, { size = "md" } = {}) {
    const wrap = document.createElement("div");
    wrap.className = `face face-${size}`;

    if (person.photo) {
      const img = document.createElement("img");
      img.src = person.photo;
      img.alt = "";
      img.loading = "lazy";
      // Bias the crop toward the detected face instead of a plain
      // center-crop, so cover-cropped photos don't cut off faces.
      const facePos = person.facePos || "50% 38%";
      img.style.objectPosition = facePos;
      // object-position only repositions the existing cover-crop — it
      // never zooms. Most source photos are full-body or waist-up, so
      // without an actual zoom the head stays small. `transform: scale()`
      // anchored at the same point (via transform-origin) zooms in on
      // the head on top of that crop.
      const zoom = person.faceZoom || 1;
      if (zoom > 1) {
        img.style.transformOrigin = facePos;
        img.style.transform = `scale(${zoom})`;
      }
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

  return { fullName, initials, buildFace, shuffle, distractors, el };
})();
