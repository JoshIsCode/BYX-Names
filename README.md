# BYX Names

A simple, mobile-friendly web app for learning everyone's name, major,
housing, and hometown. No build step, no dependencies — just open
`index.html` (or serve the folder) in a browser.

This repo contains real names and photos, so it's kept **private** and
is **not** deployed anywhere public (no GitHub Pages) — see
[Running locally](#running-locally) below.

## Modes

- **Gallery** — a grid of plain text cards (name, major, housing,
  hometown — no photo). Tap a card to expand it in place and reveal
  the details below the name. Multiple cards can stay open at once.
  Adjust the number of columns (1–4) with the slider, and search/filter
  by name, major, housing, or hometown.
- **Flashcards** — one person at a time, photo included. Tap the card
  to flip between the face and the details. Step through with
  Previous/Next or shuffle the deck.
- **Test** — quiz mode. Shows a face and asks for first name, last
  name, major, housing, and hometown (multiple choice), then moves to
  the next person. Choose a short round or the whole roster, and get a
  score + missed-answer review at the end.
- **Match** — a matching game: tap a face, then tap the name you
  think goes with it. Pick a round size and start a new round anytime.
- **List** — a plain, searchable, sortable reference table of
  everyone's info, for quick lookup or old-school studying.

## Roster data

`js/data.js` holds the BYX Pledge Class 2026 roster (name, major,
housing, hometown, photo) parsed from `BYX_Pledge_Class_2026.pdf`.
Photos live in `assets/photos/`, resized/compressed for the web. If a
photo is ever missing or fails to load, the app automatically falls
back to a plain initials avatar, so nothing breaks.

To update or correct an entry, edit its object in the `PEOPLE` array in
`js/data.js` — each one follows this shape:

```js
{
  id:        1,
  firstName: "Jane",
  lastName:  "Doe",
  major:     "Biology",
  housing:   "Founders Hall",
  hometown:  "Dallas, TX",
  photo:     "assets/photos/jane-doe.jpg" // or "" for a placeholder avatar
}
```

> **Note:** this repo contains real names and photos of pledge class
> members. Keep the repository private, and check with the group
> before ever making it public or deploying it anywhere.

## Running locally

Just open `index.html` directly in a browser, or serve the folder with
any static server, e.g.:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
