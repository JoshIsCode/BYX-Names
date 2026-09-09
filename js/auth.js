/**
 * Lightweight password gate.
 *
 * IMPORTANT — what this actually protects: this is a static site with
 * no server, so this is a casual deterrent, not real security. It
 * keeps the roster from loading until the right password is entered
 * and stops search engines/accidental link-clicks from seeing it, but
 * anyone who opens browser devtools can read this file, the photos,
 * and js/data.js directly. Don't rely on this alone for anything more
 * sensitive than "please don't just wander in."
 *
 * CHANGING THE PASSWORD (the shipped one is the placeholder "changeme"
 * — change it before sharing the link):
 *   1. Open any browser's JS console (devtools, or paste into the
 *      address bar of a new tab) and run:
 *
 *        crypto.subtle.digest("SHA-256", new TextEncoder().encode("your-new-password"))
 *          .then(buf => console.log([...new Uint8Array(buf)]
 *            .map(b => b.toString(16).padStart(2, "0")).join("")));
 *
 *   2. Copy the hex string it logs and paste it as PASSWORD_HASH below.
 */

const PASSWORD_HASH = "057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86"; // "changeme"

const UNLOCK_KEY = "byx-unlocked";

// Scripts are loaded only after a successful unlock, so the roster
// data and photos never touch the network (or the DOM) until then.
const APP_SCRIPTS = [
  "js/data.js",
  "js/utils.js",
  "js/gallery.js",
  "js/flashcards.js",
  "js/quiz.js",
  "js/match.js",
  "js/list.js",
  "js/main.js",
];

(() => {
  const gate = document.getElementById("auth-gate");
  const appRoot = document.getElementById("app-root");
  const form = document.getElementById("auth-form");
  const passwordInput = document.getElementById("auth-password");
  const errorEl = document.getElementById("auth-error");

  async function sha256Hex(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function loadScriptsThenInit(i = 0) {
    if (i >= APP_SCRIPTS.length) {
      window.initApp?.();
      return;
    }
    const script = document.createElement("script");
    script.src = APP_SCRIPTS[i];
    script.onload = () => loadScriptsThenInit(i + 1);
    document.body.appendChild(script);
  }

  function unlock() {
    gate.hidden = true;
    appRoot.hidden = false;
    loadScriptsThenInit();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const hash = await sha256Hex(passwordInput.value);
    if (hash === PASSWORD_HASH) {
      localStorage.setItem(UNLOCK_KEY, "1");
      unlock();
    } else {
      errorEl.hidden = false;
      passwordInput.select();
    }
  });

  if (localStorage.getItem(UNLOCK_KEY) === "1") {
    unlock();
  } else {
    passwordInput.focus();
  }
})();
