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
   *
   * The photo is rendered as a background-image (cover-fit + zoom) on
   * a plain sized div, rather than an <img> with object-fit + a CSS
   * transform: scale() for the zoom. That combination — a scaled
   * transform inside two nested overflow:hidden ancestors, which is
   * exactly the gallery/flashcard/match-tile structure — silently
   * fails to visually crop/zoom in at least some browser engines
   * (computed styles all check out correct; nothing paints as
   * expected).
   *
   * The zoom itself (enlarging + shifting the background layer) is
   * sized in real measured pixels, not CSS percentages: percentages
   * chained through this component's several nested 100%-of-parent
   * layers also failed to visually apply in testing (again with
   * fully correct computed styles) even with no transform involved
   * at all. Pixels measured post-layout sidestep that too.
   */
  function buildFace(person, { size = "md" } = {}) {
    const wrap = document.createElement("div");
    wrap.className = `face face-${size}`;

    if (person.photo) {
      const facePos = person.facePos || "50% 38%";
      const zoom = person.faceZoom || 1;
      const [fx, fy] = facePos.split(" ").map((v) => parseFloat(v) / 100);

      const outer = document.createElement("div");
      outer.className = "face-photo-outer";

      const inner = document.createElement("div");
      inner.className = "face-photo-inner";
      inner.style.backgroundImage = `url("${person.photo}")`;
      inner.style.backgroundPosition = facePos;
      outer.appendChild(inner);
      wrap.appendChild(outer);

      if (zoom > 1) {
        // Needs a real layout box, so this only works once the caller
        // has attached `wrap` to the document — true by the next frame
        // in every mode here (each appends synchronously right after
        // calling this).
        requestAnimationFrame(() => {
          const rect = outer.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          inner.style.width = `${rect.width * zoom}px`;
          inner.style.height = `${rect.height * zoom}px`;
          inner.style.left = `${fx * rect.width * (1 - zoom)}px`;
          inner.style.top = `${fy * rect.height * (1 - zoom)}px`;
        });
      }

      // background-image has no onerror, so probe the same URL with a
      // throwaway Image() to detect a missing/broken photo.
      const probe = new Image();
      probe.onerror = () => {
        outer.remove();
        wrap.appendChild(initialsSpan(person));
        wrap.classList.add("face-fallback");
      };
      probe.src = person.photo;
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
